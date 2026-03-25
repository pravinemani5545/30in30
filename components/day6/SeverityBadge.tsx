'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { WeaknessSeverity } from '@/types/day6'

const config: Record<WeaknessSeverity, { label: string; icon: typeof AlertTriangle; text: string; bg: string }> = {
  high: {
    label: 'Critical',
    icon: AlertTriangle,
    text: 'text-severity-high',
    bg: 'bg-severity-high/10',
  },
  medium: {
    label: 'Moderate',
    icon: AlertCircle,
    text: 'text-severity-medium',
    bg: 'bg-severity-medium/10',
  },
  low: {
    label: 'Minor',
    icon: Info,
    text: 'text-severity-low',
    bg: 'bg-severity-low/10',
  },
}

export function SeverityBadge({ severity }: { severity: WeaknessSeverity }) {
  const c = config[severity]
  const Icon = c.icon
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase', c.bg, c.text)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  )
}
