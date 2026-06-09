import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { getRole, updateRole, deleteRole } from '@/server/role-store';
import { requireAuth } from '@/server/session-store';

const updateSchema = z.object({
  code: z.string().min(2).max(20).regex(/^[a-z_]+$/, 'Hanya huruf kecil dan underscore').optional(),
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(4).max(200).optional(),
  permissions: z.array(z.string()).min(0).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'roles:read' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const role = getRole(id);
  if (!role) {
    return NextResponse.json(fail('Role tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ role }, requestId));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'roles:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const existing = getRole(id);
  if (!existing) {
    return NextResponse.json(fail('Role tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
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

  const updated = updateRole(id, parsed.data);
  if (!updated) {
    return NextResponse.json(fail('Role tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ role: updated }, requestId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'roles:manage' });
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const deleted = deleteRole(id);
  if (!deleted) {
    return NextResponse.json(fail('Role tidak ditemukan.', 'not_found', undefined, requestId), { status: 404 });
  }

  return NextResponse.json(ok({ deleted: true }, requestId));
}
