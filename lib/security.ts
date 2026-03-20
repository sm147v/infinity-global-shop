import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
};

type Bucket = {
  timestamps: number[];
};

const globalForRateLimit = globalThis as unknown as {
  igsRateLimitStore?: Map<string, Bucket>;
  igsRateLimiterByWindow?: Map<string, Ratelimit>;
};

const rateLimitStore = globalForRateLimit.igsRateLimitStore ?? new Map<string, Bucket>();
if (!globalForRateLimit.igsRateLimitStore) {
  globalForRateLimit.igsRateLimitStore = rateLimitStore;
}

const rateLimiterByWindow = globalForRateLimit.igsRateLimiterByWindow ?? new Map<string, Ratelimit>();
if (!globalForRateLimit.igsRateLimiterByWindow) {
  globalForRateLimit.igsRateLimiterByWindow = rateLimiterByWindow;
}

function hasUpstashConfig(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

type UpstashSecondDuration = `${number} s`;

function windowToDuration(windowMs: number): UpstashSecondDuration {
  const seconds = Math.max(1, Math.ceil(windowMs / 1000));
  return `${seconds} s` as UpstashSecondDuration;
}

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit {
  const key = `${limit}:${windowMs}`;
  const existing = rateLimiterByWindow.get(key);
  if (existing) {
    return existing;
  }

  const redis = Redis.fromEnv();
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, windowToDuration(windowMs)),
    analytics: false,
    prefix: "igs:ratelimit",
  });
  rateLimiterByWindow.set(key, limiter);
  return limiter;
}

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const [firstIp] = xff.split(",");
    return firstIp?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function checkRateLimitMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = rateLimitStore.get(key) ?? { timestamps: [] };
  const validTimestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0] ?? now;
    const retryAfterMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  return { allowed: true, retryAfterSec: 0 };
}

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (!hasUpstashConfig()) {
    return checkRateLimitMemory(key, limit, windowMs);
  }

  try {
    const limiter = getUpstashLimiter(limit, windowMs);
    const result = await limiter.limit(key);
    if (result.success) {
      return { allowed: true, retryAfterSec: 0 };
    }

    const retryAfterMs = Math.max(0, result.reset - Date.now());
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  } catch {
    return checkRateLimitMemory(key, limit, windowMs);
  }
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  const expectedOrigin = request.nextUrl.origin;
  return origin === expectedOrigin;
}

export function __resetInMemoryRateLimitForTests(): void {
  rateLimitStore.clear();
}
