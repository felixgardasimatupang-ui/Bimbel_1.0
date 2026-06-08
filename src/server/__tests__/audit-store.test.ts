import { describe, it, expect, beforeEach } from 'vitest';
import { recordAuditEvent, listAuditEvents } from '@/server/audit-store';
import type { AuditEventRecord } from '@/server/audit-store';

describe('audit store', () => {
  let initialCount: number;

  beforeEach(() => {
    initialCount = listAuditEvents().length;
  });

  it('returns a copy of audit events (immutable)', () => {
    const events = listAuditEvents();
    const eventsAgain = listAuditEvents();
    expect(events).toEqual(eventsAgain);
    expect(events).not.toBe(eventsAgain);
  });

  it('recordAuditEvent prepends a new event', () => {
    const before = listAuditEvents().length;

    const entry = {
      actor: 'test-user',
      action: 'test.action',
      resource: 'test',
      branchId: null,
      outcome: 'info' as const,
      detail: 'Test audit entry.'
    };

    const record = recordAuditEvent(entry);
    const after = listAuditEvents().length;

    expect(after).toBe(before + 1);
    expect(record.actor).toBe('test-user');
    expect(record.action).toBe('test.action');
    expect(record.resource).toBe('test');
    expect(record.outcome).toBe('info');
  });

  it('recordAuditEvent generates id and timestamp', () => {
    const entry = {
      actor: 'test-user',
      action: 'test.action',
      resource: 'test',
      branchId: 'branch-test',
      outcome: 'success' as const,
      detail: 'Another test entry.'
    };

    const record = recordAuditEvent(entry);
    expect(record.id).toBeDefined();
    expect(record.id.length).toBeGreaterThan(0);
    expect(record.timestamp).toBeDefined();
    expect(new Date(record.timestamp).toISOString()).toBe(record.timestamp);
  });

  it('recordAuditEvent stores branchId when provided', () => {
    const entry = {
      actor: 'test-user',
      action: 'test.action',
      resource: 'test',
      branchId: 'branch-bandung',
      outcome: 'failure' as const,
      detail: 'Branch-specific audit.'
    };

    const record = recordAuditEvent(entry);
    expect(record.branchId).toBe('branch-bandung');
  });

  it('listAuditEvents returns events in reverse chronological order (newest first)', () => {
    const entry1 = {
      actor: 'user-1', action: 'event.first', resource: 'test',
      branchId: null, outcome: 'info' as const, detail: 'First event.'
    };
    const entry2 = {
      actor: 'user-2', action: 'event.second', resource: 'test',
      branchId: null, outcome: 'info' as const, detail: 'Second event.'
    };

    const record1 = recordAuditEvent(entry1);
    const record2 = recordAuditEvent(entry2);

    const events = listAuditEvents();
    const firstIndex = events.findIndex(e => e.id === record2.id);
    const secondIndex = events.findIndex(e => e.id === record1.id);

    expect(firstIndex).toBeLessThan(secondIndex);
  });
});
