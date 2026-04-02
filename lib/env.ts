import { z } from "zod";

const serverSchema = z.object({
  // Shared — required
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // AI keys — optional (validated per-day at call site)
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Day 2 — FounderCRM
  APOLLO_API_KEY: z.string().optional(),
  ENRICHMENT_PROVIDER: z.enum(["apollo", "mock"]).optional(),

  // Day 4 — HackerNewsDigest
  RESEND_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  CRON_USER_ID: z.string().optional(),

  // Day 6 — CompetitorRadar (local dev only)
  PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
});

let cached: z.infer<typeof serverSchema> | null = null;

export function getServerEnv() {
  if (cached) return cached;
  cached = serverSchema.parse(process.env);
  return cached;
}
