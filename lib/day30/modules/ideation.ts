import { getModelJson } from "@/lib/day30/ai/gemini";
import { IdeationSchema } from "@/lib/day30/validations";
import type { Ideation } from "@/types/day30";

const SYSTEM_PROMPT = `You are a YouTube content strategist. Generate 3 YouTube video title/hook variations for the given topic. Each variation should take a different angle and target a different emotion.

Return JSON in this exact format:
{
  "topic": "the original topic",
  "variations": [
    {
      "title": "compelling YouTube title (max 70 chars)",
      "hook": "opening hook sentence that grabs attention in first 5 seconds",
      "angle": "brief description of the angle (e.g., 'contrarian take', 'beginner-friendly tutorial', 'personal story')",
      "targetEmotion": "primary emotion to evoke (e.g., 'curiosity', 'urgency', 'aspiration')"
    }
  ],
  "selectedIndex": 0
}

Rules:
- Generate exactly 3 variations
- Each title should be optimised for YouTube CTR
- Hooks should be conversational and immediately engaging
- Angles must be meaningfully different from each other
- Set selectedIndex to the variation you think will perform best (0, 1, or 2)`;

export async function generateIdeation(topic: string): Promise<Ideation> {
  const model = getModelJson(SYSTEM_PROMPT);

  const result = await model.generateContent(
    `Generate 3 YouTube video title/hook variations for this topic: ${topic}`,
  );

  const raw = result.response.text();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Ideation: no JSON found in response");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1));
  return IdeationSchema.parse(parsed);
}
