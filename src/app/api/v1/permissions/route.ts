import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { listAllPermissions } from '@/server/rbac';

export function GET() {
  return NextResponse.json(
    ok({
      items: listAllPermissions(),
      total: listAllPermissions().length
    })
  );
}
