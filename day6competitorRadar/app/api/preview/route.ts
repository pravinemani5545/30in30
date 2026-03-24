import { NextRequest, NextResponse } from 'next/server'
import { fetchPreview } from '@/lib/scraper/preview'
import { urlSchema } from '@/lib/validations/url'

// In-memory rate limit: 20/hour/IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
  }

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  const parseResult = urlSchema.safeParse(url)
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0]
    return NextResponse.json(
      { error: issue?.message || 'Invalid URL' },
      { status: 400 }
    )
  }

  const preview = await fetchPreview(parseResult.data)
  if (!preview) {
    return NextResponse.json(
      { error: "Couldn't reach that domain. Double-check the URL." },
      { status: 422 }
    )
  }

  return NextResponse.json(preview)
}
