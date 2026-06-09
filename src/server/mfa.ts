import * as otplib from 'otplib';
import { randomUUID } from 'node:crypto';
import type { RoleCode, PermissionKey } from '@/server/catalog';

interface MfaChallenge {
  challengeId: string;
  userId: string;
  branchId: string;
  roleCodes: RoleCode[];
  permissions: PermissionKey[];
  expiresAt: string;
  secret: string;
}

const challenges = new Map<string, MfaChallenge>();

export function createMfaChallenge(userId: string, branchId: string, roleCodes: RoleCode[], permissions: PermissionKey[]): {
  challengeId: string;
  secret: string;
  otpauth: string;
  currentCode: string;
} {
  const secret = otplib.generateSecret();
  const challengeId = randomUUID();

  const challenge: MfaChallenge = {
    challengeId,
    userId,
    branchId,
    roleCodes,
    permissions,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    secret,
  };

  challenges.set(challengeId, challenge);

  const otpauth = `otpauth://totp/Bimbel%20One%20Platform:${encodeURIComponent(userId)}?secret=${secret}&issuer=Bimbel%20One%20Platform&algorithm=SHA1&digits=6&period=30`;
  const currentCode = otplib.generateSync({ secret });

  return { challengeId, secret, otpauth, currentCode };
}

export function verifyMfaCode(challengeId: string, token: string): {
  ok: true;
  userId: string;
  branchId: string;
  roleCodes: RoleCode[];
  permissions: PermissionKey[];
} | { ok: false; error: string } {
  const challenge = challenges.get(challengeId);
  if (!challenge) {
    return { ok: false, error: 'Challenge not found.' };
  }

  if (Date.now() > new Date(challenge.expiresAt).getTime()) {
    challenges.delete(challengeId);
    return { ok: false, error: 'Challenge expired.' };
  }

  let result: { valid: boolean; delta?: number };
  try {
    result = otplib.verifySync({ token, secret: challenge.secret, window: 2 } as never);
  } catch {
    return { ok: false, error: 'Invalid verification code.' };
  }
  if (!result.valid) {
    return { ok: false, error: 'Invalid verification code.' };
  }

  challenges.delete(challengeId);

  return {
    ok: true,
    userId: challenge.userId,
    branchId: challenge.branchId,
    roleCodes: challenge.roleCodes,
    permissions: challenge.permissions,
  };
}

export function getCurrentCode(challengeId: string): string | null {
  const challenge = challenges.get(challengeId);
  if (!challenge) return null;
  if (Date.now() > new Date(challenge.expiresAt).getTime()) {
    challenges.delete(challengeId);
    return null;
  }
  return otplib.generateSync({ secret: challenge.secret });
}

export function cleanupExpiredChallenges(): number {
  const now = Date.now();
  let count = 0;
  for (const [id, challenge] of challenges) {
    if (now > new Date(challenge.expiresAt).getTime()) {
      challenges.delete(id);
      count++;
    }
  }
  return count;
}
