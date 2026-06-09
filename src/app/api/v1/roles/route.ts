import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { listRoles, createRole, ALL_PERMISSIONS } from '@/server/role-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  code: z.string().min(2).max(20).regex(/^[a-z_]+$/, 'Hanya huruf kecil dan underscore'),
  name: z.string().min(2).max(50),
  description: z.string().min(4).max(200),
  permissions: z.array(z.string()).min(0),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'roles:read' });
  if (auth instanceof Response) return auth;

  const roles = listRoles();
  return NextResponse.json(ok({ roles, allPermissions: ALL_PERMISSIONS }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'roles:manage' });
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

  const existing = listRoles().find((r) => r.code === parsed.data.code);
  if (existing) {
    return NextResponse.json(fail('Kode role sudah digunakan.', 'duplicate_code', undefined, requestId), { status: 409 });
  }

  const role = createRole({
    code: parsed.data.code,
    name: parsed.data.name,
    description: parsed.data.description,
    permissions: parsed.data.permissions,
  });
  return NextResponse.json(ok({ role }, requestId), { status: 201 });
}
