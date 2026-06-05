import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { listAllPermissions } from '@/server/rbac';

export function GET() {
  const items = listAllPermissions();
  return NextResponse.json(ok({ items, total: items.length }));
}
