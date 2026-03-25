'use client'

import { Loader2, Sparkles } from 'lucide-react'
import type { ProcessingStep } from '@/types/day7'

interface ProcessingStatusProps {
  step: ProcessingStep
  wordCount?: number
  audioDuration?: number
  audioSize?: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ProcessingStatus({
  step,
  wordCount,
  audioDuration,
  audioSize,
}: ProcessingStatusProps) {
  if (step === 'editing' || step === 'complete') return null

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      {step === 'transcribing' && (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-[var(--processing-transcribe)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Transcribing audio...
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {audioDuration ? `${Math.round(audioDuration)}s` : ''}
              {audioSize ? ` · ${formatBytes(audioSize)}` : ''}
            </p>
          </div>
        </>
      )}
      {step === 'generating' && (
        <>
          <Sparkles className="h-5 w-5 text-[var(--processing-generate)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Generating blog post...
            </p>
            {wordCount !== undefined && wordCount > 0 && (
              <p className="text-xs text-[var(--text-secondary)]">
                {wordCount} words so far
              </p>
            )}
          </div>
        </>
      )}
      {step === 'error' && (
        <>
          <div className="h-5 w-5 rounded-full bg-[var(--error)] text-center text-xs leading-5 text-white">
            !
          </div>
          <p className="text-sm text-[var(--error)]">Something went wrong</p>
        </>
      )}
    </div>
  )
}
