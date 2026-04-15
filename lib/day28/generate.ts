import { getModelJson } from "@/lib/day28/ai/gemini";
import { changelogResultSchema } from "@/lib/day28/validations";
import type { ChangelogResult } from "@/types/day28";

const SYSTEM_PROMPT = `You are a developer advocate who writes engaging changelogs. Given a git log, generate:

1. A narrative changelog in markdown that tells the story of what changed and why it matters. Write it in a way that excites users and developers. Use headers, bold, and bullet points.

2. Structured sections (Features, Bug Fixes, Improvements, Breaking Changes, etc.) with an emoji for each section title and a list of items. Only include sections that have relevant commits.

3. Five tweetable content hooks (each under 280 characters) with different angles. Each hook should have:
   - text: the tweet text (under 280 chars)
   - angle: one of "achievement", "behind-the-scenes", "hot-take", "tip", "question"
   - charCount: the character count of the text

Also determine the commitCount (number of commits in the log) and dateRange (e.g. "Mar 15 - Mar 22, 2024").

Return valid JSON matching this schema:
{
  "narrative": "string (markdown)",
  "sections": [{ "emoji": "string", "title": "string", "items": ["string"] }],
  "tweetHooks": [{ "text": "string", "angle": "string", "charCount": number }],
  "commitCount": number,
  "dateRange": "string"
}`;

export async function generateChangelog(
  gitLog: string,
): Promise<ChangelogResult> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Generate a narrative changelog, structured sections, and 5 tweetable content hooks from the following git log:

GIT LOG:
${gitLog}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Extract JSON — find first { to last }
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  const validated = changelogResultSchema.parse(parsed);

  return validated;
}
