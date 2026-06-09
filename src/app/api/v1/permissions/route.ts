import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { requireAuth } from '@/server/session-store';
import { listAllPermissions } from '@/server/rbac';

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const items = listAllPermissions();
  return NextResponse.json(ok({ items, total: items.length }));
}
