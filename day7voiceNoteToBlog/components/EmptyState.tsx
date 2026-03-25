'use client'

import { FileText } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
        <FileText className="h-8 w-8 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="font-display text-xl text-[var(--text-primary)]">
        Your blog post will appear here
      </h3>
      <p className="max-w-sm text-sm text-[var(--text-secondary)]">
        Record a voice memo or upload audio, review the transcript, then generate
        a structured blog post — streamed word by word.
      </p>
    </div>
  )
}
