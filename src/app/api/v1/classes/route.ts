import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { classStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  subject: z.string(),
  className: z.string(),
  day: z.string(),
  time: z.string(),
  room: z.string(),
  tutor: z.string(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'scheduling:read' });
  if (auth instanceof Response) return auth;

  const classes = classStore.list();
  return NextResponse.json(ok({ classes }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'scheduling:manage' });
  if (auth instanceof Response) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json', undefined, requestId), { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Data tidak valid.';
    return NextResponse.json(fail(msg, 'validation_error', undefined, requestId), { status: 400 });
  }

  const entry = classStore.create(parsed.data, 'cls');
  return NextResponse.json(ok({ class: entry }, requestId), { status: 201 });
}
