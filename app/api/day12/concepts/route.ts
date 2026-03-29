import { NextResponse } from "next/server";
import { ConceptInputSchema } from "@/lib/day12/validations/concepts";
import { generateConcepts } from "@/lib/day12/gemini/concepts";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Tone } from "@/types/day12";

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

    const parsed = ConceptInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { videoTitle, niche, tone } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to generate thumbnail concepts." },
        { status: 401 },
      );
    }

    // Rate limit: 20/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("thumbnail_concepts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "You've generated 20 sets today. Come back tomorrow." },
        { status: 429 },
      );
    }

    // Generate all three concepts in a single Gemini call
    const start = Date.now();
    let result;
    try {
      result = await generateConcepts(
        videoTitle,
        niche,
        tone as Tone,
        user.id,
      );
    } catch (err) {
      console.error(
        "[day12/concepts] gemini error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Generation failed. Please try again." },
        { status: 500 },
      );
    }
    const generationMs = Date.now() - start;

    // Single INSERT after all Gemini processing — no pending row
    const { data: saved, error: insertErr } = await supabase
      .from("thumbnail_concepts")
      .insert({
        user_id: user.id,
        video_title: videoTitle,
        niche,
        tone,
        predicted_winner: result.predictedWinner,
        ab_hypothesis: result.abHypothesis,
        concepts: result.concepts,
        generation_ms: generationMs,
        ai_model_used: "gemini-2.5-flash",
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day12/concepts] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save concepts" },
        { status: 500 },
      );
    }

    return NextResponse.json({ conceptSet: saved });
  } catch (error) {
    console.error(
      "[day12/concepts] error:",
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
      .from("thumbnail_concepts")
      .select(
        "id, video_title, niche, tone, predicted_winner, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load history" },
        { status: 500 },
      );
    }

    return NextResponse.json({ concepts: data ?? [] });
  } catch (error) {
    console.error(
      "[day12/concepts] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
