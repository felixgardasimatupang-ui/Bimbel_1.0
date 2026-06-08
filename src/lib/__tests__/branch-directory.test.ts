import { describe, it, expect } from 'vitest';
import { branchDirectory } from '@/lib/branch-directory';

describe('branch directory', () => {
  it('contains exactly 4 branches', () => {
    expect(branchDirectory).toHaveLength(4);
  });

  it('each branch has required fields', () => {
    for (const branch of branchDirectory) {
      expect(branch.id).toBeDefined();
      expect(branch.code).toBeDefined();
      expect(branch.name).toBeDefined();
      expect(branch.timezone).toBeDefined();
      expect(branch.status).toBeDefined();
      expect(branch.address).toBeDefined();
      expect(branch.phone).toBeDefined();
      expect(branch.email).toBeDefined();
    }
  });

  it('contains branch-pusat with code HQ-01', () => {
    const pusat = branchDirectory.find(b => b.id === 'branch-pusat');
    expect(pusat).toBeDefined();
    expect(pusat?.code).toBe('HQ-01');
    expect(pusat?.status).toBe('active');
  });

  it('all branches are active', () => {
    const allActive = branchDirectory.every(b => b.status === 'active');
    expect(allActive).toBe(true);
  });

  it('all branches have unique IDs', () => {
    const ids = branchDirectory.map(b => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all branches have unique codes', () => {
    const codes = branchDirectory.map(b => b.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });
});
