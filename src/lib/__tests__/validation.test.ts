import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/lib/validation/schemas';

describe('validation schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid login input', () => {
      const result = loginSchema.safeParse({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!'
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty identifier', () => {
      const result = loginSchema.safeParse({
        identifier: '',
        password: 'Admin123!'
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        identifier: 'admin@bimbel.one',
        password: ''
      });
      expect(result.success).toBe(false);
    });

    it('accepts optional branchCode', () => {
      const result = loginSchema.safeParse({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!',
        branchCode: 'HQ-01'
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty string branchCode', () => {
      const result = loginSchema.safeParse({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!',
        branchCode: ''
      });
      expect(result.success).toBe(false);
    });
  });
});
