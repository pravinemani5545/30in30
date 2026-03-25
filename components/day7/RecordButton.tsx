'use client'

import { Mic, Square, Loader2 } from 'lucide-react'
import type { RecordingState } from '@/types/day7'

interface RecordButtonProps {
  state: RecordingState
  onStart: () => void
  onStop: () => void
}

export function RecordButton({ state, onStart, onStop }: RecordButtonProps) {
  const isRecording = state === 'recording'
  const isProcessing = state === 'requesting-permission' || state === 'stopping'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-[var(--recording-active)]" />
        )}
        <button
          onClick={isRecording ? onStop : onStart}
          disabled={isProcessing}
          className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all ${
            isRecording
              ? 'bg-[var(--recording-active)] text-white'
              : isProcessing
                ? 'border-2 border-[var(--border)] bg-[var(--surface)]'
                : 'border-2 border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent-muted)]'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin text-[var(--text-secondary)]" />
          ) : isRecording ? (
            <Square className="h-8 w-8" fill="currentColor" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
        {isRecording ? 'Stop' : isProcessing ? 'Processing...' : 'Record'}
      </span>
    </div>
  )
}
