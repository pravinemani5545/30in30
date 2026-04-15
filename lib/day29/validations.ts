import { z } from "zod";

export const companyInputSchema = z.object({
  companyInput: z
    .string()
    .min(2, "Company name or URL must be at least 2 characters")
    .max(500, "Company name or URL must be under 500 characters"),
});

export const companyEnrichmentSchema = z.object({
  name: z.string(),
  industry: z.string(),
  size: z.string(),
  description: z.string(),
  keyProducts: z.array(z.string()),
  painPoints: z.array(z.string()),
  recentNews: z.array(z.string()),
});

export const outreachDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
  personalization: z.array(z.string()),
  callToAction: z.string(),
});

export const emailSequenceSchema = z.object({
  emails: z.array(
    z.object({
      day: z.number(),
      subject: z.string(),
      body: z.string(),
      intent: z.string(),
    }),
  ),
  strategy: z.string(),
});

export const campaignPreviewSchema = z.object({
  campaignName: z.string(),
  targetPersona: z.string(),
  totalEmails: z.number(),
  estimatedDuration: z.string(),
  keyMetrics: z.array(z.string()),
  summary: z.string(),
});
