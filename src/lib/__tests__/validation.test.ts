import { describe, it, expect } from 'vitest';
import { auditLogQuerySchema, loginSchema } from '@/lib/validation/schemas';

describe('validation schemas', () => {
  describe('auditLogQuerySchema', () => {
    it('accepts valid branchId slug format', () => {
      const result = auditLogQuerySchema.safeParse({ branchId: 'branch-pusat' });
      expect(result.success).toBe(true);
    });

    it('accepts UUID format branchId', () => {
      const result = auditLogQuerySchema.safeParse({
        branchId: '550e8400-e29b-41d4-a716-446655440000'
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty query', () => {
      const result = auditLogQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts undefined branchId', () => {
      const result = auditLogQuerySchema.safeParse({ branchId: undefined });
      expect(result.success).toBe(true);
    });

    it('rejects non-string branchId', () => {
      const result = auditLogQuerySchema.safeParse({ branchId: 123 });
      expect(result.success).toBe(false);
    });
  });

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
  });
});
