'use client'

import { WeaknessRow } from './WeaknessRow'
import type { Weakness } from '@/types'

export function WeaknessesCard({ weaknesses }: { weaknesses: Weakness[] }) {
  const highestSeverity = weaknesses.some(w => w.severity === 'high')
    ? 'high'
    : weaknesses.some(w => w.severity === 'medium')
    ? 'medium'
    : 'low'

  const borderColor = highestSeverity === 'high'
    ? 'border-l-severity-high'
    : highestSeverity === 'medium'
    ? 'border-l-severity-medium'
    : 'border-l-severity-low'

  return (
    <div className={`col-span-full rounded-lg border border-border bg-surface p-6 space-y-4 border-l-2 ${borderColor}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-severity-high">
        Exploitable Weaknesses
      </span>
      <div className="divide-y divide-border">
        {weaknesses.map((weakness, i) => (
          <WeaknessRow key={i} weakness={weakness} />
        ))}
      </div>
    </div>
  )
}
