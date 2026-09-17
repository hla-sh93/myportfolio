import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  success: boolean;
  /** Maximum number of requests allowed in the window. */
  limit: number;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  reset: number;
}

// ---------------------------------------------------------------------------
// Development mock
// ---------------------------------------------------------------------------

/**
 * In development mode we skip actual Redis calls so that the app works
 * without Upstash credentials set up locally.
 */
const isDev = process.env.NODE_ENV === "development";

function createMockRateLimiter(): { limit: (_id: string) => Promise<RateLimitResult> } {
  return {
    async limit(_id: string): Promise<RateLimitResult> {
      return {
        success: true,
        limit: Infinity,
        remaining: Infinity,
        reset: Date.now() + 60_000,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Redis client (shared, lazy singleton)
// ---------------------------------------------------------------------------

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

/**
 * Used when Upstash isn't configured. Per-instance only (a serverless
 * function keeps its own map), so it stops a single-source burst but is not
 * a substitute for the shared store. Getting here in production is logged
 * once so the missing configuration is visible and not silently tolerated —
 * the previous version threw at import time, which took the whole route down.
 */
let warnedNoRedis = false;

function windowToMs(window: string): number {
  const m = /^(\d+)\s*(ms|s|m|h|d)$/.exec(window.trim());
  if (!m) return 60_000;
  const n = Number(m[1]);
  return { ms: n, s: n * 1e3, m: n * 60e3, h: n * 3600e3, d: n * 86400e3 }[m[2] as "ms" | "s" | "m" | "h" | "d"];
}

function createMemoryRateLimiter(
  requests: number,
  windowMs: number,
): { limit: (id: string) => Promise<RateLimitResult> } {
  const hits = new Map<string, number[]>();
  return {
    async limit(id: string): Promise<RateLimitResult> {
      if (!warnedNoRedis) {
        warnedNoRedis = true;
        console.warn("[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — using per-instance memory limiter");
      }
      const now = Date.now();
      const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
      const success = recent.length < requests;
      if (success) recent.push(now);
      hits.set(id, recent);
      // opportunistic cleanup so the map cannot grow without bound
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
      return {
        success,
        limit: requests,
        remaining: Math.max(0, requests - recent.length),
        reset: (recent[0] ?? now) + windowMs,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Rate limiter factory
// ---------------------------------------------------------------------------

type RateLimiterInstance = ReturnType<typeof Ratelimit.prototype.limit> extends Promise<infer R>
  ? { limit: (id: string) => Promise<R> }
  : never;

function createRateLimiter(
  requests: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
): { limit: (id: string) => Promise<RateLimitResult> } {
  if (isDev) {
    return createMockRateLimiter();
  }
  const redis = getRedis();
  if (!redis) {
    return createMemoryRateLimiter(requests, windowToMs(String(window)));
  }
  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  return {
    async limit(id: string): Promise<RateLimitResult> {
      const result = await ratelimiter.limit(id);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Pre-configured rate limiters
// ---------------------------------------------------------------------------

/**
 * Contact form submissions: 5 requests per IP per hour.
 * Prevents spam while allowing legitimate re-submissions.
 */
export const contactRateLimit = createRateLimiter(5, "1 h");

/**
 * Project like actions: 10 requests per IP per minute.
 * Prevents rapid like-spam while allowing burst clicking.
 */
export const likeRateLimit = createRateLimiter(10, "1 m");

/**
 * General API endpoints: 100 requests per IP per minute.
 * Provides a broad ceiling for all other API routes.
 */
export const apiRateLimit = createRateLimiter(100, "1 m");

// ---------------------------------------------------------------------------
// Helper — get client identifier for rate limiting
// ---------------------------------------------------------------------------

/**
 * Derives a stable rate-limit key from the incoming request.
 * Falls back through x-forwarded-for → x-real-ip → "anonymous".
 *
 * @param request - The incoming Next.js Request object.
 * @returns A string identifier suitable for use as a rate-limit key.
 */
export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; use the first IP.
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "anonymous";
}

/**
 * Builds a standardised rate-limit response with appropriate headers.
 *
 * @param result    - The result returned by a rate limiter.
 * @param namespace - Optional namespace to prefix to the Retry-After header.
 * @returns A 429 Response if the limit was exceeded, otherwise null.
 */
export function buildRateLimitResponse(
  result: RateLimitResult,
  namespace = "global",
): Response | null {
  if (result.success) return null;

  const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} second${retryAfterSeconds !== 1 ? "s" : ""}.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Namespace": namespace,
      },
    },
  );
}
