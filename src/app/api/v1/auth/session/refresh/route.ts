import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fail, ok, getRequestId } from '@/server/api';
import { getSessionStore, createSignedSessionId, verifySignedSessionId } from '@/server/session-store';

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get('session_id')?.value;

  if (!rawCookie) {
    return NextResponse.json(fail('Tidak ada session.', 'not_authenticated', undefined, requestId), { status: 401 });
  }

  const sessionId = verifySignedSessionId(rawCookie);
  if (!sessionId) {
    return NextResponse.json(fail('Session tidak valid.', 'invalid_session', undefined, requestId), { status: 401 });
  }

  const store = getSessionStore();
  const extended = await store.extend(sessionId);

  if (!extended) {
    cookieStore.delete('session_id');
    cookieStore.delete('branch_id');
    return NextResponse.json(fail('Session sudah kedaluwarsa.', 'session_expired', undefined, requestId), { status: 401 });
  }

  const newSignedId = createSignedSessionId(sessionId);

  cookieStore.set('session_id', newSignedId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json(ok({
    sessionId,
    expiresAt: extended.expiresAt,
  }, requestId));
}
