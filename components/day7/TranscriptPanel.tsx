'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface TranscriptPanelProps {
  transcript: string
  onChange: (text: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function TranscriptPanel({
  transcript,
  onChange,
  onGenerate,
  isGenerating,
}: TranscriptPanelProps) {
  const charCount = transcript.length
  const wordCount = transcript.trim().split(/\s+/).filter((w) => w.length > 0).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Transcript
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {wordCount} words · {charCount} chars
        </span>
      </div>
      <Textarea
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="resize-none border-[var(--border)] bg-[var(--surface-input)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        placeholder="Your transcript will appear here..."
      />
      <p className="text-xs text-[var(--text-tertiary)]">
        Review and edit the transcript before generating your blog post.
      </p>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || transcript.length < 50}
        className="w-full bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
      >
        {isGenerating ? 'Generating...' : 'Generate Post →'}
      </Button>
    </div>
  )
}
