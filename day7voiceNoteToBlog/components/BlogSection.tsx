'use client'

import { Badge } from '@/components/ui/badge'
import { StreamingCursor } from './StreamingCursor'

interface BlogSectionProps {
  label: string
  content: string
  isActive: boolean
  variant?: 'headline' | 'intro' | 'body' | 'conclusion' | 'pullquote'
}

export function BlogSection({
  label,
  content,
  isActive,
  variant = 'body',
}: BlogSectionProps) {
  if (variant === 'headline') {
    return (
      <div className="mb-6">
        <Badge
          variant="outline"
          className="mb-2 border-[var(--accent)]/30 text-[10px] uppercase tracking-widest text-[var(--accent)]"
        >
          {label}
        </Badge>
        <h1 className="font-display text-4xl leading-tight text-[var(--text-primary)]">
          {content}
          {isActive && <StreamingCursor />}
        </h1>
      </div>
    )
  }

  if (variant === 'pullquote') {
    return (
      <blockquote className="my-6 border-l-2 border-[var(--pullquote)] pl-4">
        <Badge
          variant="outline"
          className="mb-2 border-[var(--pullquote)]/30 text-[10px] uppercase tracking-widest text-[var(--pullquote)]"
        >
          {label}
        </Badge>
        <p className="font-display text-xl italic leading-relaxed text-[var(--text-primary)]/80">
          &ldquo;{content}&rdquo;
          {isActive && <StreamingCursor />}
        </p>
      </blockquote>
    )
  }

  const borderColor =
    variant === 'intro'
      ? 'var(--accent)'
      : variant === 'conclusion'
        ? 'var(--success)'
        : 'var(--text-primary)'

  return (
    <div className="my-4 border-l-2 pl-4" style={{ borderColor }}>
      <Badge
        variant="outline"
        className="mb-2 border-[var(--border)] text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
      >
        {label}
      </Badge>
      <div className="text-base leading-7 text-[var(--text-primary)] whitespace-pre-wrap">
        {content}
        {isActive && <StreamingCursor />}
      </div>
    </div>
  )
}
