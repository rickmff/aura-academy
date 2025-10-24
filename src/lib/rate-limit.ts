import { headers } from 'next/headers';

type WindowBucket = {
  endedAtMs: number;
  count: number;
};

type LimitState = {
  buckets: WindowBucket[];
};

declare global {
  // eslint-disable-next-line no-var
  var __rate_limit_store__: Map<string, LimitState> | undefined;
}

const store: Map<string, LimitState> = globalThis.__rate_limit_store__ ?? new Map();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__rate_limit_store__ = store;
}

export async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  const xff = hdrs.get('x-forwarded-for');
  if (xff) {
    const ip = xff.split(',')[0]?.trim();
    if (ip) return ip;
  }
  return hdrs.get('x-real-ip') || 'unknown';
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs?: number;
};

export async function rateLimitAllow(params: { key: string; limit: number; windowMs: number }): Promise<RateLimitResult> {
  const now = Date.now();
  const windowEnd = now + params.windowMs;
  const state = store.get(params.key) ?? { buckets: [] };
  // prune expired windows
  state.buckets = state.buckets.filter((b) => b.endedAtMs > now);
  // sum counts in active windows
  const used = state.buckets.reduce((sum, b) => sum + b.count, 0);
  if (used >= params.limit) {
    const earliest = Math.min(...state.buckets.map((b) => b.endedAtMs));
    return { ok: false, remaining: 0, retryAfterMs: Math.max(0, earliest - now) };
  }
  // increment current window bucket
  const current = state.buckets.find((b) => b.endedAtMs === windowEnd);
  if (current) {
    current.count += 1;
  } else {
    state.buckets.push({ endedAtMs: windowEnd, count: 1 });
  }
  store.set(params.key, state);
  return { ok: true, remaining: Math.max(0, params.limit - (used + 1)) };
}

export async function enforceRateLimitOrThrow(params: { key: string; limit: number; windowMs: number; message?: string }) {
  const res = await rateLimitAllow(params);
  if (!res.ok) {
    const seconds = Math.ceil((res.retryAfterMs ?? params.windowMs) / 1000);
    throw new Error(params.message ?? `Too many requests. Try again in ${seconds}s`);
  }
}


