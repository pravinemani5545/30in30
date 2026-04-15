import { z } from "zod";

export const nicheInputSchema = z.object({
  niche: z
    .string()
    .min(2, "Niche must be at least 2 characters")
    .max(100, "Niche must be under 100 characters"),
});

export const outlierVideoSchema = z.object({
  title: z.string(),
  views: z.number(),
  subscribers: z.number(),
  ratio: z.number(),
  uploadDate: z.string(),
  whyOutlier: z.string(),
});

export const patternSchema = z.object({
  name: z.string(),
  description: z.string(),
  examples: z.array(z.string()).min(1),
  frequency: z.number().min(1).max(10),
});

export const videoIdeaSchema = z.object({
  title: z.string(),
  hook: z.string(),
  angle: z.string(),
  format: z.string(),
  estimatedPerformance: z.enum(["high", "medium", "moderate"]),
  reasoning: z.string(),
});

export const videoIdeaAnalysisSchema = z.object({
  niche: z.string(),
  outlierVideos: z.array(outlierVideoSchema).min(1),
  patterns: z.array(patternSchema).min(1),
  ideas: z.array(videoIdeaSchema).min(1),
});
