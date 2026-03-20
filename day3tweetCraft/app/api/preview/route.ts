import { NextRequest, NextResponse } from "next/server";
import { UrlSchema } from "@/lib/validations/url";
import { fetchPreview } from "@/lib/parser/preview";

// Simple in-memory rate limit: 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many preview requests. Please slow down." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const parsed = UrlSchema.safeParse(rawUrl);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid URL" },
      { status: 400 }
    );
  }

  const preview = await fetchPreview(parsed.data);

  if (!preview) {
    return NextResponse.json(
      { error: "Could not fetch preview for that URL" },
      { status: 422 }
    );
  }

  return NextResponse.json(preview);
}
