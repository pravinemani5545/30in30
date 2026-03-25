'use client'

import { cn } from '@/lib/utils'
import type { ConfidenceLevel } from '@/types/day6'

const config: Record<ConfidenceLevel, { label: string; dot: string; text: string; bg: string }> = {
  high: {
    label: 'High confidence',
    dot: 'bg-confidence-high',
    text: 'text-confidence-high',
    bg: 'bg-confidence-high/10',
  },
  mid: {
    label: 'Mid confidence',
    dot: 'bg-confidence-mid',
    text: 'text-confidence-mid',
    bg: 'bg-confidence-mid/10',
  },
  low: {
    label: 'Low confidence',
    dot: 'bg-confidence-low',
    text: 'text-confidence-low',
    bg: 'bg-confidence-low/10',
  },
}

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const c = config[level]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase', c.bg, c.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  )
}
