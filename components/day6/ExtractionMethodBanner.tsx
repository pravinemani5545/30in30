'use client'

import { AlertTriangle } from 'lucide-react'
import type { RenderMethod } from '@/types/day6'

export function ExtractionMethodBanner({ method }: { method: RenderMethod }) {
  if (method !== 'static_only') return null

  return (
    <div className="flex items-center gap-3 rounded-lg border border-severity-medium/20 bg-severity-medium/5 px-4 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-severity-medium/15">
        <AlertTriangle className="h-4 w-4 text-severity-medium" />
      </div>
      <div>
        <p className="text-sm font-medium text-severity-medium">Static extraction used</p>
        <p className="text-xs text-muted-foreground">JS-rendered content may be missing from the analysis.</p>
      </div>
    </div>
  )
}
