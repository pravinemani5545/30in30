'use client'

import type { ConfidenceLevel } from '@/types'

const config: Record<ConfidenceLevel, { label: string; className: string }> = {
  high: { label: 'HIGH', className: 'bg-confidence-high/15 text-confidence-high' },
  mid: { label: 'MID', className: 'bg-confidence-mid/15 text-confidence-mid' },
  low: { label: 'LOW', className: 'bg-confidence-low/15 text-confidence-low' },
}

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const { label, className } = config[level]
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium tracking-wide ${className}`}>
      {label}
    </span>
  )
}
