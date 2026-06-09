import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { invoiceStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  invoiceNo: z.string().min(2),
  studentName: z.string().min(2),
  amount: z.number().positive(),
  status: z.enum(['pending', 'partial', 'paid']),
  dueDate: z.string(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'billing:read' });
  if (auth instanceof Response) return auth;

  const invoices = invoiceStore.list();
  return NextResponse.json(ok({ invoices }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'billing:manage' });
  if (auth instanceof Response) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json', undefined, requestId), { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Data tidak valid.';
    return NextResponse.json(fail(msg, 'validation_error', undefined, requestId), { status: 400 });
  }

  const invoice = invoiceStore.create(parsed.data, 'inv');
  return NextResponse.json(ok({ invoice }, requestId), { status: 201 });
}
