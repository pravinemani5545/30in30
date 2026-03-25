'use client'

interface WaveformVisualiserProps {
  frequencyData: Uint8Array | null
  isRecording: boolean
}

export function WaveformVisualiser({
  frequencyData,
  isRecording,
}: WaveformVisualiserProps) {
  const bars = 32

  return (
    <div className="flex h-12 w-full items-end justify-center gap-1">
      {Array.from({ length: bars }).map((_, i) => {
        const value = frequencyData && isRecording ? frequencyData[i] ?? 0 : 0
        const normalised = value / 255
        const height = Math.max(2, normalised * 48)
        const isPeak = normalised > 0.8

        return (
          <div
            key={i}
            className="w-1.5 rounded-full transition-all duration-75"
            style={{
              height: `${height}px`,
              backgroundColor: isPeak
                ? 'var(--recording-active)'
                : 'var(--accent)',
              opacity: isRecording ? 1 : 0.3,
            }}
          />
        )
      })}
    </div>
  )
}
