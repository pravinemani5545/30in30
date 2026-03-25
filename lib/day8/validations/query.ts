import { z } from "zod";

export const querySchema = z.object({
  question: z
    .string()
    .min(5, { error: "Question must be at least 5 characters" })
    .max(1000, { error: "Question must be under 1000 characters" }),
  documentId: z.string().uuid({ error: "Invalid document ID" }),
});
