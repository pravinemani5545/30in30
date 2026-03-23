Review this file for security issues specific to PitchDoctor:
1. Is ANTHROPIC_API_KEY server-side only (never NEXT_PUBLIC_)?
2. Is SUPABASE_SERVICE_ROLE_KEY server-side only?
3. Is rate limiting checked BEFORE the Claude API call in /api/analyze?
4. Are IPs hashed (SHA-256) before storage — never raw IPs in DB?
5. Are anonymous analyses NOT persisted to pitch_analyses?
6. Is user_id derived from getUser() session, never from request body?
7. Is RLS enabled on pitch_analyses with correct user-scoped policies?
8. Is the Anthropic client lazy-initialized (not module-level)?
9. Are pitch contents absent from server logs (only length + score logged)?
Report each issue with file path, line number, and fix recommendation.
