# 30 Apps in 30 Days

Building one AI-powered app every day for 30 days — all in a single Next.js app, single database, single deployment.

**Live at [daily-series.vercel.app](https://daily-series.vercel.app)**

## Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Single Supabase project (Postgres + pgvector + Realtime + Storage)
- **Auth:** Supabase Auth (Magic Link + Google OAuth) — login once, access all days
- **AI:** Claude API, Gemini, OpenAI (Whisper + Embeddings)
- **Styling:** Tailwind CSS v4, shadcn/ui, per-day accent colors
- **Deployment:** Vercel (single project)

```
dailySeries/
├── app/
│   ├── page.tsx                 # Landing page — 30-day grid
│   ├── login/page.tsx           # Unified login (magic link + Google)
│   ├── auth/callback/route.ts   # Single OAuth callback
│   ├── (days)/dayN/             # Each day's pages
│   └── api/dayN/                # Each day's API routes
├── components/
│   ├── ui/                      # Shared shadcn components
│   ├── shared/                  # Cross-day components (BackToHub, SignOut)
│   └── dayN/                    # Day-specific components
├── lib/
│   ├── supabase/                # Shared Supabase clients
│   ├── env.ts                   # Unified env schema
│   ├── days-config.ts           # All 30 days metadata
│   └── dayN/                    # Day-specific logic
├── hooks/dayN/                  # Day-specific React hooks
├── types/dayN.ts                # Day-specific TypeScript types
├── supabase/migrations/         # All migrations (one per day)
├── proxy.ts                     # Unified auth (gates entire site)
└── vercel.json                  # Cron jobs config
```

## Days

| Day | App | What it does | Stack |
|-----|-----|-------------|-------|
| 1 | **ClaudeJournal** | Voice-to-structured journal with AI analysis | Gemini, Web Speech API |
| 2 | **FounderCRM** | AI-powered CRM for solo founders | Claude, Apollo.io |
| 3 | **TweetCraft** | Blog article to tweet thread generator | Claude, Cheerio |
| 4 | **HackerNewsDigest** | Daily HN digest with AI summaries, delivered via email | Claude Haiku, Resend, Vercel Cron |
| 5 | **PitchDoctor** | AI pitch critique — structured scoring and rewriting | Claude, Structured Outputs |
| 6 | **CompetitorRadar** | Competitor intelligence from any URL | Claude Sonnet, Puppeteer |
| 7 | **VoiceNoteToBlog** | Voice memo to structured blog post | Whisper, Vercel AI SDK v6 |
| 8 | **PDFQueryEngine** | Ask questions about any PDF (RAG pipeline) | pgvector, OpenAI Embeddings, Claude |
| 9–30 | *Coming soon* | | |

## Database

All days share one Supabase Postgres database. Tables are namespaced by convention — no collisions.

| Day | Tables |
|-----|--------|
| 1 | `journal_entries` |
| 2 | `contacts`, `follow_up_suggestions`, `enrichment_jobs`, `enrichment_usage` |
| 3 | `article_cache`, `generations`, `tweet_variations` |
| 4 | `subscribers`, `digest_runs` |
| 5 | `pitch_analyses`, `rate_limit_anonymous`, `rate_limit_users` |
| 6 | `url_cache`, `competitor_analyses` |
| 7 | `voice_posts` |
| 8 | `documents`, `document_chunks` (pgvector), `queries` |

pgvector is enabled in the `extensions` schema for Day 8's RAG pipeline (1536-dim embeddings, HNSW index, cosine similarity).

## Getting Started

```bash
# Install
pnpm install

# Set up env vars (copy and fill in)
cp .env.local.example .env.local

# Run locally
pnpm dev
```

### Required Environment Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | All (server) | Supabase service role key |
| `GEMINI_API_KEY` | Day 1 | Google Gemini API |
| `OPENAI_API_KEY` | Day 7, 8 | Whisper transcription + embeddings |
| `APOLLO_API_KEY` | Day 2 | Apollo.io contact enrichment |
| `RESEND_API_KEY` | Day 4 | Email delivery |
| `CRON_SECRET` | Day 4 | Vercel cron auth |
| `CRON_USER_ID` | Day 4 | User ID for cron digest |

## Adding a New Day

1. Add entry to `lib/days-config.ts`
2. Create pages at `app/(days)/dayN/`
3. Create API routes at `app/api/dayN/`
4. Create `components/dayN/`, `lib/dayN/`, `hooks/dayN/`
5. Add migration at `supabase/migrations/`
6. Add env vars (if any) as optional in `lib/env.ts`

No existing day's code is touched.

---

Built with Next.js, Claude API, Supabase, and Vercel.
