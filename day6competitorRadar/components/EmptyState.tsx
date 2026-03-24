'use client'

import { Crosshair, ArrowUp } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
          <Crosshair className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <ArrowUp className="h-3 w-3 text-primary-foreground" />
        </div>
      </div>
      <h2 className="font-display text-2xl text-foreground mb-2">
        Ready to analyse
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Paste a competitor&apos;s URL above to get a strategic teardown of their
        positioning, pricing, and exploitable weaknesses.
      </p>
    </div>
  )
}
