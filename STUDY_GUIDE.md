# Study Guide — 30-in-30 Tech Stack

Everything you need to understand to fully grasp every piece of this repository.

---

## 1. Core Framework: Next.js 16 (App Router)

The full-stack React framework everything runs on.

**What to learn:**
- App Router file-based routing (`app/` directory, `page.tsx`, `layout.tsx`, `route.ts`)
- Server Components vs Client Components (`"use client"` directive)
- Server Actions and data fetching patterns
- Route Handlers (API routes in `app/api/`)
- `proxy.ts` — replaces `middleware.ts` in Next.js 16, runs on Node.js runtime (NOT Edge)
- `params`, `headers()`, `cookies()` are now Promises — must `await` them
- Static vs dynamic rendering, `export const dynamic = "force-dynamic"`

**Docs:**
- Official docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Next.js 16 migration: check `node_modules/next/dist/docs/` in the repo for proxy.ts docs

---

## 2. React 19

**What to learn:**
- Server Components (render on server, zero client JS)
- `use()` hook for reading promises and context
- `useFormStatus`, `useActionState` for form handling
- `useOptimistic` for optimistic UI updates
- Async components (Server Components can be async functions)

**Docs:**
- Official docs: https://react.dev/reference/react
- Server Components: https://react.dev/reference/rsc/server-components

---

## 3. TypeScript 5 (Strict Mode)

**What to learn:**
- Strict mode (`strict: true` in tsconfig.json) — no implicit any, strict null checks
- Type narrowing and discriminated unions
- Generics (used heavily in Supabase client typing)
- Type inference with `satisfies`, `as const`
- Utility types: `Pick`, `Omit`, `Partial`, `Record`

**Docs:**
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Strict mode: https://www.typescriptlang.org/tsconfig/#strict

---

## 4. Supabase (Auth + Postgres + RLS)

The entire backend: database, authentication, and row-level security.

**What to learn:**
- **Supabase Auth**: email/password signup, session management, `getUser()` (never `getSession()` alone)
- **@supabase/ssr**: `createServerClient` (Server Components, Route Handlers), `createBrowserClient` (Client Components) — NOT `@supabase/auth-helpers` (deprecated)
- **Row-Level Security (RLS)**: every table has RLS enabled, policies scoped to `auth.uid() = user_id`
- **Service role client**: bypasses RLS, used for system operations (cron jobs)
- **SQL migrations**: schema + RLS policies in `supabase/migrations/`
- **Auth callback flow**: OAuth/magic link redirect → `/auth/callback` route handler → cookie exchange

**Docs:**
- Supabase docs: https://supabase.com/docs
- Auth with Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- @supabase/ssr: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- SQL Editor: https://supabase.com/docs/guides/database/overview

---

## 5. Claude API (Anthropic SDK)

AI integration for summarization, enrichment, and content generation.

**What to learn:**
- **@anthropic-ai/sdk**: TypeScript SDK for Claude API
- **`messages.create()`**: basic message request
- **`messages.parse()` + `zodOutputFormat()`**: Structured Outputs — Claude returns validated JSON matching a Zod schema, no text parsing needed
- **Prompt Caching**: `cache_control: { type: "ephemeral" }` on system message content blocks — 90% cheaper on cached tokens, 5-min TTL
- **System prompts**: as content block arrays (not plain strings) when using caching
- **Model selection**: `claude-haiku-4-5-20251001` for simple tasks (cheap), `claude-opus-4-6` for complex reasoning
- **Error handling**: typed exceptions (`Anthropic.RateLimitError`, `Anthropic.BadRequestError`, etc.)
- **Lazy client initialization**: `function getAnthropic()` — never `new Anthropic()` at module scope

**Docs:**
- API Reference: https://docs.anthropic.com/en/api/messages
- TypeScript SDK: https://github.com/anthropics/anthropic-sdk-typescript
- Structured Outputs: https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs
- Prompt Caching: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- Models: https://docs.anthropic.com/en/docs/about-claude/models

---

## 6. Zod 4

Runtime schema validation used for env vars, API responses, form data, and Claude structured outputs.

**What to learn:**
- Schema definition: `z.object()`, `z.string()`, `z.number()`, `z.array()`, `z.enum()`
- Parsing: `schema.parse()` (throws), `schema.safeParse()` (returns result)
- **Zod 4 breaking changes** (different from Zod 3):
  - `.issues` not `.errors` (the `.errors` alias was removed)
  - `{ error: "..." }` not `{ message: "..." }` in custom validators
  - `.flatten()` deprecated → use `z.treeifyError()` or `.issues` directly
- Integration with `zodOutputFormat()` from `@anthropic-ai/sdk/helpers/zod`

**Docs:**
- Zod docs: https://zod.dev
- GitHub: https://github.com/colinhacks/zod

---

## 7. Tailwind CSS v4

Utility-first CSS framework. V4 uses CSS-first configuration.

**What to learn:**
- **CSS-first config**: `@theme inline {}` in `globals.css` — no `tailwind.config.ts` file
- CSS custom properties (`--color-*`, `--font-*`) defined in `:root`
- Dark mode as default (`.dark` class on `<html>`)
- Utility classes: spacing, flexbox, grid, typography, colors
- `@apply` for reusable styles (use sparingly)
- PostCSS integration via `@tailwindcss/postcss`

**Docs:**
- Official docs: https://tailwindcss.com/docs
- V4 upgrade guide: https://tailwindcss.com/docs/upgrade-guide

---

## 8. shadcn/ui

Pre-built, customizable React components. NOT a package — components are copied into your project.

**What to learn:**
- Components live in `components/ui/` — you own the code
- Built on Radix UI primitives (accessible, unstyled)
- `components.json` configures paths, style, and aliases
- Each component is a single file you can modify directly
- Uses `cn()` utility (from `lib/utils.ts`) for conditional class merging

**Docs:**
- Component library: https://ui.shadcn.com
- Installation: https://ui.shadcn.com/docs/installation/next

---

## 9. Resend + React Email (Day 4)

Transactional email sending with JSX templates.

**What to learn:**
- **Resend**: email API — `resend.emails.send()` with `from`, `to`, `subject`, `react` (JSX component)
- **@react-email/components**: `Html`, `Head`, `Body`, `Container`, `Section`, `Text`, `Link`, `Hr` — write emails as React components
- Domain verification (DNS records) for production sending
- Free tier: 3,000 emails/month, 100/day
- Lazy init: `function getResend()` — same pattern as Anthropic client

**Docs:**
- Resend docs: https://resend.com/docs
- Resend Next.js guide: https://resend.com/docs/send-with-nextjs
- React Email: https://react.email/docs/introduction

---

## 10. Vercel (Deployment + Cron)

Hosting and scheduled jobs.

**What to learn:**
- Import from GitHub → auto-deploys on push
- **Environment variables**: set in Vercel dashboard (Settings → Environment Variables)
- **Root Directory**: set to specific project folder for monorepo (e.g., `day4hackerNewsDigest`)
- **vercel.json**: cron schedule config (`"crons": [{ "path": "/api/cron/digest", "schedule": "0 7 * * *" }]`)
- Hobby plan: cron runs once/day minimum, ±59 min precision
- Preview deployments do NOT run cron jobs
- Cron endpoint secured with `CRON_SECRET` (checked via `Authorization: Bearer <secret>`)

**Docs:**
- Vercel docs: https://vercel.com/docs
- Cron Jobs: https://vercel.com/docs/cron-jobs
- Environment Variables: https://vercel.com/docs/environment-variables
- Monorepos: https://vercel.com/docs/monorepos

---

## 11. Cheerio (Day 3)

Server-side HTML parsing and scraping.

**What to learn:**
- jQuery-like API for parsing HTML on the server
- `cheerio.load(html)` → `$('selector').text()`, `.attr()`, `.find()`
- Used in TweetCraft to extract article content from URLs

**Docs:**
- Cheerio docs: https://cheerio.js.org/docs/intro

---

## 12. Framer Motion 12 (Days 1-3)

React animation library.

**What to learn:**
- `motion.div` components with `animate`, `initial`, `exit` props
- `AnimatePresence` for mount/unmount animations
- Variants for orchestrating complex animations
- **V12 breaking change**: requires explicit `Variants` type + `as const` for ease strings

**Docs:**
- Framer Motion docs: https://motion.dev/docs/react-quick-start

---

## 13. Sonner

Toast notification library.

**What to learn:**
- `<Toaster />` component in layout
- `toast.success()`, `toast.error()`, `toast.loading()` for notifications
- Theming with `theme="dark"` and custom `toastOptions`

**Docs:**
- Sonner docs: https://sonner.emilkowal.dev

---

## 14. Lucide React

Icon library (tree-shakeable SVG icons).

**What to learn:**
- Import individual icons: `import { Mail, Trash2, RefreshCw } from "lucide-react"`
- Pass `size`, `className`, `strokeWidth` props

**Docs:**
- Icon search: https://lucide.dev/icons
- React usage: https://lucide.dev/guide/packages/lucide-react

---

## 15. pnpm

Fast, disk-efficient package manager.

**What to learn:**
- `pnpm install` / `pnpm add <pkg>` / `pnpm dev` / `pnpm build`
- `pnpm-workspace.yaml` for monorepo workspaces
- Strict node_modules structure (symlinks, no phantom dependencies)

**Docs:**
- pnpm docs: https://pnpm.io

---

## 16. ESLint 9 (Flat Config)

Code linting with the new flat config format.

**What to learn:**
- `eslint.config.mjs` (not `.eslintrc`) — flat config array
- `@eslint/js`, `typescript-eslint`, `eslint-config-next` plugins

**Docs:**
- ESLint flat config: https://eslint.org/docs/latest/use/configure/configuration-files
- Next.js ESLint: https://nextjs.org/docs/app/api-reference/config/eslint

---

## 17. Claude Code (Development Tool)

The AI CLI tool used to build these projects.

**What to learn:**
- **CLAUDE.md**: auto-loaded context file — project rules, patterns, mistakes to avoid
- **Skills**: `.claude/skills/<name>/SKILL.md` — reusable instruction sets
- **Agents**: `.claude/agents/<name>.md` — specialized sub-agents
- **MCP Servers**: configured in `~/.claude/settings.json` (global) or `.claude/settings.json` (project)
- **Context7**: MCP server for querying up-to-date library docs
- **Memory**: `~/.claude/projects/.../memory/MEMORY.md` — persists across sessions

**Docs:**
- Claude Code: https://docs.anthropic.com/en/docs/claude-code/overview

---

## 18. HN Firebase API (Day 4)

Hacker News public API — no auth required.

**What to learn:**
- Top stories: `https://hacker-news.firebaseio.com/v0/topstories.json` → array of IDs
- Story detail: `https://hacker-news.firebaseio.com/v0/item/{id}.json` → `{ id, title, url, score, by, descendants }`
- Returns JSON directly (no HTML parsing needed)

**Docs:**
- HN API docs: https://github.com/HackerNews/API

---

## Study Order (Recommended)

If starting from scratch, learn in this order:

1. **TypeScript** — everything is typed
2. **React 19** — component model, hooks, Server Components
3. **Next.js 16** — routing, API routes, rendering
4. **Tailwind CSS v4** — styling
5. **Supabase** — database, auth, RLS
6. **Zod 4** — validation
7. **Claude API** — AI integration (Structured Outputs, Prompt Caching)
8. **Everything else** — Resend, Vercel, shadcn, etc. as needed per project
