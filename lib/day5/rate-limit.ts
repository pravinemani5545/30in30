import { createServiceClient } from "@/lib/day5/supabase-service";
import type { RateLimitResult } from "@/types/day5";

const ANON_LIMIT = 15;
const AUTH_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function extractIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function checkAnonymousRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const ipHash = await hashIp(ip);
  const supabase = createServiceClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count } = await supabase
    .from("rate_limit_anonymous")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  const used = count ?? 0;
  const allowed = used < ANON_LIMIT;
  const resetAt = new Date(Date.now() + WINDOW_MS);

  if (allowed) {
    // Fire-and-forget insert
    supabase.from("rate_limit_anonymous").insert({ ip_hash: ipHash }).then();
  }

  return { allowed, remaining: Math.max(0, ANON_LIMIT - used - (allowed ? 1 : 0)), resetAt };
}

export async function checkUserRateLimit(
  userId: string
): Promise<RateLimitResult> {
  const supabase = createServiceClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count } = await supabase
    .from("rate_limit_users")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  const used = count ?? 0;
  const allowed = used < AUTH_LIMIT;
  const resetAt = new Date(Date.now() + WINDOW_MS);

  if (allowed) {
    supabase.from("rate_limit_users").insert({ user_id: userId }).then();
  }

  return { allowed, remaining: Math.max(0, AUTH_LIMIT - used - (allowed ? 1 : 0)), resetAt };
}
