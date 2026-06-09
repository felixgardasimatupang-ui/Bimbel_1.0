import Redis from 'ioredis';

export interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
}

// ── In-memory store (default, used in tests) ──

const requestCounts = new Map<string, { count: number; resetAt: number }>();

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

// ── Redis-backed store ──

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });
    redisClient.on('error', () => {});
  }
  return redisClient;
}

export async function checkRateLimitRedis(
  key: string,
  config: RateLimiterConfig = { windowMs: 60_000, maxRequests: 10 }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const client = getRedisClient();
    if (!client.status || client.status === 'end') {
      await client.connect();
    }

    const now = Date.now();
    const windowKey = `ratelimit:${key}`;
    const windowMs = config.windowMs;

    const results = await client
      .multi()
      .zremrangebyscore(windowKey, 0, now - windowMs)
      .zadd(windowKey, now, `${now}-${Math.random()}`)
      .zcard(windowKey)
      .expire(windowKey, Math.ceil(windowMs / 1000))
      .exec();

    if (!results) {
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + windowMs };
    }

    const count = results[2][1] as number;
    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);
    const resetAt = now + windowMs;

    return { allowed, remaining, resetAt };
  } catch {
    return checkRateLimit(key, config);
  }
}

export function checkUserRateLimit(
  userId: string,
  action: string,
  config: RateLimiterConfig = { windowMs: 60_000, maxRequests: 30 }
): { allowed: boolean; remaining: number; resetAt: number } {
  return checkRateLimit(`user:${userId}:${action}`, config);
}

export function isRedisAvailable(): boolean {
  return !!process.env.REDIS_URL;
}

// ── Test helpers ──

/** @internal — exposed for testing only */
export function __getRequestCountSize(): number {
  return requestCounts.size;
}

/** @internal — exposed for testing only */
export function __resetRateLimiter(): void {
  requestCounts.clear();
  if (redisClient) {
    redisClient.disconnect();
    redisClient = null;
  }
}
