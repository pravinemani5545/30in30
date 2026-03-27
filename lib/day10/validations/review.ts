import { z } from "zod";

export const ReviewInputSchema = z.object({
  code: z
    .string()
    .min(10, { error: "Code must be at least 10 characters" })
    .max(15000, { error: "Code must be 15,000 characters or fewer" }),
  detectedLanguage: z.string().min(1, { error: "Language detection required" }),
});
