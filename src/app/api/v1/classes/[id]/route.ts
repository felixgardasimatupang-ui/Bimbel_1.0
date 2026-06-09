import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { classStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  subject: z.string().optional(),
  className: z.string().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  room: z.string().optional(),
  tutor: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'scheduling:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const entry = classStore.get(id);
  if (!entry) {
    return NextResponse.json(fail('Kelas tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ class: entry }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'scheduling:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = classStore.get(id);
  if (!existing) {
    return NextResponse.json(fail('Kelas tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
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

  const updated = classStore.update(id, parsed.data);
  if (!updated) {
    return NextResponse.json(fail('Kelas tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ class: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'scheduling:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = classStore.remove(id);
  if (!deleted) {
    return NextResponse.json(fail('Kelas tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ deleted: true }, requestId));
}
