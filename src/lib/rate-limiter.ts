const requestCounts = new Map<string, { count: number; resetAt: number }>();

export interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
}

function cleanupExpired(now: number): void {
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  config: RateLimiterConfig = { windowMs: 60_000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    // Periodically clean up expired entries to prevent unbounded growth
    if (requestCounts.size > 100) {
      cleanupExpired(now);
    }
    requestCounts.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

/** @internal — exposed for testing only */
export function __getRequestCountSize(): number {
  return requestCounts.size;
}

/** @internal — exposed for testing only */
export function __resetRateLimiter(): void {
  requestCounts.clear();
}
