import { z } from "zod";

export const analyzeRequestSchema = z.object({
  transcript: z
    .string()
    .min(10, "Transcript too short — please speak at least a sentence or two.")
    .max(5000, "Transcript too long — maximum 5000 characters."),
  duration_seconds: z.number().optional(),
});

export const moodSchema = z.enum([
  "happy",
  "sad",
  "anxious",
  "reflective",
  "energized",
  "neutral",
  "frustrated",
  "grateful",
]);

export const journalEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  significance: z.enum(["high", "medium", "low"]),
});

export const journalReflectionSchema = z.object({
  insight: z.string(),
  theme: z.string(),
});

export const analyzedEntrySchema = z.object({
  mood: moodSchema,
  mood_intensity: z.number().int().min(1).max(10),
  mood_summary: z.string(),
  events: z.array(journalEventSchema),
  reflections: z.array(journalReflectionSchema),
  gratitude: z.array(z.string()),
  tomorrow_intention: z.string(),
  entry_title: z.string(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalyzedEntry = z.infer<typeof analyzedEntrySchema>;
