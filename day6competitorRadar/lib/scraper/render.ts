import { launchBrowser } from './browser'
import { isPrivateIP } from '@/lib/validations/url'
import type { Browser } from 'puppeteer-core'

export async function renderPage(url: string): Promise<string | null> {
  let browser: Browser | null = null
  try {
    browser = await launchBrowser()
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 8000,
    })

    // SSRF check: verify final URL after redirects
    if (response) {
      const finalUrl = page.url()
      try {
        const finalHostname = new URL(finalUrl).hostname
        const dns = await import('dns/promises')
        const { address } = await dns.lookup(finalHostname)
        if (isPrivateIP(address)) {
          return null
        }
      } catch {
        // If DNS lookup fails on redirect, abort
        return null
      }
    }

    await page.waitForSelector('body', { timeout: 2000 }).catch(() => {})

    // Trigger lazy-loaded content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await new Promise(r => setTimeout(r, 500))

    const html = await page.content()
    return html
  } catch {
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
