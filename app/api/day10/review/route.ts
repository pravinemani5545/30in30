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

    // 4. Create pending record
    const { data: pendingReview, error: insertErr } = await supabase
      .from("code_reviews")
      .insert({
        user_id: user.id,
        code_snippet: code,
        detected_language: detectedLanguage,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr || !pendingReview) {
      console.error("[day10/review] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    // 5. Run Gemini review
    let reviewResult;
    try {
      reviewResult = await reviewCode(code, detectedLanguage, user.id);
    } catch (err) {
      // Update status to failed
      await supabase
        .from("code_reviews")
        .update({
          status: "failed",
          error_message:
            err instanceof Error ? err.message : "Review failed",
        })
        .eq("id", pendingReview.id);

      console.error(
        "[day10/review] gemini error:",
        err instanceof Error ? err.message : "Unknown"
      );
      return NextResponse.json(
        { error: "Review failed. Please try again." },
        { status: 500 }
      );
    }

    // 6. Count findings by severity
    const counts: Record<FindingSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const f of reviewResult.findings) {
      counts[f.severity]++;
    }

    // 7. Update record with results
    const start = Date.now();
    const { data: updated, error: updateErr } = await supabase
      .from("code_reviews")
      .update({
        status: "complete",
        confirmed_language: reviewResult.confirmedLanguage,
        total_lines: reviewResult.totalLines,
        summary: reviewResult.summary,
        findings: reviewResult.findings,
        critical_count: counts.critical,
        high_count: counts.high,
        medium_count: counts.medium,
        low_count: counts.low,
        review_ms: Date.now() - start,
        ai_model_used: "gemini-2.5-flash-preview-05-20",
      })
      .eq("id", pendingReview.id)
      .select()
      .single();

    if (updateErr) {
      console.error("[day10/review] update error:", updateErr.message);
    }

    return NextResponse.json({ review: updated });
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
