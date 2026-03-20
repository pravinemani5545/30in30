@AGENTS.md

# TweetCraft — Claude Code Context

## What this app does
Paste a blog post URL → TweetCraft fetches + parses the article server-side
→ Claude generates 5 tweet variations with hook analysis and engagement scoring
→ User copies the best tweet or drafts it directly in Gmail.

## This is Day 3 of a 30-app series
- Day 2 (FounderCRM) contacts table is the canonical lead record format
- This app's generations table feeds the YouTube SaaS distribution module (Day N+)
- tweet_variations JSONB is stored in canonical format for downstream replay
- Gmail MCP integration is the first node of the content distribution pipeline

## Stack
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first, @theme — NOT v3 syntax)
- shadcn/ui + Framer Motion + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr — NEVER auth-helpers)
- Claude API (claude-sonnet-4-5, Structured Outputs via output_config.format)
- cheerio (server-side HTML parsing)
- Gmail MCP (client-side draft creation)
- pnpm

## CRITICAL: Next.js 16 breaking changes
- `middleware.ts` is renamed to `proxy.ts`, exported function must be named `proxy`
- `params` in route handlers/pages are Promises: `const { id } = await params`
- Read node_modules/next/dist/docs/ before writing any Next.js code

## MANDATORY before writing any code
1. Read: view /mnt/skills/public/frontend-design/SKILL.md
2. Read: view /mnt/skills/public/product-self-knowledge/SKILL.md
3. Context7: Next.js 16, @supabase/ssr, @anthropic-ai/sdk, Tailwind v4, cheerio

## Dev commands
pnpm dev          # start dev server
pnpm build        # production build (must succeed before deploy)
pnpm tsc --noEmit # type check

## Key env vars
NEXT_PUBLIC_SUPABASE_URL       # safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY  # safe for client
SUPABASE_SERVICE_ROLE_KEY      # SERVER ONLY — article_cache writes
ANTHROPIC_API_KEY              # SERVER ONLY
NEXT_PUBLIC_APP_URL            # app domain

## Supabase: 3 tables
- article_cache: shared across users, 24h TTL, service role for writes
- generations: user-scoped, full Claude output in tweet_variations JSONB
- tweet_variations: individual rows per tweet, queryable

## Claude structured outputs pattern (confirmed working)
```ts
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
client.messages.parse({
  model: "claude-sonnet-4-5",
  output_config: { format: zodOutputFormat(Schema) }, // NOTE: 1 arg, no name
  ...
})
```

## Zod 4 notes
- ZodError uses `.issues` NOT `.errors`
- `z.string().url()`, `.safeParse()`, `z.infer<typeof Schema>` identical

## Architecture patterns
- Server Components by default. Client Components only for interactivity.
- Auth: createServerClient + getUser() — never getSession() alone
- user_id always from server session, never request body
- Claude calls in Route Handlers only — never Client Components
- ANTHROPIC_API_KEY never in NEXT_PUBLIC_ vars
- Service role client: article_cache writes ONLY

## Design system
Background: #0C0C0C | Surface: #141414 | Accent: #E8A020 (amber)
Text primary: #F2EDE4 | Text secondary: #8A8580
Fonts: Instrument Serif (display) + DM Sans (body)
No gradients. No drop shadows. 1px borders only.
Framer Motion: tweet card stagger ONLY.

## Common mistakes to avoid
- Do NOT use auth-helpers — use @supabase/ssr
- Do NOT use `middleware.ts` — use `proxy.ts` in Next.js 16
- Do NOT pass name as second arg to zodOutputFormat (1 arg only in SDK 0.80+)
- Do NOT use `.errors` on ZodError in Zod 4 — use `.issues`
- Do NOT call Claude API from Client Components
- Do NOT trust Claude's characterCount — always re-count server-side

## MANDATORY after every code change
After completing any feature, fix, or refactor — update BOTH docs files:
1. `docs/SESSION_NOTES.md` — add a new sub-section under the current session heading describing what changed, why, and any bugs hit
2. `docs/ARCHITECTURE.md` — update any section whose content is now stale (timeouts, flags, error handling, data flow, limitations table, etc.)

Do this before committing. These files are gitignored (local only) but must stay accurate as the authoritative record of the app's design.
