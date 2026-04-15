import { z } from "zod";

export const gitLogInputSchema = z.object({
  gitLog: z
    .string()
    .min(20, "Git log must be at least 20 characters")
    .max(20000, "Git log must be under 20,000 characters"),
});

export const changelogSectionSchema = z.object({
  emoji: z.string(),
  title: z.string(),
  items: z.array(z.string()).min(1),
});

export const tweetHookSchema = z.object({
  text: z.string(),
  angle: z.string(),
  charCount: z.number(),
});

export const changelogResultSchema = z.object({
  narrative: z.string(),
  sections: z.array(changelogSectionSchema).min(1),
  tweetHooks: z.array(tweetHookSchema).min(1).max(10),
  commitCount: z.number(),
  dateRange: z.string(),
});
