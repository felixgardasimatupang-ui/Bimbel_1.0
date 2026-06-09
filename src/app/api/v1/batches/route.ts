import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { batchStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  batchName: z.string(),
  personCount: z.number().positive(),
  amount: z.number().positive(),
  status: z.enum(['draft', 'ready', 'pending_approval']),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'payroll:read' });
  if (auth instanceof Response) return auth;

  const batches = batchStore.list();
  return NextResponse.json(ok({ batches }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'payroll:manage' });
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

  const batch = batchStore.create(parsed.data, 'pay');
  return NextResponse.json(ok({ batch }, requestId), { status: 201 });
}
