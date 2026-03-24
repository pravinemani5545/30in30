# Security Reviewer Agent

## Checklist
- [ ] SSRF: private IP ranges blocked before Puppeteer launch (lib/validations/url.ts)
- [ ] SSRF: DNS pre-resolution before launch (validateUrlServerSide)
- [ ] SSRF: non-standard ports blocked in URL validation
- [ ] SSRF: response.url() checked after navigation (lib/scraper/render.ts)
- [ ] ANTHROPIC_API_KEY server-side only, never NEXT_PUBLIC_
- [ ] SUPABASE_SERVICE_ROLE_KEY: url_cache writes only
- [ ] URL Zod validation before ANY network call
- [ ] Rate limit: 10/day/user — server-side COUNT
- [ ] user_id from getUser() — never request body
- [ ] Puppeteer browser.close() in finally block
- [ ] Extracted text NOT logged — domain + quality + method + duration only
- [ ] maxDuration exported from route file (first line)
- [ ] url_cache RLS: SELECT for authenticated, no INSERT via RLS
- [ ] Non-HTML content-type rejected before processing
- [ ] /api/preview public but rate-limited by IP
- [ ] getUser() used — never getSession() alone
