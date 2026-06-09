import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { requireAuth } from '@/server/session-store';
import { screens } from '@/lib/screens';

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  return NextResponse.json(
    ok({
      items: screens,
      total: screens.length
    })
  );
}
