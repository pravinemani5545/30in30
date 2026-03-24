import { z } from 'zod'
import dns from 'dns/promises'
import net from 'net'

const BLOCKED_DOMAINS = [
  'twitter.com', 'x.com', 'instagram.com', 'facebook.com',
  'linkedin.com', 'tiktok.com', 'youtube.com', 'reddit.com', 'pinterest.com',
]

const BLOCKED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.zip', '.xls', '.xlsx',
  '.png', '.jpg', '.jpeg', '.gif',
]

const PRIVATE_IP_RANGES = [
  { start: '10.0.0.0', end: '10.255.255.255' },
  { start: '172.16.0.0', end: '172.31.255.255' },
  { start: '192.168.0.0', end: '192.168.255.255' },
  { start: '127.0.0.0', end: '127.255.255.255' },
  { start: '169.254.0.0', end: '169.254.255.255' },
  { start: '0.0.0.0', end: '0.255.255.255' },
]

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
}

export function isPrivateIP(ip: string): boolean {
  if (ip === '::1') return true
  if (!net.isIPv4(ip)) return false
  const ipLong = ipToLong(ip)
  return PRIVATE_IP_RANGES.some(range =>
    ipLong >= ipToLong(range.start) && ipLong <= ipToLong(range.end)
  )
}

export const urlSchema = z.string()
  .url('That doesn\'t look like a competitor URL. Paste their full website address.')
  .refine(
    url => url.startsWith('http'),
    'URL must start with http:// or https://'
  )
  .refine(
    url => {
      try {
        const hostname = new URL(url).hostname
        return !BLOCKED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`))
      } catch {
        return false
      }
    },
    'Paste their product website, not their social media page.'
  )
  .refine(
    url => {
      const lower = url.toLowerCase()
      return !BLOCKED_EXTENSIONS.some(ext => lower.endsWith(ext))
    },
    'That\'s a file link — paste their landing page URL instead.'
  )
  .transform(url => {
    const u = new URL(url)
    ;['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'ref']
      .forEach(p => u.searchParams.delete(p))
    return u.toString()
  })

export async function validateUrlServerSide(url: string): Promise<{ valid: true; ip: string } | { valid: false; error: string }> {
  const parsed = new URL(url)

  // Block non-standard ports
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { valid: false, error: "That URL isn't a public website." }
  }

  try {
    const { address } = await dns.lookup(parsed.hostname)
    if (isPrivateIP(address)) {
      return { valid: false, error: "That URL isn't a public website." }
    }
    return { valid: true, ip: address }
  } catch {
    return { valid: false, error: "Couldn't reach that domain. Double-check the URL." }
  }
}
