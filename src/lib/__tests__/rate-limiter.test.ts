import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, __getRequestCountSize, __resetRateLimiter } from '@/lib/rate-limiter';

describe('rate limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    __resetRateLimiter();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within limit', () => {
    const result = checkRateLimit('test-key');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it('blocks requests over limit', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('block-key');
    }
    const result = checkRateLimit('block-key');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after window expires', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('reset-key');
    }
    expect(checkRateLimit('reset-key').allowed).toBe(false);

    vi.advanceTimersByTime(61_000);

    const result = checkRateLimit('reset-key');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it('cleans up expired entries when map grows past threshold', () => {
    // Fill the map with 101 unique keys to trigger cleanup
    for (let i = 0; i < 101; i++) {
      checkRateLimit(`flood-key-${i}`);
    }

    // All 101 entries should be in the map
    expect(__getRequestCountSize()).toBe(101);

    // Advance time past the window so all entries expire
    vi.advanceTimersByTime(61_000);

    // Make a new request — this triggers cleanup of expired entries
    checkRateLimit('new-key-after-cleanup');

    // All 101 expired entries should be removed, only the new one remains
    expect(__getRequestCountSize()).toBe(1);
  });
});
