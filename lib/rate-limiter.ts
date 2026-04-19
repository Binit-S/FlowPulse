import { logger } from "./logger";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Interval to clean up expired entries (every 60 seconds) */
const CLEANUP_INTERVAL_MS = 60_000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * In-memory sliding window rate limiter.
 *
 * @param identifier - Unique key per client (e.g. IP address or user ID)
 * @param maxRequests - Maximum requests allowed per window
 * @param windowMs - Time window in milliseconds
 * @returns `{ success: true }` if allowed, `{ success: false, retryAfterMs }` if blocked
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60_000
): { success: boolean; retryAfterMs?: number } {
  startCleanup();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfterMs = entry.resetAt - now;
    logger.warn("Rate limit exceeded", { identifier, retryAfterMs });
    return { success: false, retryAfterMs };
  }

  entry.count += 1;
  return { success: true };
}
