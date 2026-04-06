import { NextResponse } from "next/server";
import { DomainCheckSchema } from "@/lib/day17/validations/deliverability";
import { checkSPF, checkDKIM, checkDMARC, checkMX, checkDomainAge } from "@/lib/day17/dns/checks";
import { calculateScore, scoreToGrade, allChecksPassed } from "@/lib/day17/dns/grader";
import { generateExplanations } from "@/lib/day17/gemini/deliverability";
import { getActiveModelId } from "@/lib/day17/ai/gemini";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const DAILY_LIMIT = 20;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = DomainCheckSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid domain" },
        { status: 400 },
      );
    }

    const { domain } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to check deliverability." },
        { status: 401 },
      );
    }

    // Rate limit: 20 checks/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("deliverability_checks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `You've run ${DAILY_LIMIT} checks today. Come back tomorrow.` },
        { status: 429 },
      );
    }

    // Run all 5 DNS checks in parallel
    const lookupStart = Date.now();
    const [spf, dkim, dmarc, mx, domainAge] = await Promise.all([
      checkSPF(domain),
      checkDKIM(domain),
      checkDMARC(domain),
      checkMX(domain),
      checkDomainAge(domain),
    ]);
    const lookupMs = Date.now() - lookupStart;

    const results = { spf, dkim, dmarc, mx, domainAge };
    const score = calculateScore(results);
    const grade = scoreToGrade(score);
    const passed = allChecksPassed(results);

    // Gemini: translate results into plain English
    const aiStart = Date.now();
    let explanations;
    try {
      explanations = await generateExplanations(domain, results, grade, score);
    } catch (err) {
      console.error(
        "[day17/check] Gemini error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "AI explanation generation failed. Please try again." },
        { status: 500 },
      );
    }
    const aiMs = Date.now() - aiStart;

    // Single INSERT — fully populated, no pending row
    const { data: saved, error: insertErr } = await supabase
      .from("deliverability_checks")
      .insert({
        user_id: user.id,
        domain,
        overall_grade: grade,
        overall_score: score,
        all_checks_passed: passed,
        spf_result: spf,
        dkim_result: dkim,
        dmarc_result: dmarc,
        mx_result: mx,
        domain_age_result: domainAge,
        dkim_selector_found: dkim.selectorFound ?? null,
        explanations,
        lookup_ms: lookupMs,
        ai_ms: aiMs,
        ai_model_used: getActiveModelId(),
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day17/check] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save check results" },
        { status: 500 },
      );
    }

    return NextResponse.json({ report: saved });
  } catch (error) {
    console.error(
      "[day17/check] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
