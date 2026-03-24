'use client'

import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { ConfidenceLevel } from '@/types'

interface Props {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export function TargetICPCard({ description, confidence, signals }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-2/15">
            <Users className="h-3.5 w-3.5 text-chart-2" />
          </div>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Target ICP
          </CardTitle>
        </div>
        <CardAction>
          <ConfidenceBadge level={confidence} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[15px] text-foreground leading-relaxed">{description}</p>
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Signals</span>
          <ul className="space-y-1.5">
            {signals.map((signal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chart-2" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
