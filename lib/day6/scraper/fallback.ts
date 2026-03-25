export async function fetchStatic(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    // Check content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return null
    }

    // Check content length (2MB limit)
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
      return null
    }

    const html = await response.text()
    controller.abort()
    return html
  } catch {
    return null
  }
}
