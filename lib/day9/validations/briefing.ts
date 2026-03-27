import { z } from "zod";

export const BriefingInputSchema = z.object({
  personName: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(100, { error: "Name must be at most 100 characters" })
    .trim(),
  companyName: z
    .string()
    .min(2, { error: "Company must be at least 2 characters" })
    .max(100, { error: "Company must be at most 100 characters" })
    .trim(),
  meetingContext: z
    .string()
    .min(10, { error: "Meeting context must be at least 10 characters" })
    .max(300, { error: "Meeting context must be at most 300 characters" })
    .trim(),
});

export const AutoBriefingInputSchema = BriefingInputSchema.extend({
  bookingId: z.string().optional(),
});
