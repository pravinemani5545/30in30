'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getUnsupportedBrowserMessage } from '@/lib/browser/detect'

export function BrowserWarning() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setMessage(getUnsupportedBrowserMessage())
  }, [])

  if (!message) return null

  return (
    <div className="flex items-start gap-2 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-muted)] px-4 py-3">
      <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
      <p className="text-sm text-[var(--accent)]">{message}</p>
    </div>
  )
}
