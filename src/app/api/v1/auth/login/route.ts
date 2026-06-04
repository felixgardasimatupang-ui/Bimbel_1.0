import { NextResponse } from 'next/server';

import { fail, ok } from '@/server/api';
import { authenticateLogin } from '@/server/auth';

type LoginBody = {
  identifier?: string;
  password?: string;
  branchCode?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(fail('Payload JSON tidak valid.', 'invalid_json'), { status: 400 });
  }

  if (!body.identifier || !body.password) {
    return NextResponse.json(fail('Identitas dan kata sandi wajib diisi.', 'validation_error'), { status: 400 });
  }

  const result = authenticateLogin({
    identifier: body.identifier,
    password: body.password,
    branchCode: body.branchCode
  });

  if (!result.ok) {
    return NextResponse.json(fail(result.error, result.code), { status: 401 });
  }

  return NextResponse.json(
    ok({
      user: result.user,
      branch: result.branch,
      session: result.session
    })
  );
}
