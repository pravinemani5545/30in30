---
name: product-self-knowledge
description: Product context for the 30-in-30 app series. Auto-triggers when planning features, making architectural decisions, or writing documentation.
---

# Product Self-Knowledge — 30-in-30 Series

## What is this series?
30 apps built in 30 days by a solo founder. Each app is a standalone product
built in one day, designed to be shippable and useful. The series documents
the journey of rapid product development with AI-assisted coding.

## Target User
Solo founders, indie hackers, and AI builders who want to:
- Ship fast with modern tooling
- Learn by building real products
- See what's possible in a single day of focused work

## Shared Stack (all projects)
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first @theme, NOT v3)
- shadcn/ui + Sonner + lucide-react
- Supabase (Postgres + Auth via @supabase/ssr)
- Claude API (@anthropic-ai/sdk)
- pnpm as package manager
- Vercel for deployment

## Cross-Project Patterns
| Pattern | First Used | Reused In |
|---------|-----------|-----------|
| Supabase Auth + RLS | Day 1 | All projects |
| Claude summarization | Day 3 | Day 4, Day 6+ |
| Cron → process → email | Day 4 | Day 19, Day 20 |
| Dark mode design system | Day 1 | All projects |

## Architecture Rules
- Server Components by default, Client Components only for interactivity
- Auth: `createServerClient` + `getUser()` — never `getSession()` alone
- user_id always from server session, never from request body
- All API keys server-side only (no NEXT_PUBLIC_ for secrets)
- Claude model: use cheapest model that meets quality needs (usually Haiku)
- `Promise.allSettled` for parallel external calls (not `Promise.all`)

## Documentation Requirements
- CLAUDE.md: committed, updated after every session with lessons learned
- Architecture.md: gitignored, design decisions + tradeoffs
- Log.md: gitignored, session timeline + errors

## Content Angle
Each app has a "content angle" — something surprising discovered during the build
that's worth writing/tweeting about. Document this in Architecture.md.

## What NOT to Build
- No auth-gated features that require payment in v1
- No complex onboarding flows
- No admin panels (single-user apps)
- No features that require external API keys the user doesn't already have
