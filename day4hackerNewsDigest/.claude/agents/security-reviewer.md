# Security Reviewer

## Checklist
- [ ] ANTHROPIC_API_KEY: never in NEXT_PUBLIC_ vars
- [ ] SUPABASE_SERVICE_ROLE_KEY: server-side only
- [ ] RESEND_API_KEY: server-side only
- [ ] CRON_SECRET: server-side only, verified on every cron request
- [ ] CRON_USER_ID: server-side only, never returned to client
- [ ] /api/cron/digest: no session auth, CRON_SECRET only
- [ ] /api/unsubscribe: no session auth, token-based only
- [ ] All other /api/* routes: session required
- [ ] unsubscribe_token: never returned to frontend
- [ ] Subscriber emails: never in console.log
- [ ] RLS enabled on subscribers + digest_runs
- [ ] user_id always from server session
- [ ] Zod validation on POST endpoints
