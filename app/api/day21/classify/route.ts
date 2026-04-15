import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { classifyInputSchema } from "@/lib/day21/validations";
import { classifyReply } from "@/lib/day21/ai/gemini";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = classifyInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { replyText, sender } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to classify replies." },
        { status: 401 },
      );
    }

    // Classify with Gemini
    let result;
    try {
      result = await classifyReply(replyText, sender);
    } catch (err) {
      console.error(
        "[day21/classify] Gemini error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Classification failed. Please try again." },
        { status: 500 },
      );
    }

    // Save to database
    const { data: saved, error: insertErr } = await supabase
      .from("day21_classified_replies")
      .insert({
        user_id: user.id,
        reply_text: replyText,
        sender: sender || null,
        category: result.category,
        confidence: result.confidence,
        reasoning: result.reasoning,
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day21/classify] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save classification" },
        { status: 500 },
      );
    }

    return NextResponse.json({ item: saved });
  } catch (error) {
    console.error(
      "[day21/classify] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
