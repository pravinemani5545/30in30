import { z } from "zod";
import { ANSWER_KEYS } from "@/lib/day13/icp/questions";

// Build answer schema dynamically from question keys
const answerShape: Record<string, z.ZodString> = {};
for (const key of ANSWER_KEYS) {
  answerShape[key] = z
    .string()
    .min(20, `Answer for "${key}" must be at least 20 characters`)
    .max(2000, `Answer for "${key}" must be at most 2000 characters`)
    .trim();
}

export const ProfileInputSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(200).trim(),
  answers: z.object(answerShape),
});

export type ProfileInput = z.infer<typeof ProfileInputSchema>;

export const FirmographicProfileSchema = z.object({
  companySizeRange: z.string(),
  industryVertical: z.string(),
  growthStage: z.string(),
  revenueRange: z.string(),
  techStackSignals: z.array(z.string()),
  geography: z.string(),
  notes: z.string().nullable(),
});

export const PainPointHierarchySchema = z.object({
  surfacePain: z.string(),
  realPain: z.string(),
  urgentPain: z.string(),
  triggerEvent: z.string(),
});

export const ObjectionEntrySchema = z.object({
  statedObjection: z.string(),
  underlyingFear: z.string(),
  counterFrame: z.string(),
});

export const ChannelEntrySchema = z.object({
  channel: z.string(),
  reasoning: z.string(),
  tacticalSuggestion: z.string(),
  isInferred: z.boolean(),
});

export const SynthesisOutputSchema = z.object({
  firmographicProfile: FirmographicProfileSchema,
  painPointHierarchy: PainPointHierarchySchema,
  objectionMap: z.array(ObjectionEntrySchema).min(1).max(3),
  recommendedChannels: z.array(ChannelEntrySchema).min(1),
});
