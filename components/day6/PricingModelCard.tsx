'use client'

import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { ConfidenceLevel } from '@/types/day6'

interface Props {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export function PricingModelCard({ description, confidence, signals }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-3/15">
            <DollarSign className="h-3.5 w-3.5 text-chart-3" />
          </div>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Pricing Model
          </CardTitle>
        </div>
        <CardAction>
          <ConfidenceBadge level={confidence} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[15px] text-foreground leading-relaxed">{description}</p>
        {confidence === 'low' && (
          <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs text-primary">
              Pricing not public — likely enterprise / sales-led
            </p>
          </div>
        )}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Signals</span>
          <ul className="space-y-1.5">
            {signals.map((signal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chart-3" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
