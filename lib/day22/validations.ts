import { z } from "zod";

export const analyzeScriptInputSchema = z.object({
  script: z
    .string()
    .min(50, "Script must be at least 50 characters")
    .max(10000, "Script must be under 10,000 characters"),
});

export const bRollConceptSchema = z.object({
  timestamp: z.string(),
  scriptExcerpt: z.string(),
  visualConcept: z.string(),
  searchTerms: z.array(z.string()).min(1).max(7),
  mood: z.string(),
  duration: z.number().min(1),
});

export const bRollAnalysisSchema = z.object({
  totalDuration: z.string(),
  wordCount: z.number().min(1),
  concepts: z.array(bRollConceptSchema).min(1),
});
