# PitchDoctor — Claude Code Context

## What this app does
Paste a startup one-liner. Get a score out of 100, a brutally honest critique
across 5 dimensions, and 3 fully rewritten improved versions with reasoning.
Powered by Claude Haiku with Structured Outputs. Anonymous use works instantly.
Sign in to save results and track improvement over time.

## Day 5 of 30
Seeds the "AI as honest advisor" pattern — the same structured critique schema
will power the outreach quality scorer in the AI SDR Platform (Day 11+).

## Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first @theme)
- shadcn/ui + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr)
- Claude API (claude-haiku-4-5-20251001) — pitch critique + rewriting
- pnpm

## Skills
Skills auto-load from .claude/skills/
- /frontend-design — design system (source of truth for all UI)
- /product-self-knowledge — series context
- /pitch-scoring — scoring rubric reference (5 dimensions, calibration notes)

## Dev commands
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # ESLint
pnpm type-check   # tsc --noEmit

## Key env vars
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server only)
ANTHROPIC_API_KEY (server only)
NEXT_PUBLIC_APP_URL

## Architecture patterns
- Server Components by default, Client Components only for interactivity
- Auth: createServerClient + getUser()
- proxy.ts: protects /history only — / and /api/analyze are public
- Anonymous analysis: works without auth, not persisted to DB
- Authenticated analysis: auto-saved to pitch_analyses via service role
- Rate limit: 5/hour anonymous (IP hash), 20/hour authenticated (user_id)
- Lazy-initialize Anthropic client — never at module scope
- Structured Outputs (messages.parse + zodOutputFormat) for ALL Claude calls
- Prompt Caching (cache_control) on the scoring system prompt
- IP addresses hashed before storage — never store raw IPs

## Mistakes to avoid
- NEVER parse Claude text output manually — Structured Outputs only
- NEVER pass system prompt as plain string when caching — content block array
- @supabase/auth-helpers is deprecated — use @supabase/ssr
- Module-level Anthropic init causes build errors — use lazy function
- Secret keys never in NEXT_PUBLIC_ vars
- Never log pitch content — only pitch length, user ID (if authed), score
- proxy.ts replaces middleware.ts in Next.js 16 (Node.js runtime, NOT Edge)
- await headers(), cookies(), params in Next.js 16
- Zod 4: .issues not .errors (alias removed)
- Zod 4: { error: "..." } not { message: "..." } in validators
- Rate limit must be checked BEFORE calling Claude — not after
- Anonymous analyses must NOT be persisted — no user_id to scope them to
