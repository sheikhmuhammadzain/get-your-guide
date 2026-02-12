export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const records = new Map<string, RateLimitRecord>();

export function checkRateLimit(options: RateLimitOptions) {
  const now = Date.now();
  const existing = records.get(options.key);

  if (!existing || now > existing.resetAt) {
    records.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      remaining: options.limit - 1,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  existing.count += 1;

  if (existing.count > options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
