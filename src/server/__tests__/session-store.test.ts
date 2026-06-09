import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { PermissionKey } from '@/server/catalog';
import {
  getSessionStore,
  createSignedSessionId,
  verifySignedSessionId,
  extractSessionId,
  type SessionStore,
  type SessionData,
} from '@/server/session-store';

describe('InMemorySessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = getSessionStore();
  });

  afterEach(async () => {
    await store.cleanup();
  });

  const makeSession = () => ({
    userId: 'user-test',
    branchId: 'branch-test',
    roleCodes: ['super_admin'] as Array<'super_admin'>,
    permissions: ['auth:manage', 'branches:manage'] as PermissionKey[],
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  });

  it('creates and retrieves a session', async () => {
    const sessionId = await store.create(makeSession());
    const session = await store.get(sessionId);
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('user-test');
    expect(session!.roleCodes).toContain('super_admin');
    expect(session!.revokedAt).toBeNull();
  });

  it('returns null for non-existent session', async () => {
    const session = await store.get('non-existent-id');
    expect(session).toBeNull();
  });

  it('returns null for revoked session', async () => {
    const sessionId = await store.create(makeSession());
    await store.revoke(sessionId);
    const session = await store.get(sessionId);
    expect(session).toBeNull();
  });

  it('returns null for expired session', async () => {
    const sessionId = await store.create({
      ...makeSession(),
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const session = await store.get(sessionId);
    expect(session).toBeNull();
  });

  it('revokes all sessions for a user', async () => {
    const id1 = await store.create(makeSession());
    const id2 = await store.create(makeSession());
    await store.revokeAllForUser('user-test');
    expect(await store.get(id1)).toBeNull();
    expect(await store.get(id2)).toBeNull();
  });

  it('cleanup removes expired and revoked sessions', async () => {
    await store.create({ ...makeSession(), expiresAt: new Date(Date.now() - 1000).toISOString() });
    const activeId = await store.create(makeSession());
    await store.revoke(activeId);
    const removed = await store.cleanup();
    expect(removed).toBe(2);
  });
});

describe('session signing', () => {
  it('creates a signed session id that can be verified', () => {
    const raw = 'test-session-id-123';
    const signed = createSignedSessionId(raw);
    expect(signed).toMatch(/^s1_/);
    const verified = verifySignedSessionId(signed);
    expect(verified).toBe(raw);
  });

  it('rejects tampered session id (prefix stripped)', () => {
    expect(verifySignedSessionId('no_prefix_abc')).toBeNull();
  });

  it('rejects tampered session id (payload corrupted)', () => {
    const raw = 'test-session-id-123';
    const signed = createSignedSessionId(raw);
    const prefix = signed.slice(0, 3);
    const payload = signed.slice(3);
    const corrupted = prefix + payload.replace(/[a-z]/g, '0');
    const verified = verifySignedSessionId(corrupted);
    expect(verified).toBeNull();
  });

  it('rejects invalid format', () => {
    expect(verifySignedSessionId('invalid-format')).toBeNull();
    expect(verifySignedSessionId('s1_invalidbase64!!')).toBeNull();
  });
});

describe('extractSessionId', () => {
  it('extracts session_id from cookie header', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'session_id=abc123; other=value' },
    });
    expect(extractSessionId(request)).toBe('abc123');
  });

  it('returns null when no cookie header', () => {
    const request = new Request('http://localhost:3000');
    expect(extractSessionId(request)).toBeNull();
  });

  it('returns null when session_id is missing', () => {
    const request = new Request('http://localhost:3000', {
      headers: { cookie: 'other=value' },
    });
    expect(extractSessionId(request)).toBeNull();
  });
});
