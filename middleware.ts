import { NextResponse, type NextRequest } from "next/server";

/* ==========================================================================
   Edge middleware:
   1) Download + abuse rate limiting (sliding window per IP per route family).
      Production: back this with Vercel KV (Upstash Ratelimit) so limits are
      shared across regions — the in-memory map suits a single instance/demo.
   ========================================================================== */

const buckets = new Map<string, number[]>();

const LIMITS: { prefix: string; max: number; windowMs: number }[] = [
  { prefix: "/api/download", max: 30, windowMs: 60_000 },
  { prefix: "/api/free-download", max: 8, windowMs: 60_000 },
  { prefix: "/api/purchase", max: 10, windowMs: 60_000 },
  { prefix: "/api/newsletter", max: 6, windowMs: 60_000 },
  { prefix: "/api/subscription", max: 6, windowMs: 60_000 },
  { prefix: "/api/reviews", max: 12, windowMs: 60_000 },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = LIMITS.find((l) => pathname.startsWith(l.prefix) && (l.prefix === "/api/download" || req.method === "POST"));
  if (!rule) return NextResponse.next();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  const key = `${ip}:${rule.prefix}`;
  const now = Date.now();

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < rule.windowMs);
  if (hits.length >= rule.max) {
    const retryAfter = Math.ceil((rule.windowMs - (now - hits[0])) / 1000);
    return NextResponse.json(
      { ok: false, error: "Too many requests — please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  hits.push(now);
  buckets.set(key, hits);

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(rule.max));
  res.headers.set("X-RateLimit-Remaining", String(rule.max - hits.length));
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
