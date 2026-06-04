import { randomUUID } from 'node:crypto';

import { branches, type BranchRecord, type PermissionKey, type RoleCode, type UserRecord, users } from '@/server/catalog';
import { recordAuditEvent } from '@/server/audit-store';
import { getPermissionsForRoleCodes } from '@/server/rbac';
import { verifyPassword } from '@/server/password';

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

export function sanitizeUser(user: UserRecord) {
   // Hash kata sandi tidak pernah keluar dari batas server.
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

export function authenticateLogin(input: LoginInput): LoginSuccess | LoginFailure {
  const user = findUserByIdentifier(input.identifier);

  if (!user) {
    recordAuditEvent({
      actor: 'anonymous',
      action: 'login.failed',
      resource: 'auth',
      branchId: null,
      outcome: 'failure',
      detail: 'Identitas masuk tidak dikenal.'
    });

    return {
      ok: false,
      error: 'Kredensial tidak valid.',
      code: 'invalid_credentials'
    };
  }

  const branch = input.branchCode ? findBranchByCode(input.branchCode) : branches.find((entry) => entry.id === user.branchId);

  if (!branch) {
    recordAuditEvent({
      actor: user.id,
      action: 'login.failed',
      resource: 'auth',
      branchId: null,
      outcome: 'failure',
      detail: 'Pilihan cabang tidak valid.'
    });

    return {
      ok: false,
      error: 'Cabang tidak ditemukan.',
      code: 'branch_not_found'
    };
  }

  if (branch.id !== user.branchId && user.roleCodes.includes('parent') === false && user.roleCodes.includes('super_admin') === false) {
    recordAuditEvent({
      actor: user.id,
      action: 'login.failed',
      resource: 'auth',
      branchId: branch.id,
      outcome: 'failure',
      detail: 'Cabang tidak sesuai saat masuk.'
    });

    return {
      ok: false,
      error: 'Akun tidak sesuai dengan cabang yang dipilih.',
      code: 'branch_mismatch'
    };
  }

  if (user.status === 'locked') {
    recordAuditEvent({
      actor: user.id,
      action: 'login.failed',
      resource: 'auth',
      branchId: branch.id,
      outcome: 'failure',
      detail: 'Akun terkunci mencoba masuk.'
    });

    return {
      ok: false,
      error: 'Akun sedang terkunci.',
      code: 'account_locked'
    };
  }

  if (!verifyPassword(input.password, user.passwordHash)) {
    recordAuditEvent({
      actor: user.id,
      action: 'login.failed',
      resource: 'auth',
      branchId: branch.id,
      outcome: 'failure',
      detail: 'Verifikasi kata sandi gagal.'
    });

    return {
      ok: false,
      error: 'Kredensial tidak valid.',
      code: 'invalid_credentials'
    };
  }

  const permissions = getPermissionsForRoleCodes(user.roleCodes);

  const session: AuthenticatedSession = {
    sessionId: randomUUID(),
    userId: user.id,
    branchId: branch.id,
    roleCodes: user.roleCodes,
    permissions,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString()
  };

  recordAuditEvent({
    actor: user.id,
    action: 'login.success',
    resource: 'auth',
    branchId: branch.id,
    outcome: 'success',
    detail: 'Pengguna berhasil diautentikasi.'
  });

  return {
    ok: true,
    user: sanitizeUser(user),
    branch,
    session
  };
}
