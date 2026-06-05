import { type ZodSchema } from 'zod';
import { fail } from '@/server/api';
import type { ApiEnvelope } from '@/server/api';

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): { data?: T; error?: ApiEnvelope<never> } {
  const result = schema.safeParse(body);

  if (!result.success) {
    const issues = result.error.issues;
    const firstError = issues[0];
    return {
      error: fail(
        firstError?.message ?? 'Validasi gagal.',
        'validation_error',
        { issues: issues.map((e) => ({ field: e.path.join('.'), message: e.message })) }
      )
    };
  }

  return { data: result.data };
}

export function validateQuery<T>(schema: ZodSchema<T>, searchParams: URLSearchParams): { data?: T; error?: ApiEnvelope<never> } {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const result = schema.safeParse(raw);

  if (!result.success) {
    return {
      error: fail('Parameter query tidak valid.', 'validation_error')
    };
  }

  return { data: result.data };
}
