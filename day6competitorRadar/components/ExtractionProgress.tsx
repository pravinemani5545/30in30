'use client'

import { Check, Loader2, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyzeProgressStep } from '@/types'

export function ExtractionProgress({ steps }: { steps: AnalyzeProgressStep[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Extraction Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                step.status === 'complete' && 'bg-success/15',
                step.status === 'active' && 'bg-primary/15',
                step.status === 'skipped' && 'bg-muted',
                step.status === 'pending' && 'bg-muted',
              )}>
                {step.status === 'complete' ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : step.status === 'active' ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                ) : step.status === 'skipped' ? (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground">{i + 1}</span>
                )}
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute ml-3 mt-10 h-3 w-px bg-border" />
              )}

              {/* Label */}
              <span className={cn(
                'text-sm',
                step.status === 'active' && 'text-foreground font-medium',
                step.status === 'complete' && 'text-muted-foreground',
                step.status === 'skipped' && 'text-muted-foreground line-through',
                step.status === 'pending' && 'text-muted-foreground',
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
