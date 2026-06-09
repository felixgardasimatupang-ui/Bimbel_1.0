import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fail, ok, getRequestId } from '@/server/api';
import { courseStore } from '@/server/data-store';
import { requireAuth } from '@/server/session-store';

const createSchema = z.object({
  title: z.string(),
  subject: z.string(),
  grade: z.string(),
  lessonCount: z.number().positive(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:read' });
  if (auth instanceof Response) return auth;

  const courses = courseStore.list();
  return NextResponse.json(ok({ courses }, requestId));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAuth(request, { permission: 'students:manage' });
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

  const course = courseStore.create(parsed.data, 'crs');
  return NextResponse.json(ok({ course }, requestId), { status: 201 });
}
