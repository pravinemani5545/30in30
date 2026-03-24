'use client'

import { Crosshair } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Crosshair className="h-12 w-12 text-text-tertiary mb-4" />
      <h2 className="font-display text-2xl text-text-primary mb-2">
        No analysis yet
      </h2>
      <p className="text-text-secondary max-w-md">
        Enter a competitor&apos;s URL above to get a strategic teardown of their
        positioning, pricing, and exploitable weaknesses.
      </p>
    </div>
  )
}
