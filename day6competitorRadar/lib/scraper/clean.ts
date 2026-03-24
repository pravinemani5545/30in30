import * as cheerio from 'cheerio'
import type { ExtractedContent, ExtractionQuality, RenderMethod } from '@/types'

export function cleanHtml(
  html: string,
  url: string,
  renderMethod: RenderMethod
): ExtractedContent {
  const $ = cheerio.load(html)
  const parsedUrl = new URL(url)
  const domain = parsedUrl.hostname.replace(/^www\./, '')

  // Extract OG metadata before cleaning
  const ogTitle = $('meta[property="og:title"]').attr('content') ||
    $('title').text() || null
  const ogDescription = $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') || null
  const ogImage = $('meta[property="og:image"]').attr('content') || null
  const faviconUrl = $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    `https://${domain}/favicon.ico`

  // Resolve relative favicon URL
  const resolvedFavicon = faviconUrl.startsWith('http')
    ? faviconUrl
    : `${parsedUrl.origin}${faviconUrl.startsWith('/') ? '' : '/'}${faviconUrl}`

  // Step 2: Remove noise
  $('script, style, noscript, iframe, svg, img, video, audio').remove()
  $('nav, header, footer, aside').remove()
  $('[aria-hidden="true"]').remove()
  $('*[style*="display:none"], *[style*="display: none"]').remove()
  $('.cookie, .gdpr, .consent, .notice, .banner, .overlay, .popup, .modal').remove()

  // Step 3: Extract structured sections
  const sections: string[] = []

  // HERO
  const h1 = $('h1').first().text().trim()
  const firstH2 = $('h2').first().text().trim()
  const firstLongP = $('p').toArray()
    .map(el => $(el).text().trim())
    .find(text => text.length > 50)
  const heroContent = [h1, firstH2, firstLongP].filter(Boolean).join('\n')
  if (heroContent) sections.push(`=== HERO ===\n${heroContent}`)

  // FEATURES
  const featureTexts: string[] = []
  $('h2, h3').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 200) featureTexts.push(text)
  })
  $('ul li').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length > 10 && text.length < 300) featureTexts.push(`- ${text}`)
  })
  if (featureTexts.length > 0) {
    sections.push(`=== FEATURES ===\n${featureTexts.slice(0, 20).join('\n')}`)
  }

  // SOCIAL PROOF
  const proofTexts: string[] = []
  $('blockquote').each((_, el) => {
    const text = $(el).text().trim()
    if (text) proofTexts.push(`"${text}"`)
  })
  $('[class*="testimonial"], [class*="quote"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length > 20) proofTexts.push(`"${text}"`)
  })
  if (proofTexts.length > 0) {
    sections.push(`=== SOCIAL PROOF ===\n${proofTexts.slice(0, 5).join('\n')}`)
  }

  // PRICING
  const pricingTexts: string[] = []
  $('[class*="pricing"], [class*="price"], [class*="plan"], [id*="pricing"], [id*="price"]').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ')
    if (text && text.length > 10) pricingTexts.push(text)
  })
  // Look for price patterns anywhere
  $('*').each((_, el) => {
    const text = $(el).text().trim()
    if (/\$\d+/.test(text) && text.length < 200) {
      pricingTexts.push(text)
    }
  })
  if (pricingTexts.length > 0) {
    const uniquePricing = [...new Set(pricingTexts)].slice(0, 10)
    sections.push(`=== PRICING ===\n${uniquePricing.join('\n')}`)
  }

  // ABOUT / MISSION
  const aboutTexts: string[] = []
  $('*').each((_, el) => {
    const text = $(el).text().trim()
    if (
      (text.toLowerCase().includes('built for') ||
       text.toLowerCase().includes('our mission') ||
       text.toLowerCase().includes('we believe')) &&
      text.length > 30 && text.length < 500
    ) {
      aboutTexts.push(text)
    }
  })
  if (aboutTexts.length > 0) {
    sections.push(`=== ABOUT ===\n${[...new Set(aboutTexts)].slice(0, 3).join('\n')}`)
  }

  // Step 4: Format
  let cleanedText = sections.join('\n\n')

  // Step 5: Truncate at 8000 chars
  if (cleanedText.length > 8000) {
    const lastSection = cleanedText.lastIndexOf('===', 8000)
    if (lastSection > 0) {
      cleanedText = cleanedText.substring(0, lastSection) + '\n[Content truncated]'
    } else {
      cleanedText = cleanedText.substring(0, 8000) + '\n[Content truncated]'
    }
  }

  // Step 6: Quality assessment
  const wordCount = cleanedText.split(/\s+/).filter(Boolean).length
  let extractionQuality: ExtractionQuality
  if (wordCount > 500) {
    extractionQuality = 'rich'
  } else if (wordCount >= 200) {
    extractionQuality = 'partial'
  } else {
    extractionQuality = 'minimal'
  }

  return {
    url,
    domain,
    faviconUrl: resolvedFavicon,
    ogTitle,
    ogDescription,
    ogImage,
    cleanedText,
    wordCount,
    extractionQuality,
    renderMethod,
  }
}
