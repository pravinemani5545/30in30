import * as cheerio from 'cheerio'
import type { PreviewResponse } from '@/types/day6'

export async function fetchPreview(url: string): Promise<PreviewResponse | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompetitorRadar/1.0)',
        'Accept': 'text/html',
      },
    })

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('xhtml')) {
      return null
    }

    // Read only first 50KB for speed
    const reader = response.body?.getReader()
    if (!reader) return null

    let html = ''
    const decoder = new TextDecoder()
    while (html.length < 50000) {
      const { done, value } = await reader.read()
      if (done) break
      html += decoder.decode(value, { stream: true })
      if (html.includes('</head>')) break
    }
    reader.cancel()

    const $ = cheerio.load(html)
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname.replace(/^www\./, '')

    const title = $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim() || null
    const description = $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') || null

    const favicon = $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      `https://${domain}/favicon.ico`

    const faviconUrl = favicon.startsWith('http')
      ? favicon
      : `${parsedUrl.origin}${favicon.startsWith('/') ? '' : '/'}${favicon}`

    return { title, description, domain, faviconUrl }
  } catch {
    return null
  }
}
