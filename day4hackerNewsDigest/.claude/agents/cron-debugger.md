# Cron Debugger

## Problem: "Cron is not firing"
- Check Vercel Dashboard > Settings > Cron Jobs. Is it listed?
- Is this a production deployment? Cron does not run on preview deployments.
- Is the vercel.json cron schedule valid?

## Problem: "Getting 401 on cron endpoint"
- Is CRON_SECRET set in Vercel environment variables?
- Authorization header must be: `Bearer ${CRON_SECRET}` (with "Bearer " prefix)

## Problem: "Cron ran twice today"
- This is expected — Vercel can fire twice. Idempotency must handle it.
- Check digest_runs for today's scheduled_for.

## Problem: "Email not received"
- Check Resend dashboard > Logs
- Is sender domain verified? Using onboarding@resend.dev for dev?
- Check subscriber is_active=true

## Problem: "Stories missing from digest"
- Check digest_runs.stories_json
- Test HN API: https://hacker-news.firebaseio.com/v0/topstories.json
