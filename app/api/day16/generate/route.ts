export const maxDuration = 60;

import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { VoiceoverGenerateSchema } from "@/lib/day16/validations/voiceover";
import { streamVoiceover } from "@/lib/day16/elevenlabs/client";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = VoiceoverGenerateSchema.safeParse(body);

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

    // Rate limit: 20 voiceovers per day
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const { count } = await supabase
      .from("voiceovers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", twentyFourHoursAgo);

    if (count !== null && count >= 20) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 20 voiceovers per day." },
        { status: 429 },
      );
    }

    const { text, voiceId, settings } = parsed.data;

    // Forward the ElevenLabs stream directly — do NOT buffer on server
    const elevenLabsResponse = await streamVoiceover(
      text,
      voiceId,
      settings.stability,
    );

    return new Response(elevenLabsResponse.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error(
      "[day16/generate] POST error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Failed to generate voiceover" },
      { status: 500 },
    );
  }
}
