import { NextResponse } from 'next/server';

import { ok } from '@/server/api';
import { listAuditEvents } from '@/server/audit-store';

export function GET(request: Request) {
  const url = new URL(request.url);
  const branchId = url.searchParams.get('branchId');

  const events = listAuditEvents().filter((event) => {
    if (!branchId) {
      return true;
    }

    return event.branchId === branchId;
  });

  return NextResponse.json(
    ok({
      items: events,
      total: events.length
    })
  );
}
