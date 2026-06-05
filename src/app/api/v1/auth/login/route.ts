import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fail, ok } from '@/server/api';
import { authenticateLogin } from '@/server/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { loginSchema } from '@/lib/validation/schemas';
import { validateBody } from '@/lib/validation/middleware';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${ip}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      fail('Terlalu banyak percobaan masuk. Silakan coba lagi nanti.', 'rate_limited'),
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
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json'), { status: 400 });
  }

  const validation = validateBody(loginSchema, body);
  if (validation.error) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const { identifier, password, branchCode } = validation.data!;

  const result = await authenticateLogin({ identifier, password, branchCode });

  if (!result.ok) {
    return NextResponse.json(fail(result.error, result.code), { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('session_id', result.session.sessionId, {
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
    })
  );
}
