import { z } from "zod";

export const EnrichRequestSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?$/, {
      message: "Must be a LinkedIn profile URL (linkedin.com/in/username)",
    })
    .transform((url) => url.split("?")[0].replace(/\/$/, "")),
  manualPasteText: z.string().min(50).max(25000).optional(),
});

export type EnrichRequest = z.infer<typeof EnrichRequestSchema>;

export function extractLinkedInUsername(url: string): string {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/);
  return match?.[1] ?? url;
}
