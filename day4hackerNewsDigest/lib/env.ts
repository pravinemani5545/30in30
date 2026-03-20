import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
  RESEND_API_KEY: z.string().startsWith("re_"),
  CRON_SECRET: z.string().min(32),
  CRON_USER_ID: z.string().uuid(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.issues);
    throw new Error("Invalid environment variables");
  }
  _env = parsed.data;
  return _env;
}
