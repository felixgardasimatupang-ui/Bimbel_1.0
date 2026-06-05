import { randomBytes, scrypt, scryptSync, timingSafeEqual } from 'node:crypto';

const SALT_BYTES = 16;
const KEY_BYTES = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_BYTES).toString('hex');

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_BYTES);
  const expectedKey = Buffer.from(hash, 'hex');

  if (derivedKey.length !== expectedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedKey);
}

export async function hashPasswordAsync(password: string) {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_BYTES, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPasswordAsync(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const expectedKey = Buffer.from(hash, 'hex');

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_BYTES, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  if (derivedKey.length !== expectedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedKey);
}
