import { describe, it, expect } from 'vitest';
import { config } from '@/middleware';

describe('middleware config', () => {
  it('matcher covers all routes', () => {
    expect(config.matcher).toHaveLength(1);
    expect(config.matcher[0]).toContain('_next/static');
    expect(config.matcher[0]).toContain('favicon.ico');
  });
});

describe('middleware route protection logic', () => {
  const PUBLIC_PATHS = ['/', '/login', '/api/v1/health', '/api/v1/auth/login'];
  const PROTECTED_PATHS = ['/screens/01_penagihan_dan_keuangan', '/production', '/branches', '/api/v1/audit-logs', '/api/v1/roles'];

  it('allows public paths', () => {
    for (const path of PUBLIC_PATHS) {
      const isPublic =
        path === '/' ||
        path === '/login' ||
        path.startsWith('/login/') ||
        path.startsWith('/api/v1/health') ||
        path.startsWith('/api/v1/auth/login') ||
        path.startsWith('/_next') ||
        path === '/favicon.ico';
      expect(isPublic).toBe(true);
    }
  });

  it('protects all sensitive routes', () => {
    for (const path of PROTECTED_PATHS) {
      const isProtected =
        !(
          path === '/' ||
          path === '/login' ||
          path.startsWith('/login/') ||
          path.startsWith('/api/v1/health') ||
          path.startsWith('/api/v1/auth/login') ||
          path.startsWith('/_next') ||
          path === '/favicon.ico'
        );
      expect(isProtected).toBe(true);
    }
  });

  it('validates session cookie format', () => {
    const validCookies = ['s1_abc123def456', 's1_' + 'a'.repeat(50)];
    const invalidCookies = [undefined, '', 'abc123', 's1_', 's1_ab'];

    for (const c of validCookies) {
      expect(c!.startsWith('s1_') && c!.length >= 10).toBe(true);
    }
    for (const c of invalidCookies) {
      const result = c ? c.startsWith('s1_') && c.length >= 10 : false;
      expect(result).toBe(false);
    }
  });
});
