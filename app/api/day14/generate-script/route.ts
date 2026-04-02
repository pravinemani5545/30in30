import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createSupabaseServer } from "@/lib/supabase/server";
import { GenerateScriptInputSchema } from "@/lib/day14/validations/scripts";
import {
  SCRIPT_SYSTEM_PROMPT,
  buildScriptPrompt,
} from "@/lib/day14/gemini/prompts";
import { calcTargetWordCount } from "@/lib/day14/script/structure";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = GenerateScriptInputSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input";
      return new Response(msg, { status: 400 });
    }

    const { topic, targetDuration } = parsed.data;
    const targetWordCount = calcTargetWordCount(targetDuration);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: SCRIPT_SYSTEM_PROMPT,
      prompt: buildScriptPrompt(topic, targetWordCount, targetDuration),
      maxOutputTokens: 4000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(
      "[day14/generate-script] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return new Response("Generation failed", { status: 500 });
  }
}
