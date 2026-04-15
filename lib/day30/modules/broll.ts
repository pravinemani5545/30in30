import { getModelJson } from "@/lib/day30/ai/gemini";
import { BRollBriefSchema } from "@/lib/day30/validations";
import type { Ideation, BRollBrief } from "@/types/day30";

const SYSTEM_PROMPT = `You are a YouTube video producer specialising in B-roll planning. Generate a detailed B-roll shot list that complements the video topic and keeps viewers visually engaged.

Return JSON in this exact format:
{
  "items": [
    {
      "timestamp": "0:00 - 0:15",
      "description": "detailed description of the B-roll shot or sequence",
      "searchTerms": ["stock footage search term 1", "search term 2"],
      "mood": "energetic | calm | dramatic | professional | playful | inspiring"
    }
  ],
  "totalClips": 12
}

Rules:
- Generate 8-15 B-roll items covering the full video timeline
- Timestamps should be sequential and cover the expected 8-12 minute duration
- Search terms should be specific enough to find relevant stock footage
- Descriptions should be detailed enough for a video editor to understand the vision
- Vary moods across the video to maintain visual interest
- Include a mix of: establishing shots, close-ups, transitions, and contextual footage
- totalClips must match the actual number of items`;

export async function generateBRollBrief(
  ideation: Ideation,
): Promise<BRollBrief> {
  const selected = ideation.variations[ideation.selectedIndex];
  const model = getModelJson(SYSTEM_PROMPT);

  const prompt = `Generate a B-roll shot list for a YouTube video:
Title: ${selected.title}
Hook: ${selected.hook}
Angle: ${selected.angle}
Topic: ${ideation.topic}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("B-Roll: no JSON found in response");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1));
  return BRollBriefSchema.parse(parsed);
}
