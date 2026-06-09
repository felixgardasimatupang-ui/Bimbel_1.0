import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';

const mockCookieStore = vi.hoisted(() => ({
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn()
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore))
}));

import { getSessionStore, createSignedSessionId } from '@/server/session-store';

import { GET as healthGET } from '@/app/api/v1/health/route';
import { GET as branchesGET } from '@/app/api/v1/branches/route';
import { GET as screensGET } from '@/app/api/v1/screens/route';
import { GET as permissionsGET } from '@/app/api/v1/permissions/route';
import { GET as rolesGET } from '@/app/api/v1/roles/route';
import { GET as auditLogsGET } from '@/app/api/v1/audit-logs/route';
import { POST as loginPOST } from '@/app/api/v1/auth/login/route';

let authCookie = '';

function authenticatedRequest(url: string, init?: RequestInit): Request {
  const headers = new Headers(init?.headers);
  headers.set('cookie', `session_id=${authCookie}`);
  return new Request(url, { ...init, headers });
}

beforeAll(async () => {
  const store = getSessionStore();
  const sessionId = await store.create({
    userId: 'user-admin',
    branchId: 'branch-pusat',
    roleCodes: ['super_admin'],
    permissions: ['auth:manage', 'branches:manage', 'students:manage', 'audit:read', 'roles:read', 'roles:manage'],
    expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  });
  authCookie = createSignedSessionId(sessionId);
});

afterAll(async () => {
  const store = getSessionStore();
  await store.cleanup();
});

describe('API routes', () => {
  describe('GET /api/v1/health', () => {
    it('returns 200 with status ok', async () => {
      const res = await healthGET();
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('ok');
      expect(body.data.service).toBe('bimbel-one-platform');
    });

    it('returns ISO timestamp in response', async () => {
      const res = await healthGET();
      const body = await res.json();
      expect(new Date(body.data.timestamp).toISOString()).toBe(body.data.timestamp);
    });
  });

  describe('GET /api/v1/branches', () => {
    it('returns all branches without filter', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/branches');
      const res = await branchesGET(req);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.items).toHaveLength(4);
      expect(body.data.total).toBe(4);
    });

    it('filters branches by status=active', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/branches?status=active');
      const res = await branchesGET(req);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.items.length).toBeGreaterThan(0);
      for (const branch of body.data.items) {
        expect(branch.status).toBe('active');
      }
    });

    it('returns empty for status=inactive', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/branches?status=inactive');
      const res = await branchesGET(req);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.items).toHaveLength(0);
    });
  });

  describe('GET /api/v1/screens', () => {
    it('returns all 11 screens', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/screens');
      const res = await screensGET(req);
      const body = await res.json();
      expect(body.data.items).toHaveLength(11);
      expect(body.data.total).toBe(11);
    });

    it('each screen has required properties', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/screens');
      const res = await screensGET(req);
      const body = await res.json();
      for (const screen of body.data.items) {
        expect(screen.slug).toBeDefined();
        expect(screen.title).toBeDefined();
        expect(screen.kind).toBeDefined();
      }
    });
  });

  describe('GET /api/v1/permissions', () => {
    it('returns list of permissions', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/permissions');
      const res = await permissionsGET(req);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.items)).toBe(true);
      expect(body.data.items.length).toBeGreaterThan(0);
    });

    it('returns sorted permissions', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/permissions');
      const res = await permissionsGET(req);
      const body = await res.json();
      const items = body.data.items;
      for (let i = 1; i < items.length; i++) {
        expect(items[i] >= items[i - 1]).toBe(true);
      }
    });
  });

  describe('GET /api/v1/roles', () => {
    it('returns all roles', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/roles');
      const res = await rolesGET(req);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.roles).toHaveLength(3);
      expect(body.data.allPermissions).toBeDefined();
    });

    it('each role has code, name, and permissions', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/roles');
      const res = await rolesGET(req);
      const body = await res.json();
      for (const role of body.data.roles) {
        expect(role.code).toBeDefined();
        expect(role.name).toBeDefined();
        expect(Array.isArray(role.permissions)).toBe(true);
      }
    });
  });

  describe('GET /api/v1/audit-logs', () => {
    it('returns all audit events without filter', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/audit-logs');
      const res = await auditLogsGET(req);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.items)).toBe(true);
      expect(body.data.total).toBe(body.data.items.length);
    });

    it('filters audit events by branchId', async () => {
      const req = authenticatedRequest('http://localhost:3000/api/v1/audit-logs?branchId=branch-pusat');
      const res = await auditLogsGET(req);
      const body = await res.json();
      expect(body.success).toBe(true);
      for (const event of body.data.items) {
        if (event.branchId !== null) {
          expect(event.branchId).toBe('branch-pusat');
        }
      }
    });
  });
});

describe('POST /api/v1/auth/login', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: 'not-json',
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('invalid_json');
  });

  it('returns 400 for missing identifier', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'Admin123!' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 for empty identifier', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: '', password: 'Admin123!' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 401 for invalid credentials', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'wrong@email.com', password: 'WrongPass123!' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 200 with user data for valid credentials (non-MFA user)', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'ayu@bimbel.one', password: 'Tutor123!', branchCode: 'BDG-01' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.user.fullName).toBe('Ayu Santika');
    expect(body.data.branch).toBeDefined();
    expect(body.data.session).toBeDefined();
    expect(body.data.session.roleCodes).toContain('tutor');
  });

  it('returns mfa_required for MFA-enabled user', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@bimbel.one', password: 'Admin123!' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.mfaRequired).toBe(true);
    expect(body.data.challengeId).toBeDefined();
    expect(body.data.otpauth).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const req = authenticatedRequest('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@bimbel.one', password: 'WrongPassword!' }),
      headers: { 'content-type': 'application/json' }
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(401);
  });
});
