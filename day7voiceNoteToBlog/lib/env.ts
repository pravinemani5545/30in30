import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export function getServerEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const formatted = z.treeifyError(parsed.error)
    console.error('Invalid server environment variables:', formatted)
    throw new Error('Invalid server environment variables')
  }
  return parsed.data
}

export function getClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })
  if (!parsed.success) {
    throw new Error('Invalid client environment variables')
  }
  return parsed.data
}
