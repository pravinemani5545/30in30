'use client'

import { BlogSection } from './BlogSection'
import { Badge } from '@/components/ui/badge'
import type { BlogPostSections } from '@/types'
import { countWords } from '@/lib/parser/blogPost'

interface BlogPostRendererProps {
  sections: Partial<BlogPostSections>
  isStreaming: boolean
  completion: string
  fabricationWarning: boolean
  insufficientContent: boolean
}

export function BlogPostRenderer({
  sections,
  isStreaming,
  completion,
  fabricationWarning,
  insufficientContent,
}: BlogPostRendererProps) {
  if (insufficientContent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="h-12 w-12 rounded-full border border-[var(--error)]/30 bg-[var(--error)]/10 flex items-center justify-center">
          <span className="text-[var(--error)] text-lg">!</span>
        </div>
        <p className="text-center text-sm text-[var(--text-secondary)]">
          The recording didn&apos;t contain enough content to generate a post.
          <br />
          Try recording at least 1 minute of clear speech.
        </p>
      </div>
    )
  }

  if (!completion) return null

  const wordCount = countWords(completion)
  const readTime = Math.max(1, Math.round(wordCount / 250))

  // Determine which section is currently being streamed
  const sectionKeys = [
    'headline',
    'intro',
    'section1',
    'section2',
    'section3',
    'conclusion',
    'pullquote1',
    'pullquote2',
    'pullquote3',
  ] as const

  const lastActiveKey = sectionKeys.reduce<string | null>((last, key) => {
    if (sections[key]) return key
    return last
  }, null)

  return (
    <div className="space-y-2">
      {!isStreaming && wordCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="outline"
            className="border-[var(--success)]/30 text-[var(--success)] text-xs"
          >
            ~{wordCount.toLocaleString()} words · ~{readTime} min read
          </Badge>
          {fabricationWarning && (
            <Badge
              variant="outline"
              className="border-[var(--accent)]/30 text-[var(--accent)] text-xs"
            >
              Review: post is significantly longer than transcript
            </Badge>
          )}
        </div>
      )}

      {sections.headline && (
        <BlogSection
          label="Headline"
          content={sections.headline}
          isActive={isStreaming && lastActiveKey === 'headline'}
          variant="headline"
        />
      )}

      {sections.intro && (
        <BlogSection
          label="Intro"
          content={sections.intro}
          isActive={isStreaming && lastActiveKey === 'intro'}
          variant="intro"
        />
      )}

      {sections.section1 && (
        <BlogSection
          label="Section 1"
          content={sections.section1}
          isActive={isStreaming && lastActiveKey === 'section1'}
          variant="body"
        />
      )}

      {sections.pullquote1 && !isStreaming && (
        <BlogSection
          label="Pull Quote"
          content={sections.pullquote1}
          isActive={false}
          variant="pullquote"
        />
      )}

      {sections.section2 && (
        <BlogSection
          label="Section 2"
          content={sections.section2}
          isActive={isStreaming && lastActiveKey === 'section2'}
          variant="body"
        />
      )}

      {sections.pullquote2 && !isStreaming && (
        <BlogSection
          label="Pull Quote"
          content={sections.pullquote2}
          isActive={false}
          variant="pullquote"
        />
      )}

      {sections.section3 && (
        <BlogSection
          label="Section 3"
          content={sections.section3}
          isActive={isStreaming && lastActiveKey === 'section3'}
          variant="body"
        />
      )}

      {sections.pullquote3 && !isStreaming && (
        <BlogSection
          label="Pull Quote"
          content={sections.pullquote3}
          isActive={false}
          variant="pullquote"
        />
      )}

      {sections.conclusion && (
        <BlogSection
          label="Conclusion"
          content={sections.conclusion}
          isActive={isStreaming && lastActiveKey === 'conclusion'}
          variant="conclusion"
        />
      )}
    </div>
  )
}
