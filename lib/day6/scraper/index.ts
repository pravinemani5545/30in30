import { renderPage } from './render'
import { fetchStatic } from './fallback'
import { cleanHtml } from './clean'
import type { ExtractedContent, RenderMethod } from '@/types/day6'

export async function scrapeUrl(url: string): Promise<ExtractedContent> {
  const start = Date.now()

  // Path A: Puppeteer JS rendering
  let html = await renderPage(url)
  let renderMethod: RenderMethod = 'js_rendered'

  // Path B: Fallback to static fetch
  if (!html) {
    html = await fetchStatic(url)
    renderMethod = 'static_only'
  }

  if (!html) {
    // Return minimal content if both paths fail
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname.replace(/^www\./, '')
    return {
      url,
      domain,
      faviconUrl: `https://${domain}/favicon.ico`,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
      cleanedText: '',
      wordCount: 0,
      extractionQuality: 'minimal',
      renderMethod: 'static_only',
    }
  }

  const content = cleanHtml(html, url, renderMethod)
  const durationMs = Date.now() - start

  console.log(
    `[scraper] domain=${content.domain} method=${content.renderMethod} ` +
    `quality=${content.extractionQuality} words=${content.wordCount} duration=${durationMs}ms`
  )

  return content
}
