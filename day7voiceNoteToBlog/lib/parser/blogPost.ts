import type { BlogPostSections } from '@/types'

const SECTION_MARKERS = [
  '[HEADLINE]',
  '[INTRO]',
  '[SECTION:1]',
  '[SECTION:2]',
  '[SECTION:3]',
  '[CONCLUSION]',
  '[PULLQUOTE:1]',
  '[PULLQUOTE:2]',
  '[PULLQUOTE:3]',
] as const

type MarkerKey =
  | 'headline'
  | 'intro'
  | 'section1'
  | 'section2'
  | 'section3'
  | 'conclusion'
  | 'pullquote1'
  | 'pullquote2'
  | 'pullquote3'

const MARKER_TO_KEY: Record<string, MarkerKey> = {
  '[HEADLINE]': 'headline',
  '[INTRO]': 'intro',
  '[SECTION:1]': 'section1',
  '[SECTION:2]': 'section2',
  '[SECTION:3]': 'section3',
  '[CONCLUSION]': 'conclusion',
  '[PULLQUOTE:1]': 'pullquote1',
  '[PULLQUOTE:2]': 'pullquote2',
  '[PULLQUOTE:3]': 'pullquote3',
}

export function parseStreamingBlogPost(
  completion: string
): Partial<BlogPostSections> {
  const sections: Partial<BlogPostSections> = {}

  const positions: Array<{ marker: string; index: number; key: MarkerKey }> = []

  for (const marker of SECTION_MARKERS) {
    const index = completion.indexOf(marker)
    if (index !== -1) {
      positions.push({ marker, index, key: MARKER_TO_KEY[marker] })
    }
  }

  positions.sort((a, b) => a.index - b.index)

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i]
    const contentStart = current.index + current.marker.length
    const contentEnd =
      i + 1 < positions.length ? positions[i + 1].index : completion.length
    const content = completion.slice(contentStart, contentEnd).trim()
    if (content) {
      sections[current.key] = content
    }
  }

  return sections
}

export function assembleFullText(sections: BlogPostSections): string {
  const parts: string[] = []

  if (sections.headline) {
    parts.push(`# ${sections.headline}`)
    parts.push('')
  }
  if (sections.intro) {
    parts.push(sections.intro)
    parts.push('')
  }
  if (sections.section1) {
    parts.push(sections.section1)
    parts.push('')
  }
  if (sections.pullquote1) {
    parts.push(`> "${sections.pullquote1}"`)
    parts.push('')
  }
  if (sections.section2) {
    parts.push(sections.section2)
    parts.push('')
  }
  if (sections.pullquote2) {
    parts.push(`> "${sections.pullquote2}"`)
    parts.push('')
  }
  if (sections.section3) {
    parts.push(sections.section3)
    parts.push('')
  }
  if (sections.pullquote3) {
    parts.push(`> "${sections.pullquote3}"`)
    parts.push('')
  }
  if (sections.conclusion) {
    parts.push(sections.conclusion)
  }

  return parts.join('\n')
}

export function hasInsufficientContent(completion: string): boolean {
  return completion.includes('[ERROR: insufficient_content]')
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}
