'use client'

import type { WeaknessSeverity } from '@/types'

const config: Record<WeaknessSeverity, { label: string; className: string }> = {
  high: { label: 'CRITICAL', className: 'bg-severity-high/15 text-severity-high' },
  medium: { label: 'MODERATE', className: 'bg-severity-medium/15 text-severity-medium' },
  low: { label: 'MINOR', className: 'bg-severity-low/15 text-severity-low' },
}

export function SeverityBadge({ severity }: { severity: WeaknessSeverity }) {
  const { label, className } = config[severity]
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${className}`}>
      {label}
    </span>
  )
}
