import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { analyzeRequestSchema, analyzedEntrySchema } from "@/lib/validations/journal";

const RATE_LIMIT = 20;

export async function POST(request: Request) {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { transcript, duration_seconds } = parsed.data;

  // 3. Rate limit: max 20 entries per user per day (UTC midnight as cutoff)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  if (countError) {
    console.error("[analyze] rate limit check failed:", countError.message);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json(
      { error: `Daily limit reached (${RATE_LIMIT} entries per day).` },
      { status: 429 }
    );
  }

  // 4. Call Claude API with Structured Outputs
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let analyzed: ReturnType<typeof analyzedEntrySchema.parse>;
  try {
    const response = await anthropic.messages.create(
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are a compassionate, perceptive journal assistant. You read stream-of-consciousness voice transcripts and find the emotional truth beneath the surface. You identify what happened, how it felt, and what it means. You generate titles that are specific to what actually happened in the entry — use real details, names, or situations from the transcript. You surface implicit gratitude, not just explicit thanks. Your intention suggestions are specific and grounded — not generic motivational advice. Extract structure without losing soul.`,
        messages: [
          {
            role: "user",
            content: `Please analyze this journal entry transcript:\n\n${transcript}`,
          },
        ],
        // Structured Outputs (public beta) — output_config is in SDK types as of 0.79+
        output_config: {
          format: {
            type: "json_schema",
            schema: {
              type: "object",
              properties: {
                mood: {
                  type: "string",
                  enum: ["happy", "sad", "anxious", "reflective", "energized", "neutral", "frustrated", "grateful"],
                  description: "The primary emotional tone of the entry",
                },
                mood_intensity: {
                  type: "integer",
                  description: "Intensity of the mood from 1 (subtle) to 10 (overwhelming)",
                },
                mood_summary: {
                  type: "string",
                  description: "One evocative sentence describing the emotional state",
                },
                events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Short event name" },
                      description: { type: "string", description: "What happened" },
                      significance: {
                        type: "string",
                        enum: ["high", "medium", "low"],
                        description: "How significant this event seems to the person",
                      },
                    },
                    required: ["title", "description", "significance"],
                    additionalProperties: false,
                  },
                  description: "Key events or experiences mentioned",
                },
                reflections: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      insight: { type: "string", description: "The insight or realization" },
                      theme: { type: "string", description: "The underlying theme (e.g. 'identity', 'relationships', 'work')" },
                    },
                    required: ["insight", "theme"],
                    additionalProperties: false,
                  },
                  description: "Deeper insights or reflections surfaced in the entry",
                },
                gratitude: {
                  type: "array",
                  items: { type: "string" },
                  description: "Things the person seems grateful for, even if not explicitly stated",
                },
                tomorrow_intention: {
                  type: "string",
                  description: "One specific, grounded intention for tomorrow based on this entry",
                },
                entry_title: {
                  type: "string",
                  description: "A short title (4-7 words) directly referencing what actually happened or was discussed in the entry — specific, not abstract",
                },
              },
              required: [
                "mood", "mood_intensity", "mood_summary",
                "events", "reflections", "gratitude",
                "tomorrow_intention", "entry_title",
              ],
              additionalProperties: false,
            },
          },
        },
      },
      {
        signal: controller.signal,
        headers: {
          "anthropic-beta": "structured-outputs-2025-11-13",
        },
      }
    );

    clearTimeout(timeout);

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const raw = JSON.parse(content.text) as unknown;
    analyzed = analyzedEntrySchema.parse(raw);
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Analysis timed out — please try again." }, { status: 503 });
    }
    console.error("[analyze] Claude API error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Analysis failed — please try again." }, { status: 503 });
  }

  // 5. Save to Supabase
  const wordCount = transcript.trim().split(/\s+/).length;

  const { data: entry, error: insertError } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      raw_transcript: transcript,
      duration_seconds: duration_seconds ?? null,
      word_count: wordCount,
      ...analyzed,
      events: analyzed.events,
      reflections: analyzed.reflections,
      gratitude: analyzed.gratitude,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[analyze] Supabase insert error:", insertError.message);
    // Return result even if save fails — don't lose user's data
    return NextResponse.json({ ...analyzed, id: null }, { status: 200 });
  }

  console.info("[analyze] Entry saved:", entry.id, "duration:", duration_seconds);

  return NextResponse.json({ ...analyzed, id: entry.id }, { status: 200 });
}
