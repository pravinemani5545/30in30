import type { CalendarInput, CalendarOutput, PostItem } from "@/types/day19";
import { getModelJson, getActiveModelId } from "@/lib/day19/ai/gemini";
import { CALENDAR_SYSTEM_PROMPT, buildCalendarPrompt } from "./prompts";
import { CalendarOutputSchema } from "@/lib/day19/validations/calendars";
import {
  validateRollingWindow,
  countViolations,
  countGenericTopics,
} from "@/lib/day19/calendar/validator";

export interface CalendarReport {
  calendarSummary: string;
  posts: PostItem[];
  constraintViolations: number;
  genericOutputWarning: boolean;
  genericCount: number;
  modelUsed: string;
  generationMs: number;
}

export async function generateCalendar(
  input: CalendarInput,
): Promise<CalendarReport> {
  const model = getModelJson(CALENDAR_SYSTEM_PROMPT, 65536);
  const userPrompt = buildCalendarPrompt(input);

  const start = Date.now();
  const result = await model.generateContent(userPrompt);
  const generationMs = Date.now() - start;

  const rawText = result.response.text();

  // Strip potential markdown fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Gemini returned invalid JSON. The response may have been truncated. Try reducing the number of platforms.",
    );
  }

  // Zod validate
  const zodResult = CalendarOutputSchema.safeParse(parsed);
  if (!zodResult.success) {
    const firstIssue = zodResult.error.issues[0];
    throw new Error(
      `Calendar validation failed: ${firstIssue?.message ?? "unknown"} at ${firstIssue?.path?.join(".")}`,
    );
  }
  const validated: CalendarOutput = zodResult.data;

  // Server-side rolling window validation
  const postsWithViolations = validateRollingWindow(
    validated.posts as PostItem[],
  );
  const constraintViolations = countViolations(postsWithViolations);

  // Generic output detection
  const genericCount = countGenericTopics(postsWithViolations);
  const genericOutputWarning = genericCount > 5;

  return {
    calendarSummary: validated.calendarSummary,
    posts: postsWithViolations,
    constraintViolations,
    genericOutputWarning,
    genericCount,
    modelUsed: getActiveModelId(),
    generationMs,
  };
}
