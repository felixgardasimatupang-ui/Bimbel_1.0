import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { progressStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  studentName: z.string().min(2).optional(),
  subject: z.string().min(2).optional(),
  score: z.number().min(0).max(100).optional(),
  grade: z.string().min(2).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const item = progressStore.get(id);
  if (!item) return NextResponse.json(fail('Tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });

  return NextResponse.json(ok({ item }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = progressStore.get(id);
  if (!existing) return NextResponse.json(fail('Tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json', undefined, requestId), { status: 400 }); }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Data tidak valid.';
    return NextResponse.json(fail(msg, 'validation_error', undefined, requestId), { status: 400 });
  }

  const updated = progressStore.update(id, parsed.data);
  return NextResponse.json(ok({ item: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = progressStore.remove(id);
  if (!deleted) return NextResponse.json(fail('Tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });

  return NextResponse.json(ok({ deleted: true }, requestId));
}
