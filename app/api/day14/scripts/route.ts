import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SaveScriptInputSchema } from "@/lib/day14/validations/scripts";
import { getActiveModelId } from "@/lib/day14/ai/gemini";
import { validateHook } from "@/lib/day14/gemini/validateHook";
import { extractHookText } from "@/lib/day14/script/parser";
import type { ScriptSection } from "@/types/day14";

const DAILY_LIMIT = 10;
export const maxDuration = 60;

async function validateHookAsync(
  scriptId: string,
  userId: string,
  hookText: string,
) {
  try {
    const result = await validateHook(hookText);

    // Use service-role-like insert via a fresh server client
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from("hook_validations").insert({
      script_id: scriptId,
      user_id: userId,
      quality: result.quality,
      reasoning: result.reasoning,
      hook_text: result.hookText,
    });

    if (error) {
      console.error("[day14/scripts] hook validation insert error:", error.message);
    }
  } catch (err) {
    console.error(
      "[day14/scripts] hook validation error:",
      err instanceof Error ? err.message : "Unknown",
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = SaveScriptInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save scripts." },
        { status: 401 },
      );
    }

    // Rate limit: 10 scripts/day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("scripts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "You've generated 10 scripts today. Come back tomorrow." },
        { status: 429 },
      );
    }

    const {
      topic,
      targetDuration,
      targetWordCount,
      actualWordCount,
      scriptContent,
      sections,
      generationMs,
    } = parsed.data;

    // Single INSERT — fully populated, no pending row
    const { data: saved, error: insertErr } = await supabase
      .from("scripts")
      .insert({
        user_id: user.id,
        topic,
        target_duration: targetDuration,
        target_word_count: targetWordCount,
        actual_word_count: actualWordCount,
        script_content: scriptContent,
        sections,
        generation_ms: generationMs ?? null,
        ai_model_used: getActiveModelId(),
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day14/scripts] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save script" },
        { status: 500 },
      );
    }

    // Fire-and-forget hook validation
    const hookText = extractHookText(sections as ScriptSection[]);
    if (hookText) {
      void validateHookAsync(saved.id, user.id, hookText);
    }

    return NextResponse.json({
      scriptId: saved.id,
      wordCount: actualWordCount,
      targetWordCount,
    });
  } catch (error) {
    console.error(
      "[day14/scripts] POST error:",
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

    // Fetch scripts with latest hook validation quality
    const { data: scripts, error } = await supabase
      .from("scripts")
      .select("id, topic, target_duration, actual_word_count, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load scripts" },
        { status: 500 },
      );
    }

    // Fetch hook validations for these scripts
    const scriptIds = (scripts ?? []).map((s) => s.id);
    let validations: Array<{ script_id: string; quality: string }> = [];
    if (scriptIds.length > 0) {
      const { data: valData } = await supabase
        .from("hook_validations")
        .select("script_id, quality")
        .in("script_id", scriptIds);
      validations = valData ?? [];
    }

    const validationMap = new Map(
      validations.map((v) => [v.script_id, v.quality]),
    );

    const enriched = (scripts ?? []).map((s) => ({
      ...s,
      hook_quality: validationMap.get(s.id) ?? null,
    }));

    return NextResponse.json({ scripts: enriched });
  } catch (error) {
    console.error(
      "[day14/scripts] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
