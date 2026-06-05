import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/server/password';

describe('password', () => {
  it('hashPassword returns salt:hash format', () => {
    const result = hashPassword('SecurePass123!');
    expect(result).toContain(':');
    const [salt, hash] = result.split(':');
    expect(salt).toHaveLength(32);
    expect(hash).toHaveLength(128);
  });

  it('verifyPassword returns true for correct password', () => {
    const hashed = hashPassword('MyPassword123!');
    expect(verifyPassword('MyPassword123!', hashed)).toBe(true);
  });

  it('verifyPassword returns false for incorrect password', () => {
    const hashed = hashPassword('RealPass456!');
    expect(verifyPassword('WrongPass789!', hashed)).toBe(false);
  });

  it('verifyPassword returns false for malformed stored hash', () => {
    expect(verifyPassword('anypass', 'invalid-hash')).toBe(false);
    expect(verifyPassword('anypass', '')).toBe(false);
    expect(verifyPassword('anypass', 'onlysalt')).toBe(false);
  });

  it('different passwords produce different hashes', () => {
    const hash1 = hashPassword('PasswordOne!');
    const hash2 = hashPassword('PasswordTwo!');
    expect(hash1).not.toBe(hash2);
  });

  it('same password produces different hashes each time (different salt)', () => {
    const hash1 = hashPassword('SamePass123!');
    const hash2 = hashPassword('SamePass123!');
    expect(hash1).not.toBe(hash2);
  });
});
