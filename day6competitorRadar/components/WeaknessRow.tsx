'use client'

import { Zap } from 'lucide-react'
import { SeverityBadge } from './SeverityBadge'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { Weakness } from '@/types'

export function WeaknessRow({ weakness }: { weakness: Weakness }) {
  return (
    <div className="space-y-3 py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 flex-wrap">
        <SeverityBadge severity={weakness.severity} />
        <ConfidenceBadge level={weakness.confidence} />
      </div>
      <h4 className="font-medium text-[15px] text-foreground">
        {weakness.title}
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {weakness.description}
      </p>
      <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
        <Zap className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground leading-relaxed">
          {weakness.opportunity}
        </p>
      </div>
    </div>
  )
}
