'use client'

import { SeverityBadge } from './SeverityBadge'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { Weakness } from '@/types'

export function WeaknessRow({ weakness }: { weakness: Weakness }) {
  return (
    <div className="space-y-2 py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 flex-wrap">
        <SeverityBadge severity={weakness.severity} />
        <ConfidenceBadge level={weakness.confidence} />
      </div>
      <h4 className={`font-semibold text-[15px] ${
        weakness.severity === 'high'
          ? 'text-severity-high'
          : weakness.severity === 'medium'
          ? 'text-severity-medium'
          : 'text-severity-low'
      }`}>
        {weakness.title}
      </h4>
      <p className="text-[15px] text-text-secondary leading-relaxed">
        {weakness.description}
      </p>
      <p className="text-[15px]">
        <span className="text-accent font-medium">Your opportunity: </span>
        <span className="text-text-primary">{weakness.opportunity}</span>
      </p>
    </div>
  )
}
