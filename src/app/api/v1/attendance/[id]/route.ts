import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { attendanceStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  studentName: z.string().optional(),
  time: z.string().optional(),
  status: z.enum(['present', 'late', 'absent']).optional(),
  method: z.string().optional(),
  date: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'attendance:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const record = attendanceStore.get(id);
  if (!record) {
    return NextResponse.json(fail('Data absensi tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ record }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'attendance:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = attendanceStore.get(id);
  if (!existing) {
    return NextResponse.json(fail('Data absensi tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
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

  const updated = attendanceStore.update(id, parsed.data);
  if (!updated) {
    return NextResponse.json(fail('Data absensi tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ record: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'attendance:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = attendanceStore.remove(id);
  if (!deleted) {
    return NextResponse.json(fail('Data absensi tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ deleted: true }, requestId));
}
