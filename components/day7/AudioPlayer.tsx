'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AudioPlayerProps {
  src: string
  duration: number
  onReRecord: () => void
  onTranscribe: () => void
  isTranscribing: boolean
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({
  src,
  duration,
  onReRecord,
  onTranscribe,
  isTranscribing,
}: AudioPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <audio src={src} controls className="flex-1 h-10" />
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {formatTime(duration)}
        </span>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReRecord}
          className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Re-record
        </Button>
        <Button
          size="sm"
          onClick={onTranscribe}
          disabled={isTranscribing}
          className="flex-1 bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
        >
          {isTranscribing ? 'Transcribing...' : 'Transcribe →'}
        </Button>
      </div>
    </div>
  )
}
