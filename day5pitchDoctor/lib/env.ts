import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({ error: "Invalid Supabase URL" }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { error: "Supabase anon key is required" }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, { error: "Supabase service role key is required" }),
  GEMINI_API_KEY: z
    .string()
    .min(1, { error: "Gemini API key is required" }),
  NEXT_PUBLIC_APP_URL: z.string().url({ error: "Invalid app URL" }),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${issues}`);
  }
  return parsed.data;
}

/** Server-only env — call in route handlers and server components */
export function getEnv(): Env {
  return validateEnv();
}

/** Client-safe env subset */
export function getPublicEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  };
}
