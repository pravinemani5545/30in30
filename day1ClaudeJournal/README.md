# ClaudeJournal

**App #1 of 30-in-30** — Voice-to-structured journal powered by Claude AI.

Speak your thoughts. Claude organizes them into mood, key events, reflections, gratitude, and a grounded intention for tomorrow. Your entries are stored privately and securely in Supabase.

---

## What it does

1. Tap the microphone button and speak freely — no prompts, no format
2. The Web Speech API transcribes your voice in real time (browser-native, no third-party)
3. When you stop (or pause for 3 seconds), the transcript is sent to a server-side API route
4. Claude (`claude-sonnet-4-5`) analyzes it using Structured Outputs and returns a structured object
5. You get: mood classification, mood intensity, mood summary, key events, deeper reflections, implicit gratitude, and a specific tomorrow intention
6. The entry is saved to your private journal in Supabase (RLS-enforced — users can only see their own data)
7. Browse all past entries, click any entry to read the full transcript + AI analysis

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router, TypeScript strict mode |
| Styling | Tailwind CSS v4, shadcn/ui (zinc base, dark mode default) |
| AI | Anthropic `claude-sonnet-4-5` via `@anthropic-ai/sdk` (server-side only) |
| Database | Supabase Postgres |
| Auth | Supabase Auth — Magic Link + Google OAuth |
| Data isolation | Supabase Row Level Security (RLS) |
| Animation | Framer Motion (MicButton pulse, staggered reveals) |
| Validation | Zod v4 at every trust boundary |
| Package manager | pnpm |
| Deployment | Vercel |

---

## Architecture overview

```
Browser                          Server (Vercel Edge / Node)         External
──────────────────────────────   ─────────────────────────────────   ─────────────
Web Speech API (microphone)  →   /api/journal/analyze (Route Handler)
                                   ├── Authenticate via Supabase      Supabase Auth
                                   ├── Rate limit check (20/day)      Supabase DB
                                   ├── Call Claude Structured Outputs  Anthropic API
                                   └── Save entry + return result     Supabase DB
```

**Key security decisions:**
- `ANTHROPIC_API_KEY` is never in client code or `NEXT_PUBLIC_` variables — only in server Route Handlers
- RLS policies on `journal_entries` ensure users can only read/write their own rows, even if someone crafts a direct API call
- `user_id` is never trusted from the client — always resolved server-side from the authenticated session
- Rate limit (20 entries/day) is enforced in the API route, not the client

---

## Project structure

```
day1ClaudeJournal/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Public auth routes
│   │   │   ├── login/page.tsx       # Login page (magic link + Google)
│   │   │   └── auth/callback/       # Supabase OAuth callback handler
│   │   ├── (journal)/               # Protected routes (requires auth)
│   │   │   ├── journal/page.tsx     # Main recording page
│   │   │   └── entries/
│   │   │       ├── page.tsx         # Entries list
│   │   │       └── [id]/page.tsx    # Entry detail view
│   │   ├── api/
│   │   │   └── journal/analyze/     # Claude API route (server-side only)
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout (fonts, providers)
│   │   └── globals.css              # Tailwind + custom utilities
│   ├── components/
│   │   ├── journal/                 # App-specific components
│   │   │   ├── MicButton.tsx        # Hero microphone button with Framer Motion
│   │   │   ├── TranscriptDisplay.tsx # Live transcript while recording
│   │   │   ├── EntryResult.tsx      # Structured AI analysis display
│   │   │   └── EntryCard.tsx        # Entry list item
│   │   ├── layout/                  # Shell components
│   │   │   ├── Sidebar.tsx          # Desktop navigation sidebar
│   │   │   ├── Header.tsx           # Top header bar
│   │   │   └── BottomNav.tsx        # Mobile bottom navigation (iOS safe area)
│   │   └── ui/                      # shadcn/ui primitives (do not edit manually)
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts  # Web Speech API wrapper
│   │   └── useJournalEntry.ts       # Recording → analysis state machine
│   ├── lib/
│   │   ├── anthropic.ts             # Anthropic SDK client (server-side)
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   └── server.ts            # Server Supabase client (SSR cookie handling)
│   │   └── validations/journal.ts   # Zod schemas for requests + API response
│   └── types/
│       ├── journal.ts               # TypeScript types for DB rows + API
│       └── speech.d.ts              # Web Speech API type declarations
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Full DB schema with RLS policies
├── middleware.ts                     # Auth session refresh + route protection
├── ARCHITECTURE.md                  # Deep dive on design and security decisions
└── SESSION_NOTES.md                 # Build session log (bugs found, fixes applied)
```

---

## Local development setup

### 1. Clone and install

```bash
git clone https://github.com/pravinemani5545/30in30.git
cd 30in30/day1ClaudeJournal
pnpm install
```

### 2. Environment variables

Create `.env.local` in `day1ClaudeJournal/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → Data API → anon / public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → Data API → service_role (secret) |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

### 3. Database

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in the **Supabase SQL Editor** (your project → SQL Editor → New query → paste → Run).

This creates:
- `profiles` table — linked to `auth.users`, stores display name and avatar URL
- `journal_entries` table — stores transcript, AI analysis fields, word count, duration
- RLS policies on both tables — users can only access their own rows
- A DB trigger that auto-creates a profile row on sign-up

### 4. Auth configuration

In your Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

For Google OAuth (optional):
1. Supabase → Authentication → Providers → Google → toggle on
2. Paste your Google Client ID and Secret (from Google Cloud Console)
3. In Google Cloud Console → APIs & Services → Credentials → your OAuth client:
   - Authorized JavaScript origins: `https://your-ref.supabase.co`
   - Authorized redirect URIs: `https://your-ref.supabase.co/auth/v1/callback`

### 5. Run

```bash
# Requires Node 22 (Next.js 16 is incompatible with Node 24)
nvm use 22
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Dev commands

```bash
pnpm dev        # start dev server (http://localhost:3000)
pnpm build      # production build
pnpm lint       # eslint
```

---

## Database schema

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | References `auth.users(id)` |
| `email` | text | |
| `full_name` | text | nullable |
| `avatar_url` | text | nullable |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `journal_entries`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | References `auth.users(id)` |
| `raw_transcript` | text | Original spoken words |
| `duration_seconds` | integer | nullable |
| `word_count` | integer | |
| `mood` | text | `happy`, `sad`, `anxious`, `reflective`, `energized`, `neutral`, `frustrated`, `grateful` |
| `mood_intensity` | integer | 1–10 |
| `mood_summary` | text | One sentence |
| `events` | jsonb | Array of `{ title, description, significance }` |
| `reflections` | jsonb | Array of `{ insight, theme }` |
| `gratitude` | text[] | Array of strings |
| `tomorrow_intention` | text | |
| `entry_title` | text | 4–7 word title |
| `created_at` | timestamptz | |

---

## Claude API integration

The analyze endpoint at `src/app/api/journal/analyze/route.ts` is the canonical example of how Claude Structured Outputs is used in this codebase.

- Uses `@anthropic-ai/sdk`
- Uses `output_config.format` with a `json_schema` type (not the deprecated `output_format` beta)
- Beta header: `anthropic-beta: structured-outputs-2025-11-13`
- Model: `claude-sonnet-4-5`
- The JSON Schema must not include `minimum`/`maximum` constraints on integer fields — Claude's Structured Outputs beta does not support them (use description-based constraints instead)

---

## Known limitations

- No audio playback — transcript text only
- English only (Web Speech API language not configurable in current UI)
- No entry editing or deletion in the UI (delete via Supabase dashboard)
- No search or filtering on entries list
- Rate limit: 20 entries per user per day
- Web Speech API is not supported in Firefox or non-Chromium browsers — an unsupported browser message is shown

---

## Production deployment

See the [30in30 repo README](https://github.com/pravinemani5545/30in30) for the full deployment checklist.

Short version:
1. Deploy to Vercel — set Root Directory to `day1ClaudeJournal`
2. Add all 4 env vars to Vercel project settings
3. Supabase → Auth → URL Configuration → update Site URL and add production redirect URL
4. Google Cloud Console → add production domain to Authorized JavaScript Origins (if using Google OAuth)

---

*Day 1 of [30 apps in 30 days](https://github.com/pravinemani5545/30in30).*
