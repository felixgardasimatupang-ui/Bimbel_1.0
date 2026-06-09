import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { batchStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  batchName: z.string().optional(),
  personCount: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  status: z.enum(['draft', 'ready', 'pending_approval']).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'payroll:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const batch = batchStore.get(id);
  if (!batch) {
    return NextResponse.json(fail('Batch tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ batch }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'payroll:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = batchStore.get(id);
  if (!existing) {
    return NextResponse.json(fail('Batch tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json', undefined, requestId), { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Data tidak valid.';
    return NextResponse.json(fail(msg, 'validation_error', undefined, requestId), { status: 400 });
  }

  const updated = batchStore.update(id, parsed.data);
  if (!updated) {
    return NextResponse.json(fail('Batch tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ batch: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'payroll:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = batchStore.remove(id);
  if (!deleted) {
    return NextResponse.json(fail('Batch tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ deleted: true }, requestId));
}
