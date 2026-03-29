import { NextResponse } from "next/server";
import { getGemini } from "@/lib/day1/gemini";
import { SchemaType } from "@google/generative-ai";
import { getOptionalUser } from "@/lib/auth/guest";
import { analyzeRequestSchema, analyzedEntrySchema } from "@/lib/day1/validations/journal";

const RATE_LIMIT = 20;

export async function POST(request: Request) {
  // 1. Optional auth (guest access)
  const { user, supabase, isGuest } = await getOptionalUser();

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

  // 3. Rate limit (authenticated users only)
  if (!isGuest && supabase && user) {
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
  }

  // 4. Call Gemini API with Structured Outputs
  const systemPromptText = `You are a compassionate, perceptive journal assistant. You read stream-of-consciousness voice transcripts and find the emotional truth beneath the surface. You identify what happened, how it felt, and what it means. You generate titles that are specific to what actually happened in the entry — use real details, names, or situations from the transcript. You surface implicit gratitude, not just explicit thanks. Your intention suggestions are specific and grounded — not generic motivational advice. Extract structure without losing soul.`;

  const userPrompt = `Please analyze this journal entry transcript:\n\n${transcript}`;

  const geminiSchema: import("@google/generative-ai").ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      mood: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["happy", "sad", "anxious", "reflective", "energized", "neutral", "frustrated", "grateful"],
        description: "The primary emotional tone of the entry",
      },
      mood_intensity: {
        type: SchemaType.INTEGER,
        description: "Intensity of the mood from 1 (subtle) to 10 (overwhelming)",
      },
      mood_summary: {
        type: SchemaType.STRING,
        description: "One evocative sentence describing the emotional state",
      },
      events: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING, description: "Short event name" },
            description: { type: SchemaType.STRING, description: "What happened" },
            significance: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["high", "medium", "low"],
              description: "How significant this event seems to the person",
            },
          },
          required: ["title", "description", "significance"],
        },
        description: "Key events or experiences mentioned",
      },
      reflections: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            insight: { type: SchemaType.STRING, description: "The insight or realization" },
            theme: { type: SchemaType.STRING, description: "The underlying theme (e.g. 'identity', 'relationships', 'work')" },
          },
          required: ["insight", "theme"],
        },
        description: "Deeper insights or reflections surfaced in the entry",
      },
      gratitude: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Things the person seems grateful for, even if not explicitly stated",
      },
      tomorrow_intention: {
        type: SchemaType.STRING,
        description: "One specific, grounded intention for tomorrow based on this entry",
      },
      entry_title: {
        type: SchemaType.STRING,
        description: "A short title (4-7 words) directly referencing what actually happened or was discussed in the entry — specific, not abstract",
      },
    },
    required: [
      "mood", "mood_intensity", "mood_summary",
      "events", "reflections", "gratitude",
      "tomorrow_intention", "entry_title",
    ],
  };

  let analyzed: ReturnType<typeof analyzedEntrySchema.parse>;
  try {
    const model = getGemini().getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: systemPromptText,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
      },
    });

    const result = await model.generateContent(userPrompt);
    const raw = JSON.parse(result.response.text()) as unknown;
    analyzed = analyzedEntrySchema.parse(raw);
  } catch (err) {
    console.error("[analyze] Gemini API error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Analysis failed — please try again." }, { status: 503 });
  }

  // 5. Save to Supabase (authenticated users only)
  if (!isGuest && supabase && user) {
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
      return NextResponse.json({ ...analyzed, id: null, saved: false }, { status: 200 });
    }

    console.info("[analyze] Entry saved:", entry.id, "duration:", duration_seconds);
    return NextResponse.json({ ...analyzed, id: entry.id, saved: true }, { status: 200 });
  }

  return NextResponse.json({ ...analyzed, id: null, saved: false }, { status: 200 });
}
