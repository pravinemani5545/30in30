import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchVoices } from "@/lib/day16/elevenlabs/client";
import type { ElevenLabsVoice } from "@/types/day16";

// In-memory cache for voice list (process-level, not per-request)
let cachedVoices: ElevenLabsVoice[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return cached voices if still fresh
    if (cachedVoices && Date.now() - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json({ voices: cachedVoices });
    }

    const voices = await fetchVoices();
    const mapped: ElevenLabsVoice[] = voices.map((v) => ({
      voice_id: v.voice_id,
      name: v.name,
      category: v.category as ElevenLabsVoice["category"],
      labels: v.labels,
      preview_url: v.preview_url,
      description: v.description,
    }));

    cachedVoices = mapped;
    cacheTimestamp = Date.now();

    return NextResponse.json({ voices: mapped });
  } catch (error) {
    console.error(
      "[day16/voices] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 },
    );
  }
}
