# VoiceNote-to-Blog — Claude Code Context

## What this app does
Record voice (Chrome/Edge only) or upload .webm audio. OpenAI Whisper
(gpt-4o-mini-transcribe) transcribes it. User reviews and edits the raw
transcript. Claude Sonnet streams a structured blog post word-by-word via
Vercel AI SDK: headline, intro, 3 body sections, conclusion, 3 pull quotes.
Post saved to Supabase. Audio stored in Supabase Storage.

## This is Day 7 of a 30-day series
- voice_posts table is canonical for voice-captured content
- Audio in Supabase Storage reused by Day 18 VoiceoverStudio
- Structured sections reused by Day 30 YouTube AI SaaS voice-to-script

## Stack
Next.js 16 App Router · TypeScript strict · Tailwind v4 · shadcn/ui
Supabase (Postgres + Auth + Storage via @supabase/ssr)
OpenAI Whisper (gpt-4o-mini-transcribe) · Claude Sonnet via Vercel AI SDK
Vercel AI SDK (ai + @ai-sdk/anthropic) · Framer Motion · Sonner · pnpm

## TWO AI PROVIDERS — different packages
- @ai-sdk/anthropic: used with streamText for Claude streaming (THIS APP)
- @anthropic-ai/sdk: used for direct API calls without streaming (Days 4/5/6)
- ANTHROPIC_API_KEY is read by both packages

## MODEL SELECTION
- Whisper: gpt-4o-mini-transcribe (NOT whisper-1)
- Claude: claude-sonnet-4-6 via @ai-sdk/anthropic

## Vercel AI SDK streaming — critical patterns
- Route handler: `streamText` from 'ai', `anthropic` from '@ai-sdk/anthropic'
- Return: `result.toDataStreamResponse()`
- Client: `useCompletion` from '@ai-sdk/react' — NOT useChat
- Route must export: `export const maxDuration = 60`

## MediaRecorder — browser compatibility
- Chrome/Edge: audio/webm;codecs=opus ✓
- Firefox: audio/ogg;codecs=opus ✗
- Safari: audio/mp4 — inconsistent ✗
- Always set explicit mimeType: 'audio/webm;codecs=opus'

## Blog post section markers
[HEADLINE], [INTRO], [SECTION:1-3], [CONCLUSION], [PULLQUOTE:1-3]

## Two-phase pipeline
Phase 1: Transcribe → show raw transcript (editable)
Phase 2: User reviews/edits → Generate → stream post

## Rate limiting
5 voice posts/day/user in /api/transcribe
