import { NextResponse } from "next/server";
import { ProfileInputSchema } from "@/lib/day13/validations/profiles";
import { synthesiseICP } from "@/lib/day13/gemini/synthesise";
import { generateRealityCheck } from "@/lib/day13/gemini/realityCheck";
import { getActiveModelId } from "@/lib/day13/ai/gemini";
import { createSupabaseServer } from "@/lib/supabase/server";

const DAILY_LIMIT = 5;
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = ProfileInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { companyName, answers } = parsed.data;

    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to build an ICP profile." },
        { status: 401 },
      );
    }

    // Rate limit: 5 profiles/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("icp_profiles")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "You've created 5 ICP profiles today. Come back tomorrow." },
        { status: 429 },
      );
    }

    // Call 1: Gemini synthesis (JSON mode)
    const synthStart = Date.now();
    let synthesis;
    try {
      synthesis = await synthesiseICP(companyName, answers);
    } catch (err) {
      console.error(
        "[day13/profiles] synthesis error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "ICP synthesis failed. Please try again." },
        { status: 500 },
      );
    }
    const synthesisMs = Date.now() - synthStart;

    // Call 2: Gemini reality check (plain text) — sequential, uses synthesis
    const rcStart = Date.now();
    let realityCheckText;
    try {
      realityCheckText = await generateRealityCheck(synthesis, answers);
    } catch (err) {
      console.error(
        "[day13/profiles] reality check error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Reality check generation failed. Please try again." },
        { status: 500 },
      );
    }
    const realityCheckMs = Date.now() - rcStart;

    // Single INSERT after both calls complete — no pending row, no UPDATE
    const { data: saved, error: insertErr } = await supabase
      .from("icp_profiles")
      .insert({
        user_id: user.id,
        company_name: companyName,
        interview_answers: answers,
        firmographic_profile: synthesis.firmographicProfile,
        pain_point_hierarchy: synthesis.painPointHierarchy,
        objection_map: synthesis.objectionMap,
        recommended_channels: synthesis.recommendedChannels,
        reality_check_text: realityCheckText,
        synthesis_ms: synthesisMs,
        reality_check_ms: realityCheckMs,
        ai_model_used: getActiveModelId(),
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day13/profiles] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save ICP profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({ profile: saved });
  } catch (error) {
    console.error(
      "[day13/profiles] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("icp_profiles")
      .select("id, company_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 });
    }

    return NextResponse.json({ profiles: data ?? [] });
  } catch (error) {
    console.error(
      "[day13/profiles] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
