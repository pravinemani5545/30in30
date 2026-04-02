import { NextResponse } from "next/server";
import { SequenceInputSchema } from "@/lib/day15/validations/sequences";
import { generateSequence } from "@/lib/day15/gemini/sequence";
import { getActiveModelId } from "@/lib/day15/ai/gemini";
import { createSupabaseServer } from "@/lib/supabase/server";

const DAILY_LIMIT = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = SequenceInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { persona, valueProp, socialProof, observation } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to generate sequences." },
        { status: 401 },
      );
    }

    // Rate limit: 10 sequences/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("email_sequences")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "You've generated 10 sequences today. Come back tomorrow." },
        { status: 429 },
      );
    }

    // Generate sequence — single Gemini call, all five emails
    const genStart = Date.now();
    let sequence;
    try {
      sequence = await generateSequence(
        persona,
        valueProp,
        socialProof,
        observation,
      );
    } catch (err) {
      console.error(
        "[day15/sequences] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Sequence generation failed. Please try again." },
        { status: 500 },
      );
    }
    const generationMs = Date.now() - genStart;

    // Check if pivot email (index 2) has follow-up language
    const hasFollowupWarning = sequence.emails[2]?.hasFollowupLanguage ?? false;

    // Single INSERT — no pending row, no UPDATE
    const { data: saved, error: insertErr } = await supabase
      .from("email_sequences")
      .insert({
        user_id: user.id,
        persona,
        value_proposition: valueProp,
        social_proof: socialProof,
        observation: observation || null,
        emails: sequence.emails,
        has_followup_warning: hasFollowupWarning,
        generation_ms: generationMs,
        ai_model_used: getActiveModelId(),
        sequence_summary: sequence.sequenceSummary,
        pivot_angle: sequence.pivotAngle,
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day15/sequences] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save sequence" },
        { status: 500 },
      );
    }

    return NextResponse.json({ sequence: saved });
  } catch (error) {
    console.error(
      "[day15/sequences] error:",
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("email_sequences")
      .select("id, persona, has_followup_warning, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load sequences" },
        { status: 500 },
      );
    }

    return NextResponse.json({ sequences: data ?? [] });
  } catch (error) {
    console.error(
      "[day15/sequences] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
