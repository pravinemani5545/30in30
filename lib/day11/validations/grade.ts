import { z } from "zod";

export const EmailGradeInputSchema = z.object({
  email: z
    .string()
    .min(20, { error: "That's too short to be a cold email." })
    .max(5000, { error: "Cold emails should be under 300 words. This is too long to grade." })
    .trim(),
});

const DimensionSchema = z.object({
  score: z.number().int().min(0).max(25),
  finding: z.string().min(1),
});

const SpamDimensionSchema = DimensionSchema.extend({
  wordsFound: z.array(z.string()),
});

const ReadingDimensionSchema = DimensionSchema.extend({
  wordCount: z.number().int().min(0),
});

export const GradeOutputSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  gatePassed: z.boolean(),
  dimensions: z.object({
    personalization: DimensionSchema,
    spam: SpamDimensionSchema,
    cta: DimensionSchema,
    reading: ReadingDimensionSchema,
  }),
  overallFinding: z.string(),
  rewriteNeeded: z.boolean(),
});

export const RewriteOutputSchema = z.object({
  rewrittenEmail: z.string(),
  projectedScore: z.number().int().min(0).max(100),
  explanation: z.string(),
});
