import { randomUUID } from 'node:crypto';

export type AuditOutcome = 'success' | 'failure' | 'info';

export interface AuditEventRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  branchId: string | null;
  outcome: AuditOutcome;
  detail: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

const auditEvents: AuditEventRecord[] = [
  {
    id: randomUUID(),
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    actor: 'system',
    action: 'seed.loaded',
    resource: 'branch',
    branchId: null,
    outcome: 'info',
    detail: 'Seed data loaded for demo environment.'
  },
  {
    id: randomUUID(),
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    actor: 'user-admin',
    action: 'login.success',
    resource: 'auth',
    branchId: 'branch-pusat',
    outcome: 'success',
    detail: 'Demo administrator authenticated successfully.'
  },
  {
    id: randomUUID(),
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    actor: 'user-finance',
    action: 'invoice.adjustment',
    resource: 'billing',
    branchId: 'branch-pusat',
    outcome: 'success',
    detail: 'Invoice adjustment recorded with audit trail.'
  }
];

export function recordAuditEvent(entry: Omit<AuditEventRecord, 'id' | 'timestamp'>) {
  const record: AuditEventRecord = {
    ...entry,
    id: randomUUID(),
    timestamp: new Date().toISOString()
  };

  auditEvents.unshift(record);
  return record;
}

export function listAuditEvents() {
  return [...auditEvents];
}
