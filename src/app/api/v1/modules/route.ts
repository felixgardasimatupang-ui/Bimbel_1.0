import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { moduleStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  title: z.string(),
  subject: z.string(),
  type: z.string(),
  status: z.enum(['published', 'draft']),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:read' });
  if (auth instanceof Response) return auth;

  const modules = moduleStore.list();
  return NextResponse.json(ok({ modules }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
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

  const module = moduleStore.create(parsed.data, 'mod');
  return NextResponse.json(ok({ module }, requestId), { status: 201 });
}
