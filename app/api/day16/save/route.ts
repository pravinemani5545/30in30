import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { VoiceoverSaveSchema } from "@/lib/day16/validations/voiceover";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = VoiceoverSaveSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d = parsed.data;

    // Single INSERT — no pending row, no UPDATE (see ISSUE 3)
    const { data: voiceover, error } = await supabase
      .from("voiceovers")
      .insert({
        user_id: user.id,
        text_content: d.textContent,
        character_count: d.characterCount,
        voice_id: d.voiceId,
        voice_name: d.voiceName ?? null,
        speed: d.speed,
        stability: d.stability,
        file_size_bytes: d.fileSizeBytes ?? null,
        duration_seconds: d.durationSeconds ?? null,
        estimated_cost: d.estimatedCost ?? null,
        storage_path: d.storagePath ?? null,
        script_id: d.scriptId ?? null,
        generation_ms: d.generationMs ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("[day16/save] insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to save voiceover" },
        { status: 500 },
      );
    }

    return NextResponse.json({ voiceover });
  } catch (error) {
    console.error(
      "[day16/save] POST error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
