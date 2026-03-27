import { NextResponse } from "next/server";
import { ReviewInputSchema } from "@/lib/day10/validations/review";
import { reviewCode } from "@/lib/day10/gemini/review";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { FindingSeverity } from "@/types/day10";

const DAILY_LIMIT = 15;

export async function POST(request: Request) {
  try {
    // 1. Parse and validate
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const parsed = ReviewInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { code, detectedLanguage } = parsed.data;

    // 2. Auth
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Rate limit: 15/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("code_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit of ${DAILY_LIMIT} reviews reached. Try again tomorrow.` },
        { status: 429 }
      );
    }

    // 4. Run Gemini review FIRST (before any DB write)
    const start = Date.now();
    let reviewResult;
    try {
      reviewResult = await reviewCode(code, detectedLanguage, user.id);
    } catch (err) {
      // Insert a failed record for history
      await supabase.from("code_reviews").insert({
        user_id: user.id,
        code_snippet: code,
        detected_language: detectedLanguage,
        status: "failed",
        error_message: err instanceof Error ? err.message : "Review failed",
        ai_model_used: "gemini-2.5-flash",
      });

      console.error(
        "[day10/review] gemini error:",
        err instanceof Error ? err.message : "Unknown"
      );
      return NextResponse.json(
        { error: "Review failed. Please try again." },
        { status: 500 }
      );
    }
    const reviewMs = Date.now() - start;

    // 5. Count findings by severity
    const counts: Record<FindingSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const f of reviewResult.findings) {
      counts[f.severity]++;
    }

    // 6. Insert complete record in one shot (no UPDATE needed — no UPDATE RLS policy)
    const { data: saved, error: insertErr } = await supabase
      .from("code_reviews")
      .insert({
        user_id: user.id,
        code_snippet: code,
        detected_language: detectedLanguage,
        status: "complete",
        confirmed_language: reviewResult.confirmedLanguage,
        total_lines: reviewResult.totalLines,
        summary: reviewResult.summary,
        findings: reviewResult.findings,
        critical_count: counts.critical,
        high_count: counts.high,
        medium_count: counts.medium,
        low_count: counts.low,
        review_ms: reviewMs,
        ai_model_used: "gemini-2.5-flash",
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day10/review] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: saved });
  } catch (error) {
    console.error(
      "[day10/review] error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
