import { z } from "zod";

export const SequenceInputSchema = z.object({
  persona: z
    .string()
    .min(10, { message: "Describe the persona more specifically." })
    .max(300, {
      message: "Keep the persona description under 300 characters.",
    })
    .trim(),
  valueProp: z
    .string()
    .min(20, { message: "Describe what you do and for whom." })
    .max(500)
    .trim(),
  socialProof: z
    .string()
    .min(20, {
      message: "Include a specific result, company, and timeframe.",
    })
    .max(300)
    .trim(),
  observation: z.string().max(300).trim().optional(),
});

export type SequenceInputType = z.infer<typeof SequenceInputSchema>;

export const SingleEmailSchema = z.object({
  emailNumber: z.number().int().min(1).max(5),
  emailType: z.enum([
    "pattern_interrupt",
    "social_proof_reframe",
    "pivot",
    "gracious_breakup",
    "long_tail_reengagement",
  ]),
  sendDay: z.number().int(),
  sendTiming: z.string(),
  subjectA: z.string().min(1).max(80),
  subjectB: z.string().min(1).max(80),
  body: z.string().min(50).max(2000),
  personalizationSlots: z.array(z.string()),
  wordCount: z.number().int().min(1),
  hasFollowupLanguage: z.boolean(),
});

export const SequenceOutputSchema = z.object({
  sequenceSummary: z.string(),
  pivotAngle: z.string(),
  emails: z.array(SingleEmailSchema).length(5),
});

export type SequenceOutputType = z.infer<typeof SequenceOutputSchema>;
