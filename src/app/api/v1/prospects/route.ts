import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { prospectStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  name: z.string(),
  phone: z.string(),
  source: z.string(),
  status: z.enum(['prospect', 'contacted', 'trial', 'registered']),
  tier: z.enum(['high', 'medium', 'low']),
  notes: z.string(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:read' });
  if (auth instanceof Response) return auth;

  const prospects = prospectStore.list();
  return NextResponse.json(ok({ prospects }, requestId));
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

  const prospect = prospectStore.create(parsed.data, 'prs');
  return NextResponse.json(ok({ prospect }, requestId), { status: 201 });
}
