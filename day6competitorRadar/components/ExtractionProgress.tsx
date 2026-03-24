'use client'

import { Check, Loader2 } from 'lucide-react'
import type { AnalyzeProgressStep } from '@/types'

export function ExtractionProgress({ steps }: { steps: AnalyzeProgressStep[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
        Extraction Progress
      </span>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.status === 'complete' ? (
              <Check className="h-4 w-4 text-confidence-high shrink-0" />
            ) : step.status === 'active' ? (
              <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" />
            ) : step.status === 'skipped' ? (
              <div className="h-4 w-4 rounded-full border border-text-tertiary flex items-center justify-center shrink-0">
                <span className="text-[8px] text-text-tertiary">-</span>
              </div>
            ) : (
              <div className="h-4 w-4 rounded-full border border-border shrink-0" />
            )}
            <span className={`text-sm ${
              step.status === 'active'
                ? 'text-text-primary'
                : step.status === 'complete'
                ? 'text-text-secondary'
                : step.status === 'skipped'
                ? 'text-text-tertiary line-through'
                : 'text-text-tertiary'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
