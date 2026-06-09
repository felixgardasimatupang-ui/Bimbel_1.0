import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { verifyMfaCode } from '@/server/mfa';
import { getSessionStore, createSignedSessionId } from '@/server/session-store';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { validateCsrf } from '@/lib/csrf';

const verifySchema = z.object({
  challengeId: z.string().min(1),
  token: z.string().regex(/^\d{6}$/, 'Kode harus 6 digit angka'),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  const csrf = validateCsrf(request);
  if (!csrf.ok) {
    return NextResponse.json(fail(csrf.error, 'csrf_invalid', undefined, requestId), { status: 403 });
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`mfa:${ip}`, { windowMs: 60_000, maxRequests: 5 });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      fail('Too many attempts. Please try again later.', 'rate_limited', undefined, requestId),
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail('Invalid JSON payload.', 'invalid_json', undefined, requestId), { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const msg = firstIssue?.message ?? 'Invalid request.';
    return NextResponse.json(fail(msg, 'validation_error', undefined, requestId), { status: 400 });
  }

  const { challengeId, token } = parsed.data;
  const verification = verifyMfaCode(challengeId, token);

  if (!verification.ok) {
    return NextResponse.json(fail(verification.error, 'mfa_verification_failed', undefined, requestId), { status: 401 });
  }

  const store = getSessionStore();
  const sessionId = await store.create({
    userId: verification.userId,
    branchId: verification.branchId,
    roleCodes: verification.roleCodes,
    permissions: verification.permissions,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  });

  const signedId = createSignedSessionId(sessionId);

  const cookieStore = await cookies();
  cookieStore.set('session_id', signedId, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  });
  cookieStore.set('branch_id', verification.branchId, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  });

  return NextResponse.json(ok({
    sessionId,
    userId: verification.userId,
    branchId: verification.branchId,
    roleCodes: verification.roleCodes,
    permissions: verification.permissions,
  }, requestId));
}
