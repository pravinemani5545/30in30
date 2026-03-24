'use client'

import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { ConfidenceLevel } from '@/types'

interface Props {
  statement: string
  confidence: ConfidenceLevel
  evidence: string
}

export function ValuePropCard({ statement, confidence, evidence }: Props) {
  return (
    <Card className="border-l-2 border-l-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Value Proposition
          </CardTitle>
        </div>
        <CardAction>
          <ConfidenceBadge level={confidence} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[15px] text-foreground leading-relaxed">{statement}</p>
        <div className="rounded-md border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Evidence</span>
          <p className="text-sm text-muted-foreground leading-relaxed">{evidence}</p>
        </div>
      </CardContent>
    </Card>
  )
}
