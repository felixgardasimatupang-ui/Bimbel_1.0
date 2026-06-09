export function validateCsrf(request: Request): { ok: true } | { ok: false; error: string } {
  const method = request.method.toUpperCase();

  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return { ok: true };
  }

  const origin = request.headers.get('origin');

  // Allow requests without Origin header in non-production (dev/test environments)
  if (!origin && process.env.NODE_ENV !== 'production') {
    return { ok: true };
  }

  if (!origin) {
    return { ok: false, error: 'Origin header wajib disertakan untuk request mutasi.' };
  }

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  const isAllowed = allowedOrigins.some(
    (allowed) => origin === allowed || origin.startsWith(allowed.replace(/\/$/, ''))
  );

  if (!isAllowed) {
    return { ok: false, error: 'Origin tidak diizinkan.' };
  }

  return { ok: true };
}
