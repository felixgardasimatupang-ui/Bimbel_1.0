import { describe, it, expect } from 'vitest';
import { branches, roles, users, permissionCatalog } from '@/server/catalog';

describe('catalog', () => {
  describe('branches', () => {
    it('has exactly 4 branches', () => {
      expect(branches).toHaveLength(4);
    });

    it('branch IDs match expected values', () => {
      const ids = branches.map(b => b.id).sort();
      expect(ids).toEqual([
        'branch-bandung',
        'branch-jkt-selatan',
        'branch-pusat',
        'branch-surabaya'
      ]);
    });
  });

  describe('roles', () => {
    it('has exactly 6 roles', () => {
      expect(roles).toHaveLength(6);
    });

    it('super_admin has auth:manage and branches:manage', () => {
      const superAdmin = roles.find(r => r.code === 'super_admin');
      expect(superAdmin).toBeDefined();
      expect(superAdmin?.permissions).toContain('auth:manage');
      expect(superAdmin?.permissions).toContain('branches:manage');
    });

    it('no role has duplicate permissions', () => {
      for (const role of roles) {
        const uniquePerms = new Set(role.permissions);
        expect(uniquePerms.size).toBe(role.permissions.length);
      }
    });

    it('all role codes are unique', () => {
      const codes = roles.map(r => r.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('parent role has helpdesk:create but not helpdesk:manage', () => {
      const parent = roles.find(r => r.code === 'parent');
      expect(parent?.permissions).toContain('helpdesk:create');
      expect(parent?.permissions).not.toContain('helpdesk:manage');
    });
  });

  describe('users', () => {
    it('has exactly 5 users', () => {
      expect(users).toHaveLength(5);
    });

    it('all users have hashed passwords', () => {
      for (const user of users) {
        expect(user.passwordHash).toContain(':');
        expect(user.passwordHash.split(':')[0]).toHaveLength(32);
      }
    });

    it('all user IDs are unique', () => {
      const ids = users.map(u => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all users have valid status', () => {
      for (const user of users) {
        expect(['active', 'locked']).toContain(user.status);
      }
    });

    it('super_admin has isMfaRequired true', () => {
      const admin = users.find(u => u.id === 'user-admin');
      expect(admin?.isMfaRequired).toBe(true);
    });

    it('users reference valid branch IDs', () => {
      const branchIds = branches.map(b => b.id);
      for (const user of users) {
        expect(branchIds).toContain(user.branchId);
      }
    });

    it('users reference valid role codes', () => {
      const roleCodes = roles.map(r => r.code);
      for (const user of users) {
        for (const role of user.roleCodes) {
          expect(roleCodes).toContain(role);
        }
      }
    });
  });

  describe('permissionCatalog', () => {
    it('is sorted alphabetically', () => {
      for (let i = 1; i < permissionCatalog.length; i++) {
        expect(permissionCatalog[i] >= permissionCatalog[i - 1]).toBe(true);
      }
    });

    it('contains no duplicates', () => {
      const uniquePerms = new Set(permissionCatalog);
      expect(uniquePerms.size).toBe(permissionCatalog.length);
    });

    it('contains permissions from all roles', () => {
      const allRolePerms = roles.flatMap(r => r.permissions);
      const uniqueRolePerms = new Set(allRolePerms);
      for (const perm of uniqueRolePerms) {
        expect(permissionCatalog).toContain(perm);
      }
    });
  });
});
