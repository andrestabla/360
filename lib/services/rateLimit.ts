interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  api: { windowMs: 60 * 1000, maxRequests: 100 },
  tenantLookup: { windowMs: 60 * 1000, maxRequests: 30 },
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
} as const;

export function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMITS
): RateLimitResult {
  cleanup();
  
  const config = RATE_LIMITS[action];
  const key = `${action}:${identifier}`;
  const now = Date.now();
  
  let entry = store.get(key);
  
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + config.windowMs };
    store.set(key, entry);
  }
  
  entry.count++;
  
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
  };
  
  if (!result.success && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return headers;
}

export function resetRateLimit(identifier: string, action: keyof typeof RATE_LIMITS): void {
  const key = `${action}:${identifier}`;
  store.delete(key);
}
