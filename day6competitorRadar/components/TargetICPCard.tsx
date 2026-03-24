'use client'

import { ConfidenceBadge } from './ConfidenceBadge'
import type { ConfidenceLevel } from '@/types'

interface Props {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export function TargetICPCard({ description, confidence, signals }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
          Target ICP
        </span>
        <ConfidenceBadge level={confidence} />
      </div>
      <p className="text-[15px] text-text-primary leading-relaxed">{description}</p>
      <div className="space-y-2">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">ICP Signals:</span>
        <ul className="space-y-1">
          {signals.map((signal, i) => (
            <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-accent mt-1.5 text-[8px]">&#9679;</span>
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
