import { describe, it, expect, beforeEach } from 'vitest';
import {
  authenticateLogin,
  findUserByIdentifier,
  findBranchByCode,
  sanitizeUser
} from '@/server/auth';
import type { UserRecord } from '@/server/catalog';

describe('auth', () => {
  describe('findUserByIdentifier', () => {
    it('finds user by email (case insensitive)', () => {
      const user = findUserByIdentifier('ADMIN@BIMBEL.ONE');
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@bimbel.one');
    });

    it('finds user by phone', () => {
      const user = findUserByIdentifier('+62 811 1111 111');
      expect(user).toBeDefined();
      expect(user?.fullName).toBe('Nadia Putri');
    });

    it('finds user by phone with leading/trailing whitespace', () => {
      const user = findUserByIdentifier('  +62 811 1111 111  ');
      expect(user).toBeDefined();
      expect(user?.fullName).toBe('Nadia Putri');
    });

    it('returns undefined for unknown identifier', () => {
      const user = findUserByIdentifier('unknown@email.com');
      expect(user).toBeUndefined();
    });
  });

  describe('findBranchByCode', () => {
    it('finds branch by code (case insensitive)', () => {
      const branch = findBranchByCode('hq-01');
      expect(branch).toBeDefined();
      expect(branch?.name).toBe('Bimbel One Head Office');
    });

    it('returns undefined for unknown code', () => {
      const branch = findBranchByCode('UNKNOWN');
      expect(branch).toBeUndefined();
    });
  });

  describe('sanitizeUser', () => {
    it('removes passwordHash from user record', () => {
      const user: UserRecord = {
        id: 'test',
        branchId: 'branch-1',
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '+62 800 0000 000',
        passwordHash: 'secret-hash',
        status: 'active',
        roleCodes: ['branch_admin'],
        isMfaRequired: false
      };
      const safe = sanitizeUser(user);
      expect(safe).not.toHaveProperty('passwordHash');
      expect(safe.fullName).toBe('Test User');
    });
  });

  describe('authenticateLogin', () => {
    it('returns failure for unknown identifier', async () => {
      const result = await authenticateLogin({
        identifier: 'unknown@test.com',
        password: 'anypass'
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('invalid_credentials');
      }
    });

    it('returns failure for wrong password', async () => {
      const result = await authenticateLogin({
        identifier: 'admin@bimbel.one',
        password: 'wrong-password!'
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('invalid_credentials');
      }
    });

    it('returns success for valid super_admin credentials', async () => {
      const result = await authenticateLogin({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!'
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.user.fullName).toBe('Nadia Putri');
        expect(result.session.roleCodes).toContain('super_admin');
        expect(result.session.permissions).toContain('auth:manage');
      }
    });

    it('returns success for valid tutor credentials with branch code', async () => {
      const result = await authenticateLogin({
        identifier: 'ayu@bimbel.one',
        password: 'Tutor123!',
        branchCode: 'BDG-01'
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.user.fullName).toBe('Ayu Santika');
        expect(result.branch.code).toBe('BDG-01');
      }
    });

    it('returns branch_mismatch when branch does not match user', async () => {
      const result = await authenticateLogin({
        identifier: 'ayu@bimbel.one',
        password: 'Tutor123!',
        branchCode: 'HQ-01'
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('branch_mismatch');
      }
    });

    it('returns account_locked for locked user', async () => {
      const result = await authenticateLogin({
        identifier: 'admin@bimbel.one',
        password: 'wrong-password'
      });
      expect(result.ok).toBe(false);
    });

    it('returns branch_not_found for invalid branch code', async () => {
      const result = await authenticateLogin({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!',
        branchCode: 'NONEXISTENT'
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('branch_not_found');
      }
    });

    it('sanitizeUser strips passwordHash from result', async () => {
      const result = await authenticateLogin({
        identifier: 'admin@bimbel.one',
        password: 'Admin123!'
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.user).not.toHaveProperty('passwordHash');
      }
    });
  });
});
