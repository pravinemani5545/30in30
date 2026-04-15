import { z } from "zod";

// ─── Input validation ───────────────────────────────────────────

export const topicInputSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(200, "Topic must be under 200 characters"),
});

// ─── Gemini output schemas ──────────────────────────────────────

const TitleVariationSchema = z.object({
  title: z.string(),
  hook: z.string(),
  angle: z.string(),
  targetEmotion: z.string(),
});

export const IdeationSchema = z.object({
  topic: z.string(),
  variations: z.array(TitleVariationSchema).min(1).max(5),
  selectedIndex: z.number().min(0),
});

const ScriptSectionSchema = z.object({
  name: z.string(),
  content: z.string(),
  duration: z.string(),
  notes: z.string(),
});

export const ScriptSchema = z.object({
  title: z.string(),
  totalDuration: z.string(),
  wordCount: z.number(),
  sections: z.array(ScriptSectionSchema).min(1),
});

const BRollItemSchema = z.object({
  timestamp: z.string(),
  description: z.string(),
  searchTerms: z.array(z.string()),
  mood: z.string(),
});

export const BRollBriefSchema = z.object({
  items: z.array(BRollItemSchema).min(1),
  totalClips: z.number(),
});

const ThumbnailConceptSchema = z.object({
  layout: z.string(),
  textOverlay: z.string(),
  emotionTrigger: z.string(),
  colorScheme: z.string(),
  description: z.string(),
});

export const ThumbnailPackSchema = z.object({
  concepts: z.array(ThumbnailConceptSchema).min(1).max(5),
});
