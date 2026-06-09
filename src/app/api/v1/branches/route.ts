import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { branches } from '@/server/catalog';
import { requireAuth } from '@/server/session-store';
import { branchQuerySchema } from '@/lib/validation/schemas';

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const query = branchQuerySchema.safeParse(Object.fromEntries(url.searchParams));

  const status = query.success ? query.data.status : undefined;

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
