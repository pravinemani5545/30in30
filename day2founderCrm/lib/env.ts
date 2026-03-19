import { z } from "zod";

const envSchema = z.object({
  // Supabase — public
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Supabase — server only
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Anthropic — server only
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-").optional(),

  // Apollo.io — server only
  APOLLO_API_KEY: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Enrichment provider
  ENRICHMENT_PROVIDER: z.enum(["apollo", "mock"]).default("apollo"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of parsed.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    throw new Error("Invalid environment variables. Check .env.local");
  }

  const env = parsed.data;

  // Production guards
  if (env.NODE_ENV === "production") {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is required in production");
    }
    if (env.ENRICHMENT_PROVIDER === "apollo" && !env.APOLLO_API_KEY) {
      throw new Error(
        "APOLLO_API_KEY is required when ENRICHMENT_PROVIDER=apollo in production"
      );
    }
  }

  // Dev warning
  if (
    env.NODE_ENV !== "production" &&
    env.ENRICHMENT_PROVIDER === "apollo" &&
    !env.APOLLO_API_KEY
  ) {
    console.warn(
      "⚠️  APOLLO_API_KEY not set. Falling back to mock enrichment provider."
    );
  }

  return env;
}

// Validate once at module load (server-side only)
let _env: ReturnType<typeof validateEnv>;

export function getEnv() {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}

export type Env = ReturnType<typeof validateEnv>;

// Re-export commonly used vars
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";
