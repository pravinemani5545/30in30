'use client'

import { ConfidenceBadge } from './ConfidenceBadge'
import type { ConfidenceLevel } from '@/types'

interface Props {
  statement: string
  confidence: ConfidenceLevel
  evidence: string
}

export function ValuePropCard({ statement, confidence, evidence }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4 border-l-2 border-l-accent">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
          Value Proposition
        </span>
        <ConfidenceBadge level={confidence} />
      </div>
      <p className="text-[15px] text-text-primary leading-relaxed">{statement}</p>
      <div className="space-y-1">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Evidence:</span>
        <p className="text-sm text-text-secondary leading-relaxed">{evidence}</p>
      </div>
    </div>
  )
}
