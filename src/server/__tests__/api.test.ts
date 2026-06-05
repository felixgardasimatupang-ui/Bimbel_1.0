import { describe, it, expect } from 'vitest';
import { ok, fail } from '@/server/api';

describe('api envelope', () => {
  it('ok returns success with data', () => {
    const result = ok({ id: '1', name: 'test' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: '1', name: 'test' });
  });

  it('ok returns success with primitive data', () => {
    const result = ok('hello');
    expect(result.success).toBe(true);
    expect(result.data).toBe('hello');
  });

  it('fail returns error with message and code', () => {
    const result = fail('Not found', 'not_found');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Not found');
    expect(result.error?.code).toBe('not_found');
  });

  it('fail returns error with details', () => {
    const result = fail('Validation failed', 'validation_error', { field: 'email' });
    expect(result.success).toBe(false);
    expect(result.error?.details).toEqual({ field: 'email' });
  });

  it('fail returns error without optional fields', () => {
    const result = fail('Something went wrong');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Something went wrong');
    expect(result.error?.code).toBeUndefined();
    expect(result.error?.details).toBeUndefined();
  });
});
