import { NextResponse } from 'next/server';

import { ok } from '@/server/api';

export function GET() {
  return NextResponse.json(
    ok({
      status: 'ok',
      service: 'bimbel-one-platform',
      version: 'v1',
      timestamp: new Date().toISOString()
    })
  );
}
