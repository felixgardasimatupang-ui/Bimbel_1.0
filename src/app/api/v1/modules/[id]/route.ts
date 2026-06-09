import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { moduleStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  title: z.string().optional(),
  subject: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const module = moduleStore.get(id);
  if (!module) {
    return NextResponse.json(fail('Module tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ module }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = moduleStore.get(id);
  if (!existing) {
    return NextResponse.json(fail('Module tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
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

  const updated = moduleStore.update(id, parsed.data);
  if (!updated) {
    return NextResponse.json(fail('Module tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ module: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = moduleStore.remove(id);
  if (!deleted) {
    return NextResponse.json(fail('Module tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ deleted: true }, requestId));
}
