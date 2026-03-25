import { z } from 'zod'

export const generatePostSchema = z.object({
  transcript: z.string().min(50, { error: 'Transcript must be at least 50 characters' }).max(20000, { error: 'Transcript exceeds maximum length' }),
  postId: z.string().uuid(),
  durationSeconds: z.number().positive().optional(),
})

export const savePostSchema = z.object({
  postId: z.string().uuid(),
  sections: z.object({
    headline: z.string().nullable(),
    intro: z.string().nullable(),
    section1: z.string().nullable(),
    section2: z.string().nullable(),
    section3: z.string().nullable(),
    conclusion: z.string().nullable(),
    pullquote1: z.string().nullable(),
    pullquote2: z.string().nullable(),
    pullquote3: z.string().nullable(),
  }),
  fullText: z.string(),
  wordCount: z.number().int().nonnegative(),
  generationMs: z.number().int().nonnegative().optional(),
})
