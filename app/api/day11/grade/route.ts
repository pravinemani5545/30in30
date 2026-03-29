import { NextResponse } from "next/server";
import { EmailGradeInputSchema } from "@/lib/day11/validations/grade";
import { gradeEmail } from "@/lib/day11/gemini/grade";
import { rewriteEmail } from "@/lib/day11/gemini/rewrite";
import { getOptionalUser } from "@/lib/auth/guest";

const DAILY_LIMIT = 20;

export async function POST(request: Request) {
  try {
    // 1. Parse + validate
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const parsed = EmailGradeInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // 2. Optional auth (guest access)
    const { user, supabase, isGuest } = await getOptionalUser();

    // 3. Rate limit (authenticated users only)
    if (!isGuest && supabase && user) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("email_grades")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString());

      if ((count ?? 0) >= DAILY_LIMIT) {
        return NextResponse.json(
          { error: "You've graded 20 emails today. Come back tomorrow." },
          { status: 429 }
        );
      }
    }

    // 4. Call 1: Grade
    const gradeStart = Date.now();
    let gradeResult;
    try {
      gradeResult = await gradeEmail(email);
    } catch (err) {
      console.error(
        "[day11/grade] gemini grade error:",
        err instanceof Error ? err.message : "Unknown"
      );
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
    const gradeMs = Date.now() - gradeStart;

    // 5. Call 2: Rewrite (only if score < 75)
    let rewriteResult = null;
    let rewriteMs = null;

    if (gradeResult.rewriteNeeded) {
      const rewriteStart = Date.now();
      try {
        rewriteResult = await rewriteEmail(email, gradeResult);
      } catch (err) {
        console.error(
          "[day11/grade] gemini rewrite error:",
          err instanceof Error ? err.message : "Unknown"
        );
        // Rewrite failure is not fatal — still return the grade
      }
      rewriteMs = Date.now() - rewriteStart;
    }

    const wordCount = email.trim().split(/\s+/).length;

    // 6. Save (authenticated users only)
    if (!isGuest && supabase && user) {
      const { data: saved, error: insertErr } = await supabase
        .from("email_grades")
        .insert({
          user_id: user.id,
          original_email: email,
          email_word_count: wordCount,
          overall_score: gradeResult.overallScore,
          gate_passed: gradeResult.gatePassed,
          personalization_score: gradeResult.dimensions.personalization.score,
          spam_score: gradeResult.dimensions.spam.score,
          cta_score: gradeResult.dimensions.cta.score,
          reading_score: gradeResult.dimensions.reading.score,
          personalization_finding: gradeResult.dimensions.personalization.finding,
          spam_finding: gradeResult.dimensions.spam.finding,
          cta_finding: gradeResult.dimensions.cta.finding,
          reading_finding: gradeResult.dimensions.reading.finding,
          spam_words_found: gradeResult.dimensions.spam.wordsFound,
          rewrite_email: rewriteResult?.rewrittenEmail ?? null,
          rewrite_projected_score: rewriteResult?.projectedScore ?? null,
          rewrite_explanation: rewriteResult?.explanation ?? null,
          grade_ms: gradeMs,
          rewrite_ms: rewriteMs,
          ai_model_used: "gemini-2.5-flash",
        })
        .select()
        .single();

      if (insertErr || !saved) {
        console.error("[day11/grade] insert error:", insertErr?.message);
        return NextResponse.json(
          { error: "Failed to save grade" },
          { status: 500 }
        );
      }

      console.log(
        `[day11/grade] user=${user.id} score=${gradeResult.overallScore} gate=${gradeResult.gatePassed} gradeMs=${gradeMs} rewriteMs=${rewriteMs}`
      );

      return NextResponse.json({ grade: saved, saved: true });
    }

    // Guest: return grade without saving
    console.log(
      `[day11/grade] user=guest score=${gradeResult.overallScore} gate=${gradeResult.gatePassed} gradeMs=${gradeMs} rewriteMs=${rewriteMs}`
    );

    return NextResponse.json({
      grade: {
        id: null,
        original_email: email,
        email_word_count: wordCount,
        overall_score: gradeResult.overallScore,
        gate_passed: gradeResult.gatePassed,
        personalization_score: gradeResult.dimensions.personalization.score,
        spam_score: gradeResult.dimensions.spam.score,
        cta_score: gradeResult.dimensions.cta.score,
        reading_score: gradeResult.dimensions.reading.score,
        personalization_finding: gradeResult.dimensions.personalization.finding,
        spam_finding: gradeResult.dimensions.spam.finding,
        cta_finding: gradeResult.dimensions.cta.finding,
        reading_finding: gradeResult.dimensions.reading.finding,
        spam_words_found: gradeResult.dimensions.spam.wordsFound,
        rewrite_email: rewriteResult?.rewrittenEmail ?? null,
        rewrite_projected_score: rewriteResult?.projectedScore ?? null,
        rewrite_explanation: rewriteResult?.explanation ?? null,
        grade_ms: gradeMs,
        rewrite_ms: rewriteMs,
      },
      saved: false,
    });
  } catch (error) {
    console.error(
      "[day11/grade] error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
