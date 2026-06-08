import { describe, it, expect } from 'vitest';
import { getRole, getPermissionsForRoleCodes, hasPermission, listAllPermissions } from '@/server/rbac';
import type { RoleCode } from '@/server/catalog';

describe('rbac', () => {
  describe('getRole', () => {
    it('returns role for valid code', () => {
      const role = getRole('super_admin');
      expect(role).toBeDefined();
      expect(role?.code).toBe('super_admin');
      expect(role?.name).toBe('Super Admin');
    });

    it('returns undefined for invalid code', () => {
      const role = getRole('nonexistent' as RoleCode);
      expect(role).toBeUndefined();
    });
  });

  describe('getPermissionsForRoleCodes', () => {
    it('returns all permissions for super_admin', () => {
      const permissions = getPermissionsForRoleCodes(['super_admin']);
      expect(permissions).toContain('auth:manage');
      expect(permissions).toContain('branches:manage');
      expect(permissions).toContain('students:manage');
    });

    it('returns aggregate permissions for multiple roles', () => {
      const permissions = getPermissionsForRoleCodes(['tutor', 'parent']);
      expect(permissions).toContain('students:read');
      expect(permissions).toContain('attendance:create');
      expect(permissions).toContain('billing:read');
    });

    it('returns sorted permissions', () => {
      const permissions = getPermissionsForRoleCodes(['finance']);
      for (let i = 1; i < permissions.length; i++) {
        expect(permissions[i] >= permissions[i - 1]).toBe(true);
      }
    });

    it('returns empty array for unknown role codes', () => {
      const permissions = getPermissionsForRoleCodes(['unknown' as RoleCode]);
      expect(permissions).toEqual([]);
    });
  });

  describe('hasPermission', () => {
    it('returns true when role has permission', () => {
      expect(hasPermission(['super_admin'], 'auth:manage')).toBe(true);
      expect(hasPermission(['finance'], 'billing:manage')).toBe(true);
    });

    it('returns false when role lacks permission', () => {
      expect(hasPermission(['tutor'], 'billing:manage')).toBe(false);
      expect(hasPermission(['parent'], 'branches:manage')).toBe(false);
    });

    it('returns true when any role has permission', () => {
      expect(hasPermission(['tutor', 'finance'], 'billing:manage')).toBe(true);
    });
  });

  describe('listAllPermissions', () => {
    it('returns all unique permissions sorted', () => {
      const all = listAllPermissions();
      expect(all.length).toBeGreaterThan(0);
      expect(all).toContain('auth:manage');
      expect(all).toContain('students:read');
    });
  });

  describe('edge cases', () => {
    it('hasPermission with empty role array returns false', () => {
      expect(hasPermission([], 'auth:manage')).toBe(false);
    });

    it('hasPermission with unknown role code returns false', () => {
      expect(hasPermission(['nonexistent' as RoleCode], 'auth:manage')).toBe(false);
    });

    it('getPermissionsForRoleCodes returns deduplicated permissions', () => {
      const perms = getPermissionsForRoleCodes(['super_admin', 'super_admin']);
      const count = perms.filter(p => p === 'auth:manage').length;
      expect(count).toBe(1);
    });
  });
});
