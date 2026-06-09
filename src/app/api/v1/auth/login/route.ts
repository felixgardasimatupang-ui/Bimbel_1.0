import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fail, ok, getRequestId } from '@/server/api';
import { authenticateLogin } from '@/server/auth';
import { getSessionStore, createSignedSessionId } from '@/server/session-store';
import { createMfaChallenge } from '@/server/mfa';
import { checkRateLimit, checkRateLimitRedis, getClientIp, isRedisAvailable } from '@/lib/rate-limiter';
import { loginSchema } from '@/lib/validation/schemas';
import { validateBody } from '@/lib/validation/middleware';
import { validateCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  const csrf = validateCsrf(request);
  if (!csrf.ok) {
    return NextResponse.json(fail(csrf.error, 'csrf_invalid', undefined, requestId), { status: 403 });
  }

  const ip = getClientIp(request);
  const rateLimit = isRedisAvailable()
    ? await checkRateLimitRedis(`login:${ip}`)
    : checkRateLimit(`login:${ip}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      fail('Terlalu banyak percobaan masuk. Silakan coba lagi nanti.', 'rate_limited', undefined, requestId),
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
        }
      }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json', undefined, requestId), { status: 400 });
  }

  const validation = validateBody(loginSchema, body);
  if (validation.error) {
    return NextResponse.json({ ...validation.error, requestId }, { status: 400 });
  }

  const { identifier, password, branchCode } = validation.data!;

  const result = await authenticateLogin({ identifier, password, branchCode });

  if (!result.ok) {
    return NextResponse.json(fail(result.error, result.code, undefined, requestId), { status: 401 });
  }

  if (result.user.isMfaRequired) {
    const challenge = createMfaChallenge(
      result.session.userId,
      result.session.branchId,
      result.session.roleCodes,
      result.session.permissions,
    );
    return NextResponse.json(
      ok({
        mfaRequired: true,
        challengeId: challenge.challengeId,
        otpauth: challenge.otpauth,
        currentCode: challenge.currentCode,
        pendingUser: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          phone: result.user.phone,
        },
        pendingBranch: {
          name: result.branch.name,
          code: result.branch.code,
        },
        pendingRoles: result.session.roleCodes,
        pendingPermissions: result.session.permissions,
      }, requestId)
    );
  }

  const store = getSessionStore();
  const persistedSessionId = await store.create({
    userId: result.session.userId,
    branchId: result.session.branchId,
    roleCodes: result.session.roleCodes,
    permissions: result.session.permissions,
    expiresAt: result.session.expiresAt,
  });

  const signedId = createSignedSessionId(persistedSessionId);

  const cookieStore = await cookies();
  cookieStore.set('session_id', signedId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  cookieStore.set('branch_id', result.session.branchId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json(
    ok({
      user: result.user,
      branch: result.branch,
      session: result.session
    }, requestId)
  );
}
