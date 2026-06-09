import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import type { PermissionKey, RoleCode } from '@/server/catalog';

export interface SessionData {
  sessionId: string;
  userId: string;
  branchId: string;
  roleCodes: RoleCode[];
  permissions: PermissionKey[];
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface SessionStore {
  create(data: Omit<SessionData, 'sessionId' | 'createdAt' | 'revokedAt'>): Promise<string>;
  get(sessionId: string): Promise<SessionData | null>;
  extend(sessionId: string): Promise<SessionData | null>;
  revoke(sessionId: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  cleanup(): Promise<number>;
}

function sign(token: string, secret: string): string {
  return createHmac('sha256', secret).update(token).digest('hex');
}

function encode(sessionId: string, signature: string): string {
  const payload = Buffer.from(`${sessionId}:${signature}`).toString('base64url');
  return `s1_${payload}`;
}

function decode(encoded: string): { sessionId: string; signature: string } | null {
  if (!encoded.startsWith('s1_')) return null;
  const payload = Buffer.from(encoded.slice(3), 'base64url').toString('utf8');
  const colon = payload.indexOf(':');
  if (colon === -1) return null;
  return { sessionId: payload.slice(0, colon), signature: payload.slice(colon + 1) };
}

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

class InMemorySessionStore implements SessionStore {
  private store = new Map<string, SessionData>();

  async create(data: Omit<SessionData, 'sessionId' | 'createdAt' | 'revokedAt'>): Promise<string> {
    const sessionId = randomUUID();
    const now = new Date().toISOString();
    const record: SessionData = {
      ...data,
      sessionId,
      createdAt: now,
      revokedAt: null,
    };
    this.store.set(sessionId, record);
    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const record = this.store.get(sessionId);
    if (!record) return null;
    if (record.revokedAt) return null;
    if (Date.now() > new Date(record.expiresAt).getTime()) {
      this.store.delete(sessionId);
      return null;
    }
    return record;
  }

  async extend(sessionId: string): Promise<SessionData | null> {
    const record = this.store.get(sessionId);
    if (!record || record.revokedAt) return null;
    if (Date.now() > new Date(record.expiresAt).getTime()) {
      this.store.delete(sessionId);
      return null;
    }
    record.expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    return record;
  }

  async revoke(sessionId: string): Promise<void> {
    const record = this.store.get(sessionId);
    if (record) {
      record.revokedAt = new Date().toISOString();
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    for (const [id, record] of this.store) {
      if (record.userId === userId && !record.revokedAt) {
        record.revokedAt = new Date().toISOString();
      }
    }
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let removed = 0;
    for (const [id, record] of this.store) {
      if (record.revokedAt || now > new Date(record.expiresAt).getTime()) {
        this.store.delete(id);
        removed++;
      }
    }
    return removed;
  }

  size(): number {
    return this.store.size;
  }
}

let storeInstance: SessionStore | null = null;

export function getSessionStore(): SessionStore {
  if (!storeInstance) {
    storeInstance = new InMemorySessionStore();
  }
  return storeInstance;
}

export function createSignedSessionId(sessionId: string): string {
  const secret = process.env.SESSION_SECRET || 'dev-secret-do-not-use-in-production';
  const signature = sign(sessionId, secret);
  return encode(sessionId, signature);
}

export function verifySignedSessionId(encoded: string): string | null {
  const secret = process.env.SESSION_SECRET || 'dev-secret-do-not-use-in-production';
  const parts = decode(encoded);
  if (!parts) return null;
  const expectedSig = sign(parts.sessionId, secret);
  try {
    const actual = Buffer.from(parts.signature, 'hex');
    const expected = Buffer.from(expectedSig, 'hex');
    if (actual.length !== expected.length) return null;
    if (!timingSafeEqual(actual, expected)) return null;
  } catch {
    return null;
  }
  return parts.sessionId;
}

export function extractSessionId(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const eq = c.indexOf('=');
      return eq === -1 ? [c.trim(), ''] : [c.slice(0, eq).trim(), c.slice(eq + 1).trim()];
    })
  );
  return cookies['session_id'] || null;
}

export async function requireAuth(
  request: Request,
  options?: { permission?: PermissionKey }
): Promise<{ user: SessionData } | Response> {
  const rawCookie = extractSessionId(request);
  if (!rawCookie) {
    return new Response(JSON.stringify({ success: false, error: { message: 'Unauthorized', code: 'not_authenticated' } }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const sessionId = verifySignedSessionId(rawCookie);
  if (!sessionId) {
    return new Response(JSON.stringify({ success: false, error: { message: 'Invalid session', code: 'invalid_session' } }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const store = getSessionStore();
  const session = await store.get(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ success: false, error: { message: 'Session expired', code: 'session_expired' } }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (options?.permission) {
    const [resource, action] = options.permission.split(':');
    const hasExact = session.permissions.includes(options.permission);
    const hasManage = action !== 'manage' && session.permissions.includes(`${resource}:manage` as PermissionKey);
    if (!hasExact && !hasManage) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Forbidden', code: 'forbidden' } }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  return { user: session };
}
