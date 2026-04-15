import { getModelJson } from "@/lib/day30/ai/gemini";
import { ScriptSchema } from "@/lib/day30/validations";
import type { Ideation, Script } from "@/types/day30";

const SYSTEM_PROMPT = `You are a YouTube scriptwriter. Write a complete video script based on the given title and hook. Structure it with clear sections for filming.

Return JSON in this exact format:
{
  "title": "the video title",
  "totalDuration": "estimated total duration (e.g., '8-10 minutes')",
  "wordCount": 1500,
  "sections": [
    {
      "name": "Hook",
      "content": "full script text for this section",
      "duration": "0:00 - 0:30",
      "notes": "delivery notes (energy level, pacing, camera angles)"
    }
  ]
}

Required sections (in order):
1. Hook — first 15-30 seconds, must match the provided hook
2. Intro — set context, establish credibility, preview value (30-60s)
3. Main Point 1 — first major insight or step
4. Main Point 2 — second major insight or step
5. Main Point 3 — third major insight or step
6. CTA — call to action (subscribe, comment, like)
7. Outro — wrap up, tease next video

Rules:
- Write in a conversational, engaging tone
- Include specific examples and actionable advice
- Each section should have practical delivery notes
- Word count should reflect the total script length accurately
- Target 8-12 minutes total duration`;

export async function generateScript(ideation: Ideation): Promise<Script> {
  const selected = ideation.variations[ideation.selectedIndex];
  const model = getModelJson(SYSTEM_PROMPT);

  const prompt = `Write a complete YouTube script for:
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
    throw new Error("Script: no JSON found in response");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1));
  return ScriptSchema.parse(parsed);
}
