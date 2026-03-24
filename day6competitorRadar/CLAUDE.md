# CompetitorRadar — Claude Code Context

## What this app does
Enter a competitor URL. Puppeteer (@sparticuz/chromium) renders the page,
cheerio cleans the HTML, Claude Sonnet returns a structured teardown:
value proposition, target ICP, pricing model, GTM motion, and 3 exploitable
weaknesses — each with severity, confidence, and exploitation opportunity.
If Puppeteer fails, falls back to fetch + cheerio with an amber UI banner.

## Day 6 of a 30-day series
- competitor_analyses is the canonical prospect intelligence format
- Day 29 (FullPipelineDemo) reads this table for pre-outreach intel
- Five-key schema is the contract — keep it migration-safe

## Stack
- Next.js App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first @theme inline) + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr — NEVER auth-helpers)
- Claude API (claude-sonnet-4-6, Structured Outputs via zodOutputFormat)
- puppeteer-core + @sparticuz/chromium (NOT full puppeteer)
- cheerio (fallback + cleaning)
- pnpm

## MODEL: SONNET ONLY
claude-sonnet-4-6. Competitive analysis requires strategic interpretation.

## Puppeteer on Vercel — critical
- NEVER install `puppeteer` — only `puppeteer-core`
- Local: system Chrome via PUPPETEER_EXECUTABLE_PATH
- Production: await chromium.executablePath()
- export const maxDuration = 60 MUST be first export in route file
- browser.close() MUST be in finally block — always
- 8s page timeout, fallback immediately on failure

## SSRF prevention — before any Puppeteer launch
Block: 10.x, 192.168.x, 127.x, 169.254.x, non-standard ports
DNS pre-resolve before launch. Check response.url() after navigation.

## Key env vars
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (client safe)
SUPABASE_SERVICE_ROLE_KEY (server — url_cache writes only)
ANTHROPIC_API_KEY (server)
NEXT_PUBLIC_APP_URL
PUPPETEER_EXECUTABLE_PATH (local dev only)
