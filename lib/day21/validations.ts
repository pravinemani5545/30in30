import { z } from "zod";

export const classifyInputSchema = z.object({
  replyText: z
    .string()
    .min(10, "Reply text must be at least 10 characters")
    .max(5000, "Reply text must be under 5,000 characters"),
  sender: z.string().optional(),
});

export const classifyResultSchema = z.object({
  category: z.enum([
    "interested",
    "not_now",
    "question",
    "out_of_office",
    "unsubscribe",
  ]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});
