'use client'

import { AlertTriangle } from 'lucide-react'
import type { RenderMethod } from '@/types'

export function ExtractionMethodBanner({ method }: { method: RenderMethod }) {
  if (method !== 'static_only') return null

  return (
    <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent-muted px-4 py-2.5 text-sm text-accent">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>Static extraction used — JS-rendered content may be missing.</span>
    </div>
  )
}
