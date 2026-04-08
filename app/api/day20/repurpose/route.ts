import { NextResponse } from "next/server";
import { RepurposeInputSchema } from "@/lib/day20/validations/repurpose";
import { repurposeContent } from "@/lib/day20/gemini/repurpose";
import { getActiveModelId } from "@/lib/day20/ai/gemini";
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

    const parsed = RepurposeInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { sourceText, calibration, selectedOutputs } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to run the pipeline." },
        { status: 401 },
      );
    }

    // Rate limit: 10 pipelines/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("repurposed_content")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error:
            "You've run 10 pipelines today. Come back tomorrow.",
        },
        { status: 429 },
      );
    }

    // Generate — single Gemini call, all 7 outputs
    const genStart = Date.now();
    let result;
    try {
      result = await repurposeContent(sourceText, calibration);
    } catch (err) {
      console.error(
        "[day20/repurpose] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Pipeline generation failed. Please try again." },
        { status: 500 },
      );
    }
    const generationMs = Date.now() - genStart;

    const wordCount = sourceText.split(/\s+/).filter(Boolean).length;
    const hadCalibration = !!(
      calibration?.examplePost ||
      calibration?.tone ||
      calibration?.vocabUse ||
      calibration?.vocabAvoid
    );

    // Filter outputs to selected only
    const filteredOutputs: Record<string, unknown> = {};
    for (const key of selectedOutputs) {
      filteredOutputs[key] =
        result.outputs[key as keyof typeof result.outputs];
    }

    // Single INSERT — no pending row, no UPDATE (ISSUE 3)
    const { data: saved, error: insertErr } = await supabase
      .from("repurposed_content")
      .insert({
        user_id: user.id,
        source_text: sourceText,
        word_count: wordCount,
        had_voice_calibration: hadCalibration,
        outputs: filteredOutputs,
        generation_ms: generationMs,
        ai_model_used: getActiveModelId(),
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day20/repurpose] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save pipeline output" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      content: saved,
      wasTrimmed: result.wasTrimmed,
    });
  } catch (error) {
    console.error(
      "[day20/repurpose] error:",
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
      .from("repurposed_content")
      .select("id, word_count, had_voice_calibration, created_at, source_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load history" },
        { status: 500 },
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error(
      "[day20/repurpose] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
