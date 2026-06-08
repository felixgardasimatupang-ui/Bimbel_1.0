import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateBody, validateQuery } from '@/lib/validation/middleware';

const testSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  age: z.number().min(0).optional()
});

describe('validateBody', () => {
  it('returns parsed data for valid input', () => {
    const result = validateBody(testSchema, { name: 'Test', age: 25 });
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.data?.name).toBe('Test');
    expect(result.data?.age).toBe(25);
  });

  it('returns parsed data without optional fields', () => {
    const result = validateBody(testSchema, { name: 'Test' });
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.data?.name).toBe('Test');
    expect(result.data?.age).toBeUndefined();
  });

  it('returns error with validation_error code for invalid input', () => {
    const result = validateBody(testSchema, { name: '' });
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.success).toBe(false);
    expect(result.error?.error?.code).toBe('validation_error');
  });

  it('returns formatted field issues in error details', () => {
    const result = validateBody(testSchema, { name: '', age: -1 });
    expect(result.error).toBeDefined();
    expect(result.error?.error?.details?.issues).toBeDefined();
    const issues = result.error?.error?.details?.issues as Array<{ field: string; message: string }>;
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].field).toBe('name');
  });

  it('returns error message from first Zod issue', () => {
    const result = validateBody(testSchema, { name: '' });
    expect(result.error?.error?.message).toBe('Nama wajib diisi.');
  });

  it('handles non-object input gracefully', () => {
    const result = validateBody(testSchema, 'not-an-object');
    expect(result.error).toBeDefined();
    expect(result.error?.error?.code).toBe('validation_error');
  });
});

describe('validateQuery', () => {
  it('returns parsed data for valid query params', () => {
    const params = new URLSearchParams({ name: 'Test' });
    const result = validateQuery(testSchema, params);
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.data?.name).toBe('Test');
  });

  it('returns error for invalid query params', () => {
    const params = new URLSearchParams({ name: '' });
    const result = validateQuery(testSchema, params);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.error?.message).toBe('Parameter query tidak valid.');
  });

  it('returns error with validation_error code', () => {
    const params = new URLSearchParams({ name: '' });
    const result = validateQuery(testSchema, params);
    expect(result.error?.error?.code).toBe('validation_error');
  });

  it('handles empty search params', () => {
    const params = new URLSearchParams();
    const result = validateQuery(testSchema, params);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
  });
});
