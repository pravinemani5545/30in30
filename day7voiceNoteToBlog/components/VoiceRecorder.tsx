'use client'

import { useRecorder } from '@/hooks/useRecorder'
import { useWaveform } from '@/hooks/useWaveform'
import { useTranscribe } from '@/hooks/useTranscribe'
import { RecordButton } from './RecordButton'
import { WaveformVisualiser } from './WaveformVisualiser'
import { AudioPlayer } from './AudioPlayer'
import { FileUploadInput } from './FileUploadInput'
import { BrowserWarning } from './BrowserWarning'
import { TranscriptPanel } from './TranscriptPanel'
import { ProcessingStatus } from './ProcessingStatus'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'

interface VoiceRecorderProps {
  transcript: string
  onTranscriptChange: (text: string) => void
  onTranscribeComplete: (postId: string, transcript: string, durationS: number) => void
  onGenerate: () => void
  isGenerating: boolean
  hasPost: boolean
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function VoiceRecorder({
  transcript,
  onTranscriptChange,
  onTranscribeComplete,
  onGenerate,
  isGenerating,
  hasPost,
}: VoiceRecorderProps) {
  const {
    state,
    audioBlob,
    audioBlobUrl,
    duration,
    stream,
    startRecording,
    stopRecording,
    clearRecording,
  } = useRecorder()

  const { frequencyData } = useWaveform(stream)
  const { transcribe, isTranscribing, error: transcribeError } = useTranscribe()
  const warnedRef = useRef(false)

  // 9:30 warning
  useEffect(() => {
    if (duration >= 570 && !warnedRef.current) {
      warnedRef.current = true
      toast.warning('Approaching 10-minute limit. Consider stopping soon.')
    }
    if (duration >= 600) {
      stopRecording()
    }
  }, [duration, stopRecording])

  useEffect(() => {
    if (state === 'idle') {
      warnedRef.current = false
    }
  }, [state])

  useEffect(() => {
    if (transcribeError) {
      toast.error(transcribeError)
    }
  }, [transcribeError])

  async function handleStart() {
    try {
      await startRecording()
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          toast.error('Microphone permission denied. Please allow access in your browser settings.')
        } else if (err.name === 'NotFoundError') {
          toast.error('No microphone found. Please connect a microphone.')
        } else {
          toast.error(`Microphone error: ${err.message}`)
        }
      }
    }
  }

  async function handleTranscribe() {
    if (!audioBlob) return
    const result = await transcribe(audioBlob)
    if (result) {
      onTranscribeComplete(result.postId, result.transcript, result.duration_s)
    }
  }

  function handleFileSelect(file: File) {
    // Create a blob from the file and use the same transcription pipeline
    void (async () => {
      const result = await transcribe(file)
      if (result) {
        onTranscribeComplete(result.postId, result.transcript, result.duration_s)
      }
    })()
  }

  const isRecording = state === 'recording'
  const isStopped = state === 'stopped'
  const showTranscript = transcript.length > 0

  return (
    <div className="space-y-6">
      <BrowserWarning />

      {!showTranscript && !hasPost && (
        <>
          <div className="flex flex-col items-center gap-6 py-4">
            <RecordButton
              state={state}
              onStart={handleStart}
              onStop={stopRecording}
            />

            {isRecording && (
              <span className="font-mono text-lg text-[var(--text-primary)]">
                {formatTime(duration)}
              </span>
            )}

            <WaveformVisualiser
              frequencyData={frequencyData}
              isRecording={isRecording}
            />
          </div>

          {isStopped && audioBlobUrl && (
            <AudioPlayer
              src={audioBlobUrl}
              duration={duration}
              onReRecord={clearRecording}
              onTranscribe={handleTranscribe}
              isTranscribing={isTranscribing}
            />
          )}

          {!isStopped && !isRecording && (
            <FileUploadInput onFileSelect={handleFileSelect} />
          )}
        </>
      )}

      {isTranscribing && (
        <ProcessingStatus
          step="transcribing"
          audioDuration={duration}
          audioSize={audioBlob?.size}
        />
      )}

      {showTranscript && !hasPost && (
        <TranscriptPanel
          transcript={transcript}
          onChange={onTranscriptChange}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
        />
      )}
    </div>
  )
}
