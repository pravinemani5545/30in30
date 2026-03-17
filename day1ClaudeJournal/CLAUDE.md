# ClaudeJournal — CLAUDE.md

## What this project is
ClaudeJournal is a voice-to-structured journal web app. The user speaks; the Web Speech API
transcribes in real time; Claude API (claude-sonnet-4-5 with Structured Outputs) organizes
the transcript into mood, events, and reflections; Supabase stores the result.

This is App #1 of a 30-apps-in-30-days build series.

## Stack
- Next.js 15 App Router (TypeScript strict mode)
- Tailwind CSS v4 + shadcn/ui (zinc base, dark mode default)
- @anthropic-ai/sdk (server-side only, claude-sonnet-4-5)
- @supabase/supabase-js + @supabase/ssr (Postgres + Auth + RLS)
- Framer Motion (recording animation)
- Zod (validation everywhere)
- pnpm (package manager — always use pnpm, not npm or yarn)
- Vercel (deployment)

## Key architecture decisions
- Claude API calls are ONLY in /src/app/api/journal/analyze/route.ts (server-side)
- ANTHROPIC_API_KEY is never in any client-side code or NEXT_PUBLIC_ variable
- Auth is Supabase Magic Link + Google OAuth via @supabase/ssr
- RLS is the primary data isolation mechanism — never trust user_id from client
- Web Speech API runs entirely in the browser — transcript text is what hits the server

## Project structure
- /src/app/(auth)/ — login and auth callback routes (public)
- /src/app/(journal)/ — protected journal routes (requires auth)
- /src/app/api/ — Route Handlers (server-side API)
- /src/components/journal/ — journal-specific components
- /src/components/ui/ — shadcn/ui components (do not edit these manually)
- /src/hooks/ — client-side hooks (useSpeechRecognition, useJournalEntry)
- /src/lib/ — shared utilities (anthropic client, supabase clients, zod schemas)
- /src/types/ — TypeScript type definitions
- /supabase/migrations/ — SQL migration files

## Development commands
```bash
pnpm dev          # start dev server (http://localhost:3000)
pnpm build        # production build
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
pnpm test         # vitest (if tests are set up)
```

## Database
- Two tables: profiles and journal_entries
- Both have RLS enabled — see /supabase/migrations/001_initial_schema.sql
- To apply migrations: run SQL in Supabase SQL editor (no local Supabase CLI required for MVP)
- To reset: drop both tables and re-run migration

## Environment variables
Copy .env.local.example to .env.local and fill in values.
Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-side only)
- ANTHROPIC_API_KEY (server-side only, never NEXT_PUBLIC_)

## Claude API integration pattern
The analyze endpoint at /src/app/api/journal/analyze/route.ts is the canonical example
of how to use Claude Structured Outputs in this codebase. Reference it for any new AI features.
- Uses @anthropic-ai/sdk
- Uses output_config.format with JSON schema (not the deprecated output_format beta)
- Beta header: anthropic-beta: structured-outputs-2025-11-13
- Model: claude-sonnet-4-5
- Always authenticate the user before calling the Claude API

## Supabase patterns
- Browser client: import from @/lib/supabase/client (uses createBrowserClient from @supabase/ssr)
- Server client: import from @/lib/supabase/server (uses createServerClient + cookie handling)
- Middleware: uses createServerClient to check session on protected routes
- NEVER use the old @supabase/auth-helpers package

## shadcn/ui
- Add components: pnpm dlx shadcn@latest add [component-name]
- Components live in /src/components/ui/ — do not edit them manually
- Custom journal components in /src/components/journal/ wrap and style shadcn primitives

## Design constraints
- Dark mode is default
- Font pair: DM Serif Display (headings) + Plus Jakarta Sans (body) — loaded via next/font/google
- Mood colors: happy=amber, sad=slate, anxious=rose, reflective=teal, energized=yellow, grateful=green, frustrated=orange, neutral=zinc
- MicButton is the hero element — animated, tactile, large
- Framer Motion is the only animation library

## Testing checklist (manual, before deploy)
- [ ] Sign up with magic link works
- [ ] Sign in with Google works
- [ ] Microphone permission prompt appears on journal page
- [ ] Speaking for 10+ seconds produces a live transcript
- [ ] Stopping recording triggers loading state
- [ ] Structured result appears with mood, events, reflections
- [ ] Entry is saved and appears in entries list
- [ ] Clicking an entry card opens the detail view
- [ ] Signing out redirects to /login
- [ ] Direct URL to /journal while signed out redirects to /login
- [ ] Firefox shows unsupported browser message (not a crash)
- [ ] Mobile (Chrome Android or Safari iOS) recording works

## Known limitations (MVP scope)
- No audio playback (transcript only)
- English only (no multi-language support yet)
- No entry editing after creation
- No entry deletion in the UI (must delete via Supabase dashboard)
- Rate limit: 20 entries per user per day (enforced in API route)
- No push notifications or reminders