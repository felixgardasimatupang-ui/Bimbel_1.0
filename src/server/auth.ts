import { randomUUID } from 'node:crypto';

import { branches, type BranchRecord, type PermissionKey, type RoleCode, type UserRecord, users } from '@/server/catalog';
import { recordAuditEvent, type AuditOutcome } from '@/server/audit-store';
import { getPermissionsForRoleCodes } from '@/server/rbac';
import { verifyPasswordAsync } from '@/server/password';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export interface AuthenticatedSession {
  sessionId: string;
  userId: string;
  branchId: string;
  roleCodes: RoleCode[];
  permissions: PermissionKey[];
  expiresAt: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
  branchCode?: string;
}

export interface LoginSuccess {
  ok: true;
  user: Omit<UserRecord, 'passwordHash'>;
  branch: BranchRecord;
  session: AuthenticatedSession;
}

export interface LoginFailure {
  ok: false;
  error: string;
  code: 'invalid_credentials' | 'branch_mismatch' | 'account_locked' | 'branch_not_found';
}

function recordAuthAudit(actor: string, action: string, outcome: AuditOutcome, branchId: string | null, detail: string) {
  recordAuditEvent({ actor, action, resource: 'auth', branchId, outcome, detail });
}

export function sanitizeUser(user: UserRecord) {
   const { passwordHash, ...safeUser } = user;
   return safeUser;
}

export function findUserByIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();

  return users.find((user) => user.email.toLowerCase() === normalized || user.phone === identifier.trim());
}

export function findBranchByCode(branchCode: string) {
  return branches.find((branch) => branch.code.toLowerCase() === branchCode.trim().toLowerCase());
}

function isCrossBranchLogin(user: UserRecord, branch: BranchRecord): boolean {
  return branch.id !== user.branchId && !user.roleCodes.includes('parent') && !user.roleCodes.includes('super_admin');
}

export async function authenticateLogin(input: LoginInput): Promise<LoginSuccess | LoginFailure> {
  const user = findUserByIdentifier(input.identifier);

  if (!user) {
    recordAuthAudit('anonymous', 'login.failed', 'failure', null, 'Identitas masuk tidak dikenal.');
    return { ok: false, error: 'Kredensial tidak valid.', code: 'invalid_credentials' };
  }

  const branch = input.branchCode
    ? findBranchByCode(input.branchCode)
    : branches.find((entry) => entry.id === user.branchId);

  if (!branch) {
    recordAuthAudit(user.id, 'login.failed', 'failure', null, 'Pilihan cabang tidak valid.');
    return { ok: false, error: 'Cabang tidak ditemukan.', code: 'branch_not_found' };
  }

  if (isCrossBranchLogin(user, branch)) {
    recordAuthAudit(user.id, 'login.failed', 'failure', branch.id, 'Cabang tidak sesuai saat masuk.');
    return { ok: false, error: 'Akun tidak sesuai dengan cabang yang dipilih.', code: 'branch_mismatch' };
  }

  if (user.status === 'locked') {
    recordAuthAudit(user.id, 'login.failed', 'failure', branch.id, 'Akun terkunci mencoba masuk.');
    return { ok: false, error: 'Akun sedang terkunci.', code: 'account_locked' };
  }

  if (!(await verifyPasswordAsync(input.password, user.passwordHash))) {
    recordAuthAudit(user.id, 'login.failed', 'failure', branch.id, 'Verifikasi kata sandi gagal.');
    return { ok: false, error: 'Kredensial tidak valid.', code: 'invalid_credentials' };
  }

  const permissions = getPermissionsForRoleCodes(user.roleCodes);

  const session: AuthenticatedSession = {
    sessionId: randomUUID(),
    userId: user.id,
    branchId: branch.id,
    roleCodes: user.roleCodes,
    permissions,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString()
  };

  recordAuthAudit(user.id, 'login.success', 'success', branch.id, 'Pengguna berhasil diautentikasi.');

  return {
    ok: true,
    user: sanitizeUser(user),
    branch,
    session
  };
}
