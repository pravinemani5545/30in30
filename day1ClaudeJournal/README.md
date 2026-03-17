# ClaudeJournal

**App #1 of 30-in-30** — Voice-to-structured journal powered by Claude AI.

Speak your thoughts. Claude organizes them into mood, key events, and reflections. Your entries are stored privately in Supabase.

---

## What it does

1. You tap the microphone button and speak freely
2. The Web Speech API transcribes your voice in real time
3. When you stop, Claude (`claude-sonnet-4-5`) analyzes the transcript using Structured Outputs
4. You get back: mood, mood intensity, key events, reflections, gratitude list, and tomorrow's intention
5. The entry is saved to your private journal

---

## Stack

- **Next.js 15** App Router (TypeScript strict mode)
- **Tailwind CSS v4** + shadcn/ui (zinc base, dark mode default)
- **@anthropic-ai/sdk** — server-side only, `claude-sonnet-4-5` with Structured Outputs
- **Supabase** — Postgres + Auth (Magic Link + Google OAuth) + RLS
- **Framer Motion** — MicButton pulse animation, staggered entry reveal
- **Zod** — validation at every trust boundary
- **pnpm** — package manager

---

## Setup

### 1. Clone and install

```bash
pnpm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 3. Database

Run the migration in the **Supabase SQL Editor**:

```
supabase/migrations/001_initial_schema.sql
```

This creates the `profiles` and `journal_entries` tables with RLS policies.

### 4. Auth

In your Supabase dashboard → **Authentication → URL Configuration**, add:

```
http://localhost:3000/auth/callback
```

For Google OAuth: Authentication → Providers → Google → add your Client ID and Secret from Google Cloud Console.

### 5. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Dev commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # eslint
```

---

## Project structure

```
src/
  app/
    (auth)/           # login + auth callback (public)
    (journal)/        # protected journal routes
    api/              # Route Handlers (server-side only)
    page.tsx          # landing page
  components/
    journal/          # MicButton, EntryResult, EntryCard, etc.
    layout/           # Sidebar, Header, BottomNav
    ui/               # shadcn/ui primitives
  hooks/              # useSpeechRecognition, useJournalEntry
  lib/                # anthropic client, supabase clients, zod schemas
  types/              # TypeScript types
supabase/
  migrations/         # SQL migration files
```

---

## Architecture notes

- Claude API calls are **server-side only** (`/src/app/api/journal/analyze/route.ts`)
- `ANTHROPIC_API_KEY` is never in client code or `NEXT_PUBLIC_` variables
- RLS is the primary data isolation mechanism — data access is enforced at the database level
- Web Speech API runs entirely in the browser — only the transcript text hits the server
- Rate limit: 20 entries per user per day (enforced in the API route)

See `ARCHITECTURE.md` for a deep dive into every design and security decision.

---

*Day 1 of [30 apps in 30 days](https://github.com/pravinemani).*
