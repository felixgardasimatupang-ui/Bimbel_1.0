import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { screens } from '@/lib/screens';

export function GET() {
  return NextResponse.json(
    ok({
      items: screens,
      total: screens.length
    })
  );
}
