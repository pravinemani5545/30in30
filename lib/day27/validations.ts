import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be under 50 characters"),
  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be under 50 characters"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company must be under 100 characters"),
});

export const preferencesSchema = z.object({
  theme: z.enum(["dark", "light", "system"]),
  notifications: z.boolean(),
  weeklyDigest: z.boolean(),
});

export const goalsSchema = z.object({
  primaryGoal: z
    .string()
    .min(5, "Goal must be at least 5 characters")
    .max(200, "Goal must be under 200 characters"),
  timeline: z.enum(["1_month", "3_months", "6_months", "1_year"]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
});

export const onboardingDataSchema = z.object({
  profile: profileSchema,
  preferences: preferencesSchema,
  goals: goalsSchema,
});

export const progressBodySchema = z.object({
  currentStep: z.number().int().min(1).max(4),
  data: z.object({
    profile: profileSchema.partial().optional(),
    preferences: preferencesSchema.partial().optional(),
    goals: goalsSchema.partial().optional(),
  }),
});
