import { NextResponse } from "next/server";
import { AnalyzeInputSchema } from "@/types/day5";
import { analyzePitch } from "@/lib/day5/ai/analyze-pitch";
import {
  extractIp,
  checkAnonymousRateLimit,
  checkUserRateLimit,
} from "@/lib/day5/rate-limit";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/day5/supabase-service";

export async function POST(request: Request) {
  try {
    // 1. Parse and validate body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Please check your input and try again" },
        { status: 400 }
      );
    }

    const parsed = AnalyzeInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Please check your input and try again" },
        { status: 400 }
      );
    }

    const { pitch, context } = parsed.data;

    // 2. Check auth status
    let userId: string | null = null;
    try {
      const supabase = await createSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Anonymous — no session
    }

    // 3. Rate limit (BEFORE calling Claude)
    const rateLimit = userId
      ? await checkUserRateLimit(userId)
      : await checkAnonymousRateLimit(extractIp(request));

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Try again later.",
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }

    // 4. Analyze with Claude
    const analysis = await analyzePitch(pitch, context);

    // 5. Persist if authenticated (non-blocking)
    let saved = false;
    if (userId) {
      saved = true;
      const service = createServiceClient();
      service
        .from("pitch_analyses")
        .insert({
          user_id: userId,
          original_pitch: pitch,
          score: analysis.score,
          verdict: analysis.verdict,
          critique: analysis.critique,
          dimension_scores: analysis.dimension_scores,
          improvements: analysis.improvements,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to save analysis:", error.message);
          }
        });
    }

    // Log only non-sensitive data
    console.log(
      `[analyze] pitch_length=${pitch.length} score=${analysis.score} user=${userId ?? "anon"}`
    );

    return NextResponse.json({ analysis, saved });
  } catch (error) {
    console.error(
      "[analyze] error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
