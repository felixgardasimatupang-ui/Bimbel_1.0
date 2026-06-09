const requiredVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
] as const;

const optionalVars = [
  'ALLOWED_ORIGINS',
  'REDIS_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
  'LOG_LEVEL',
  'DEMO_ADMIN_PASSWORD',
  'DEMO_FINANCE_PASSWORD',
  'DEMO_TUTOR_PASSWORD',
  'DEMO_BRANCH_ADMIN_PASSWORD',
  'DEMO_SUPPORT_PASSWORD',
] as const;

type EnvVars = Record<string, string | undefined>;

let validated = false;
let missingVars: string[] = [];

export function validateEnv(): { ok: true } | { ok: false; missing: string[] } {
  if (validated) {
    return missingVars.length > 0
      ? { ok: false, missing: missingVars }
      : { ok: true };
  }

  const missing = requiredVars.filter(
    (name) => !process.env[name] || process.env[name]!.trim() === ''
  );

  if (process.env.NODE_ENV === 'production') {
    for (const name of optionalVars) {
      if (name.startsWith('DEMO_')) continue;
      if (!process.env[name] || process.env[name]!.trim() === '') {
        console.warn(`[env] Optional variable ${name} is not set.`);
      }
    }
  }

  missingVars = missing;
  validated = true;

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return { ok: true };
}

export function getEnv(): EnvVars {
  const result: EnvVars = {};
  for (const name of [...requiredVars, ...optionalVars]) {
    result[name] = process.env[name];
  }
  return result;
}

export function getDemoPassword(role: string): string {
  const envKey = `DEMO_${role.toUpperCase()}_PASSWORD` as const;
  return process.env[envKey] || getDefaultDemoPassword(role);
}

function getDefaultDemoPassword(role: string): string {
  const defaults: Record<string, string> = {
    ADMIN: 'Admin123!',
    FINANCE: 'Finance123!',
    TUTOR: 'Tutor123!',
    BRANCH_ADMIN: 'Branch123!',
    SUPPORT: 'Support123!',
  };
  return defaults[role.toUpperCase()] || 'Demo123!';
}
