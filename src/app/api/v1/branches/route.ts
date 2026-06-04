import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { branches } from '@/server/catalog';

export function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  const filteredBranches =
    status && status !== 'all'
      ? branches.filter((branch) => branch.status === status)
      : branches;

  return NextResponse.json(
    ok({
      items: filteredBranches,
      total: filteredBranches.length
    })
  );
}
