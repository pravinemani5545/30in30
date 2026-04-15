import { getModelJson } from "@/lib/day22/ai/gemini";
import { bRollAnalysisSchema } from "@/lib/day22/validations";
import type { BRollAnalysis } from "@/types/day22";

const SYSTEM_PROMPT = `You are a video B-roll planning assistant. Given a script, break it into visual segments based on 130 words per minute speaking rate. For each segment, suggest B-roll footage concepts with search terms.

Rules:
- Calculate total duration from word count at 130 WPM
- Break the script into logical visual segments (aim for 15-45 second segments)
- Each segment needs a timestamp range (e.g. "0:00 - 0:28")
- Provide the script excerpt for each segment
- Describe the visual B-roll concept clearly (what should appear on screen)
- Give 3-5 specific search terms for finding stock footage
- Assign a mood to each segment (e.g. "energetic", "contemplative", "urgent", "calm", "dramatic")
- Duration in seconds for each segment

Return JSON with this exact structure:
{
  "totalDuration": "X:XX",
  "wordCount": <number>,
  "concepts": [
    {
      "timestamp": "0:00 - 0:28",
      "scriptExcerpt": "...",
      "visualConcept": "...",
      "searchTerms": ["term1", "term2", "term3"],
      "mood": "...",
      "duration": 28
    }
  ]
}`;

export async function analyzeScript(
  script: string,
): Promise<BRollAnalysis> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Analyze the following script and generate B-roll concepts for each segment:

SCRIPT:
${script}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Extract JSON from first { to last }
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  const validated = bRollAnalysisSchema.parse(parsed);

  return validated;
}
