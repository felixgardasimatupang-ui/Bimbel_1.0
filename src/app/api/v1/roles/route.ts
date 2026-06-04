import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { roles } from '@/server/catalog';

export function GET() {
  return NextResponse.json(
    ok({
      items: roles,
      total: roles.length
    })
  );
}
