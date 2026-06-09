import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { requireAuth } from '@/server/session-store';
import { listAuditEventsPaginated } from '@/server/audit-store';

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const branchId = url.searchParams.get('branchId');
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20', 10)));

  const result = listAuditEventsPaginated({ branchId: branchId || undefined, page, pageSize });

  return NextResponse.json(ok(result));
}
