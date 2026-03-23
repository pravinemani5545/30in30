import { z } from "zod";

export const DimensionScoresSchema = z.object({
  clarity: z.number().min(0).max(20),
  specificity: z.number().min(0).max(20),
  differentiation: z.number().min(0).max(20),
  audience_fit: z.number().min(0).max(20),
  memorability: z.number().min(0).max(20),
});

export const ImprovementSchema = z.object({
  rewrite: z.string(),
  reasoning: z.string(),
  what_changed: z.string(),
});

export const PitchAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  dimension_scores: DimensionScoresSchema,
  critique: z.string(),
  improvements: z.array(ImprovementSchema).length(3),
});

export type DimensionScores = z.infer<typeof DimensionScoresSchema>;
export type Improvement = z.infer<typeof ImprovementSchema>;
export type PitchAnalysis = z.infer<typeof PitchAnalysisSchema>;

export const AnalyzeInputSchema = z.object({
  pitch: z
    .string()
    .min(10, { error: "Pitch must be at least 10 characters" })
    .max(500, { error: "Pitch must be 500 characters or fewer" }),
  context: z.string().max(300).optional(),
});

export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

export interface AnalyzeResponse {
  analysis: PitchAnalysis;
  saved: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}
