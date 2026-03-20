# HackerNewsDigest — Claude Code Context

## What this app does
Vercel cron fires at ~07:00 UTC daily. Fetches top 10 HN stories via public
Firebase API. Claude Haiku summarises each in 2 sentences and scores relevance
for AI/tech builders (1-10). Resend delivers the scored digest to subscriber list.
Dashboard manages subscribers, shows last digest preview, and digest history.

## This is Day 4 of a 30-app series
- Day 3 (TweetCraft) established the series design system
- This app establishes the cron -> process -> email pattern
- Day 19 (CompanyTracker) and Day 20 (ContentCalendar) reuse this cron pattern

## Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first, @theme)
- shadcn/ui + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr)
- Claude API (claude-haiku-4-5-20251001 — Haiku only)
- Resend + React Email
- Vercel Cron (Hobby plan — once per day minimum)
- pnpm

## MODEL: HAIKU ONLY
claude-haiku-4-5-20251001. This is summarisation — not complex generation.

## Dev commands
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # ESLint

## Key env vars (all required)
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (SERVER ONLY)
ANTHROPIC_API_KEY (SERVER ONLY)
RESEND_API_KEY (SERVER ONLY)
CRON_SECRET (SERVER ONLY)
CRON_USER_ID (SERVER ONLY)
NEXT_PUBLIC_APP_URL

## Architecture patterns
- Server Components by default, Client Components only for interactivity
- Auth: createServerClient + getUser() — never getSession() alone
- user_id always from server session, never from request body
- Service role client used in cron handler for digest run writes
- Cron + unsubscribe endpoints excluded from session auth in proxy.ts
- All API clients lazy-initialized (getAnthropic(), getResend()) — never module-level

## Skills
- Skills auto-load from `.claude/skills/` — no manual file reads needed
- `/frontend-design` — design system, colors, typography
- `/product-self-knowledge` — series context, shared patterns
- `/check-rls` — verify Supabase RLS policies
- `/test-digest` — end-to-end digest test procedure
- NEVER reference `/mnt/skills/` — that path does not exist

## Common mistakes
- Do NOT use @supabase/auth-helpers — use @supabase/ssr
- Do NOT use Promise.all — use Promise.allSettled
- Do NOT log subscriber email addresses
- Do NOT initialize API clients at module scope — use lazy functions
- headers(), cookies(), params return Promises in Next.js 16 — must await
- proxy.ts replaces middleware.ts (Node.js runtime, NOT Edge)
- Zod 4: use .issues not .errors, { error: "..." } not { message: "..." }
- Zod 4: .flatten() deprecated — use z.treeifyError() or .issues directly
