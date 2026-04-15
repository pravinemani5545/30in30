import { getModelJson } from "@/lib/day30/ai/gemini";
import { ThumbnailPackSchema } from "@/lib/day30/validations";
import type { Ideation, ThumbnailPack } from "@/types/day30";

const SYSTEM_PROMPT = `You are a YouTube thumbnail designer and CTR optimisation expert. Generate 3 thumbnail concepts that maximise click-through rate.

Return JSON in this exact format:
{
  "concepts": [
    {
      "layout": "detailed layout description (subject position, background, composition)",
      "textOverlay": "text to display on the thumbnail (max 5 words, large and bold)",
      "emotionTrigger": "the psychological trigger this thumbnail uses (e.g., 'curiosity gap', 'social proof', 'fear of missing out')",
      "colorScheme": "primary and secondary colors (e.g., 'bright yellow background with red text')",
      "description": "brief creative direction summary for a designer"
    }
  ]
}

Rules:
- Generate exactly 3 concepts with different visual approaches
- Text overlays should be SHORT (3-5 words max) and create curiosity
- Each concept should use a different psychological trigger
- Color schemes should be bold and high-contrast for small screens
- Layouts should follow YouTube thumbnail best practices (faces, contrast, readable text)
- Descriptions should be actionable for a graphic designer`;

export async function generateThumbnails(
  ideation: Ideation,
): Promise<ThumbnailPack> {
  const selected = ideation.variations[ideation.selectedIndex];
  const model = getModelJson(SYSTEM_PROMPT);

  const prompt = `Generate 3 YouTube thumbnail concepts for:
Title: ${selected.title}
Hook: ${selected.hook}
Angle: ${selected.angle}
Target emotion: ${selected.targetEmotion}
Topic: ${ideation.topic}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Thumbnails: no JSON found in response");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1));
  return ThumbnailPackSchema.parse(parsed);
}
