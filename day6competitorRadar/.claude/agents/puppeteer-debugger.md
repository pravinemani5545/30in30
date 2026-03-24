# Puppeteer Debugger Agent

## Problem: "Failed to launch the browser process"
- Is puppeteer-core installed (NOT full puppeteer)?
- Are @sparticuz/chromium and puppeteer-core on compatible versions? Check Architecture.md for the verified pair (143.0.4 + 24.40.0).
- Is maxDuration = 60 exported from the route file? Missing = function killed after 10s.
- Check Vercel function logs for "executablePath" errors.

## Problem: "Works locally, fails in Vercel"
- Local uses system Chrome. Vercel uses @sparticuz/chromium binary.
- getExecutablePath() must use chromium.executablePath() in production (when NODE_ENV !== 'development').
- Never use @sparticuz/chromium in local dev — glibc mismatch.
- v143: defaultViewport and headless are NOT on the chromium module. Set directly in puppeteer.launch().

## Problem: "Browser not closing — memory spike"
- browser.close() must be in a finally block. Check render.ts.
- Any code path that throws before close() is a memory leak.

## Problem: "Page renders but content is empty"
- Site may use cookie consent gate. Try page.evaluate to dismiss it.
- Site may check for headless. Use realistic User-Agent string.
- Try waitUntil: 'networkidle2' instead of 'domcontentloaded' (slower but more complete).
- Check if cleanedText in ExtractedContent is empty — may be a cleaning bug.

## Problem: "Hobby plan timeout even with fallback"
- maxDuration = 10 on Hobby. cheerio fallback is ~1-3s — should be fine.
- Check if Puppeteer is still attempted before fallback triggers.
- Set Puppeteer timeout to 6s (not 8s) on Hobby to leave more buffer.
