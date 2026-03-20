---
name: test-digest
description: End-to-end test procedure for the digest pipeline. Use after making changes to the cron, email, or HN fetch logic.
---

# Test Digest — End-to-End

1. Sign in, navigate to /dashboard
2. Add your email as a subscriber
3. Click "Send Test Digest" (or POST /api/digest/preview)
4. Expected: loading state → success toast
5. Check inbox — digest email should arrive within 30 seconds
6. Verify email: 10 stories sorted by score, score badges, unsubscribe link
7. Check Supabase: digest_runs shows status="sent", correct sent_count
8. Test idempotency: click again → "Digest already sent today"
9. Test unsubscribe: click link in email → confirms, is_active=false in DB
