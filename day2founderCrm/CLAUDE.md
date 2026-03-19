# FounderCRM — Claude Code Context

## What this app does
Minimalist CRM for solo founders. Paste a LinkedIn URL → Apollo.io enriches from
its database (no LinkedIn scraping) → Claude analyzes and generates personalized
follow-up drafts → Contact saved to pipeline.

## Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first, @theme config)
- shadcn/ui + Framer Motion + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr)
- Claude API (claude-sonnet-4-5, Structured Outputs via zodOutputFormat)
- Apollo.io People Enrichment API (free tier, ~10 enrichments/month)
- pnpm

## MANDATORY: Use these MCP tools before writing any code
1. Context7 for Next.js App Router patterns
2. Context7 for @supabase/ssr (never use auth-helpers — it is deprecated)
3. Context7 for @anthropic-ai/sdk Structured Outputs
4. Context7 for Tailwind v4 (v4 syntax is different from v3)

## Dev commands
```
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # ESLint
pnpm type-check   # tsc --noEmit
```

## Setup
1. Copy `.env.local.example` to `.env.local` and fill in values
2. Create Supabase project, run `supabase/migrations/001_initial.sql`
3. Set `ENRICHMENT_PROVIDER=mock` in `.env.local` for dev without Apollo credits
4. `pnpm dev` → visit http://localhost:3000

## Key env vars
```
NEXT_PUBLIC_SUPABASE_URL        # safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY   # safe for client
SUPABASE_SERVICE_ROLE_KEY       # SERVER ONLY
ANTHROPIC_API_KEY               # SERVER ONLY
APOLLO_API_KEY                  # SERVER ONLY — free key at apollo.io/settings/integrations/api
ENRICHMENT_PROVIDER             # "apollo" | "mock" — set "mock" for dev
```

## Apollo.io free tier facts
- 10 export credits/month (each People Enrichment call = 1 credit)
- Does NOT scrape LinkedIn — matches against Apollo's own 275M contact database
- LinkedIn URL is a lookup key, not a scraping target
- Free tier API key: create at https://app.apollo.io/settings/integrations/api
- Master API key required for People Enrichment endpoint
- When credits exhausted: app falls back to manual paste textarea

## Architecture patterns
- Server Components by default. Client Components only for interactivity.
- Auth: always createServerClient + getUser() — never getSession() alone
- user_id always from server session, never from request body
- All Claude calls in Route Handlers, never in Client Components
- APOLLO_API_KEY and ANTHROPIC_API_KEY: never in NEXT_PUBLIC_ vars
- Zod validation at every API boundary
- RLS handles data isolation

## Claude Structured Outputs (current API)
```typescript
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
const message = await client.messages.parse({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [...],
  output_config: { format: zodOutputFormat(MyZodSchema) },
});
const result = message.parsed_output; // typed
```
Do NOT use: output_format (deprecated beta)

## Supabase SSR (current API)
```typescript
import { createServerClient } from "@supabase/ssr";
// In Route Handlers and Server Components:
const supabase = createServerClient(url, key, {
  cookies: { getAll: () => cookieStore.getAll(), setAll: (...) => ... }
});
const { data: { user } } = await supabase.auth.getUser(); // always getUser()
```
Do NOT use: @supabase/auth-helpers (deprecated)

## Folder guide
```
lib/enrichment/     — Apollo client, mock provider, normalization, credit tracking
lib/claude/         — Claude API integration, prompts
lib/supabase/       — Server + browser client factories
lib/validations/    — Zod schemas
components/         — UI components (shadcn/ui base + custom)
hooks/              — Client-side data + mutation hooks
app/api/            — Route Handlers (all server-side logic)
app/dashboard/      — Main app pages
app/(auth)/         — Login flow
supabase/migrations/ — Database schema + RLS
```

## Design system (never deviate)
- Background: #0A0A0A | Surface: #111111 | Accent: #E8A020 (amber)
- Text primary: #F5F0E8 | Text secondary: #8A8580
- Fonts: Instrument Serif (headings) + DM Sans (body)
- No gradients. No drop shadows. 1px borders only.
- Framer Motion: enrichment card stagger ONLY (not decorative animations)

## Common mistakes to avoid
- Do NOT use @supabase/auth-helpers — use @supabase/ssr
- Do NOT use output_format beta — use output_config.format with zodOutputFormat
- Do NOT use Tailwind v3 syntax in a v4 project
- Do NOT access process.env directly — import from lib/env.ts
- Do NOT put APOLLO_API_KEY or ANTHROPIC_API_KEY in NEXT_PUBLIC_ vars
- Do NOT call Apollo API or Claude API from Client Components
- Do NOT scrape linkedin.com — Apollo does database lookup, not scraping

## Enrichment flow
1. Validate LinkedIn URL with Zod regex
2. Check credits remaining (enrichment_usage table)
3. If credits > 0 and provider=apollo: call Apollo People Enrichment API
4. Normalize Apollo response → RawProfileData
5. Call Claude with zodOutputFormat → EnrichmentResult
6. Upsert contact + follow_up_suggestions in Supabase
7. Return ContactWithSuggestions to client
Fallback: if credits=0 or Apollo returns null → show manual paste textarea inline
