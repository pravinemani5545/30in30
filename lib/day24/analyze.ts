import { getModelJson } from "@/lib/day24/ai/gemini";
import { videoIdeaAnalysisSchema } from "@/lib/day24/validations";
import type { VideoIdeaAnalysis } from "@/types/day24";

const SYSTEM_PROMPT = `You are a YouTube content strategist. Given a niche keyword, simulate an outlier analysis by generating 10 realistic high-performing video examples with view-to-subscriber ratios above 5x. Then extract 3-5 content patterns from these outliers. Finally, generate 5 unique video ideas based on these patterns.

Rules:
- Generate 10 outlier videos with realistic titles, view counts (100K-50M), subscriber counts, and ratios above 5x
- Each outlier needs a clear "whyOutlier" explanation
- Upload dates should be within the last 12 months
- Extract 3-5 patterns that explain WHY these videos over-performed
- Each pattern needs a name, description, example video titles from the outliers, and frequency (1-10)
- Generate 5 video ideas based on the discovered patterns
- Each idea needs a title, hook (first 10 seconds script), unique angle, format type, estimated performance, and reasoning
- Performance levels: "high" (likely viral), "medium" (solid performer), "moderate" (steady growth)
- The niche field should echo back the input keyword

Return JSON with this exact structure:
{
  "niche": "the keyword",
  "outlierVideos": [
    {
      "title": "...",
      "views": 1500000,
      "subscribers": 120000,
      "ratio": 12.5,
      "uploadDate": "2025-06-15",
      "whyOutlier": "..."
    }
  ],
  "patterns": [
    {
      "name": "...",
      "description": "...",
      "examples": ["Video Title 1", "Video Title 2"],
      "frequency": 7
    }
  ],
  "ideas": [
    {
      "title": "...",
      "hook": "...",
      "angle": "...",
      "format": "listicle",
      "estimatedPerformance": "high",
      "reasoning": "..."
    }
  ]
}`;

export async function analyzeNiche(
  niche: string,
): Promise<VideoIdeaAnalysis> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Analyze the following niche and generate outlier video data, content patterns, and video ideas:

NICHE: ${niche}`;

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
  const validated = videoIdeaAnalysisSchema.parse(parsed);

  return validated;
}
