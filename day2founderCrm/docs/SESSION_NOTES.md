# FounderCRM — Build Session Notes

A running log of every session building this app: decisions made, bugs hit, fixes applied.

---

## Session 1 — Initial Build

**Goal:** Build the full FounderCRM from scratch in one session.

### What was built
- Full Next.js 16.2.0 App Router project scaffolded with pnpm
- Supabase schema: `contacts`, `follow_up_suggestions`, `enrichment_jobs`, `enrichment_usage` tables with RLS
- Auth flow: magic link + Google OAuth via Supabase, `proxy.ts` middleware for route protection
- Enrichment pipeline: Apollo People Enrichment API → normalize → Claude Structured Outputs → upsert contact
- Mock provider for dev (no Apollo credits needed)
- UI: dark-mode-first design system (amber #E8A020, near-black #0A0A0A), Instrument Serif + DM Sans fonts
- Components: `LinkedInInputForm`, `ContactList`, `ContactListItem`, `ContactDetail`, `EnrichmentPanel`, `FollowUpCard`, `StatusSelector`, `NotesEditor`
- Hooks: `useEnrichment`, `useContacts`, `useContact`, `useCredits`, `useCopyToClipboard`
- API routes: `/api/enrich`, `/api/contacts`, `/api/contacts/[id]`, `/api/follow-ups/[id]`, `/api/credits`
- Framer Motion stagger animation on enrichment cards
- CLAUDE.md, `.claude/agents/`, `.claude/commands/`

### Key decisions made
- **Next.js 16 over 15** — pnpm create scaffolded 16.2.0; kept it (stable, same patterns)
- **`proxy.ts` not `middleware.ts`** — Next.js 16 renamed the middleware convention
- **`@supabase/ssr` not `auth-helpers`** — auth-helpers is deprecated; SSR package is the current standard
- **`getUser()` not `getSession()`** — Supabase SSR docs require `getUser()` to validate against the server; `getSession()` trusts the client cookie unverified
- **Structured Outputs via `zodOutputFormat`** — used `client.messages.parse()` + `output_config.format` (not the deprecated `output_format` beta)
- **Apollo as optional** — if no API key or credits = 0, falls through to manual paste; no hard crash
- **`raw_provider_data: null`** — Apollo raw response deliberately never stored (PII risk)

### Bugs hit during build
- **Framer Motion TypeScript error** — `ease: "easeOut"` incompatible with `Easing` type. Fixed: added `import { type Variants }` and `"easeOut" as const`
- **Wrong folder structure** — `pnpm create next-app founder-crm` created nested subfolder. Fixed: moved all files up one level, deleted inner dir

---

## Session 2 — Auth, Ports, Hydration

**Goal:** Get the app running and auth working end-to-end.

### Issues and fixes

**Middleware deprecation warning**
- Next.js 16: "The 'middleware' file convention is deprecated. Please use 'proxy' instead"
- Fix: renamed `middleware.ts` → `proxy.ts`, exported function renamed `middleware` → `proxy`
- Cleared `.next` cache to pick up change (`rm -rf .next`)

**Port conflicts**
- Port 3000 occupied by process 89217 on dev machine
- Next.js auto-selected 3001/3002; killed process to free 3000

**Infinite loading after proxy rename**
- Stale `.next` cache; cleared and restarted

**Hydration warnings from NordPass password manager**
- Browser extension injected `data-np-mark`, `data-np-autofill-submit`, `data-np-intersection-state` attributes
- These cause React hydration mismatches (server HTML ≠ client HTML)
- Fix: added `suppressHydrationWarning` to affected `<input>` and `<button>` elements in login page and `LinkedInInputForm`

**Supabase email rate limit**
- Free tier: 2 magic link emails per hour
- Workaround: use Google OAuth, or wait an hour

**`NSURLError` on both auth methods**
- Root cause: wrong/placeholder `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Fix: copied correct URL from Supabase dashboard

### Supabase setup steps confirmed
1. Create project at supabase.com
2. Run `supabase/migrations/001_initial.sql` in SQL editor
3. Auth → URL Configuration → Site URL: `http://localhost:3000`
4. Auth → URL Configuration → Redirect URLs: add `http://localhost:3000/auth/callback`
5. Google OAuth: create credentials in Google Cloud Console → add Client ID + Secret to Supabase Auth → Google provider
6. Copy Supabase URL + anon key + service role key to `.env.local`

---

## Session 3 — Apollo, Manual Paste, Status Bugs

**Goal:** Fix Apollo 422 errors, improve manual paste UX, fix status sync bugs.

### Apollo 422 error

**Symptom:** Server logs showed `[apollo] Unexpected status: 422` → `POST /api/enrich 500`

**Root causes identified:**
1. No error body logging — couldn't see Apollo's actual error message
2. LinkedIn URL lacked `www.` prefix — Apollo requires `https://www.linkedin.com/in/...`
3. API key only in request body, not header — newer Apollo API prefers `X-Api-Key` header
4. 422 was throwing an unhandled error instead of falling through to manual paste

**Fix (`lib/enrichment/providers/apollo.ts`):**
- Normalize URL: `linkedin.com/` → `www.linkedin.com/`
- Add `X-Api-Key: apiKey` header alongside body `api_key`
- Log full error response body on any non-2xx
- Return `null` for all 4xx (triggers manual paste) — only throw on 5xx

**Why Apollo still couldn't match the profile:**
- Apollo free tier's database covers ~275M profiles but not all of LinkedIn's ~1B users
- No-match rates of 40–60% are common even for valid profiles
- Manual paste is the reliable fallback for gaps in Apollo's coverage

### Manual paste improvements

**Character limit raised:** 10,000 → 25,000 chars (validation schema + API slice)
- A full LinkedIn page copy (Cmd+A) can easily exceed 10k with navigation text

**Raw text trimmed to 12,000 before Claude:**
- LinkedIn page copy includes navigation, sidebar, "People also viewed", footer — all noise
- First 12k chars captures all actual profile content
- Sending less = faster Claude response

**"Paste manually instead" shortcut:**
- Added link below URL input to skip Apollo entirely
- User pastes URL + clicks link → manual paste textarea shows immediately
- No Apollo round-trip needed; URL still required to save the contact record

**Character counter added:**
- Shows `X / 25,000` in paste textarea
- Turns red when within 2,000 chars of limit

### Claude timeout fix

**Symptom:** "Analysis timed out. Please try again."

**Root cause:** `AbortSignal.timeout(30000)` — 30s was too tight for Claude Structured Outputs with large prompts

**Fix:**
- Raised timeout from 30s → 60s in `lib/claude/enrichContact.ts`
- Added `export const maxDuration = 60` to `/api/enrich/route.ts` (prevents Vercel from killing the function on production's default 10s limit)

### Contact showing in all status tabs

**Symptom:** A newly-enriched contact (status: "new") appeared under "Contacted" and "Replied" tabs

**Root cause:** `extraContacts` were prepended to the contact list without filtering by `activeTab`. The merge logic only checked for duplicate IDs, not status match.

**Fix (`components/ContactList.tsx`):**
- Filter `extraContacts` by `activeTab` before merging
- Also flipped deduplication: `extraContacts` now wins over stale API results for the same contact ID (so status updates reflect immediately)

### Status badge not updating in sidebar

**Symptom:** After changing status in detail panel, sidebar still showed old status badge until clicking another tab

**Root causes:**
1. `handleStatusChange` in `ContactDetail` waited for API response before calling `onContactUpdate` — during this wait, the `select` showed the new text but the `background` style was still the old status color
2. `ContactList` uses its own `useContacts` fetch state, separate from `useContact` in the detail panel — status changes in the detail never propagated to the list
3. `background` CSS shorthand on the `select` conflicted with `backgroundImage` (the chevron arrow) causing style inconsistency

**Fixes:**
- `ContactDetail`: optimistic update — calls `onContactUpdate({ status: newStatus })` *before* the API call; reverts on failure
- `dashboard/page.tsx`: `onContactUpdate` now also updates `recentContacts` (or adds the contact to it if it was loaded from the API list), so `extraContacts` in the sidebar always has fresh state
- `StatusSelector`: changed `background` → `backgroundColor` to avoid shorthand fighting with `backgroundImage`

---

## Pending / Known Issues

- Apollo free tier has low match rates for newer/smaller profiles — manual paste is the practical path for most contacts
- No real-time updates between tabs/devices (would need Supabase Realtime subscriptions)
- Notes autosave debounce not implemented — notes editor saves on blur only
- No pagination in contact list — will degrade at ~500+ contacts
