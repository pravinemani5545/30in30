import { z } from "zod";

export const PlatformFrequencySchema = z.object({
  platform: z.enum(["youtube", "x", "newsletter", "linkedin"]),
  frequency: z.enum(["daily", "3x_week", "weekly", "2x_month"]),
});

export const CalendarInputSchema = z.object({
  pillars: z.array(z.string().min(2).max(50)).min(3).max(5),
  platforms: z.array(PlatformFrequencySchema).min(1).max(4),
  audiencePersona: z.string().min(20).max(500).trim(),
  uniquePerspective: z
    .string()
    .min(20, {
      error:
        "Your unique angle needs to be more specific. What specifically makes your perspective different?",
    })
    .max(300)
    .trim(),
  styleExample: z.string().max(1000).trim().optional(),
  monthLabel: z.string().min(3).max(20),
  includeWeekends: z.boolean().optional(),
});

export type CalendarInputType = z.infer<typeof CalendarInputSchema>;

const DerivedPostSchema = z.object({
  dayNumber: z.number().int().min(1).max(30),
  platform: z.enum(["youtube", "x", "newsletter", "linkedin"]),
  derivationType: z.string(),
});

const RepurposingMapSchema = z.object({
  parentDayNumber: z.number().int().min(1).max(30).nullable(),
  derivedPosts: z.array(DerivedPostSchema),
});

export const PostItemSchema = z.object({
  dayNumber: z.number().int().min(1).max(30),
  dayOfWeek: z.string(),
  platform: z.enum(["youtube", "x", "newsletter", "linkedin"]),
  format: z.enum(["video", "thread", "essay", "short", "newsletter"]),
  effortLevel: z.enum(["high", "medium", "low"]),
  topic: z.string().min(1),
  postingTime: z.string(),
  rationale: z.string(),
  windowViolation: z.boolean().optional().default(false),
  repurposingMap: RepurposingMapSchema.nullable().optional().default(null),
});

export const CalendarOutputSchema = z.object({
  calendarSummary: z.string(),
  highEffortDays: z.array(z.number().int()),
  posts: z.array(PostItemSchema).min(10).max(80),
});
