'use client'

import { useState, useCallback } from 'react'
import type { TranscribeResponse } from '@/types'

interface UseTranscribeReturn {
  transcribe: (audioBlob: Blob) => Promise<TranscribeResponse | null>
  isTranscribing: boolean
  error: string | null
}

export function useTranscribe(): UseTranscribeReturn {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transcribe = useCallback(async (audioBlob: Blob): Promise<TranscribeResponse | null> => {
    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Transcription failed (${response.status})`)
      }

      const data: TranscribeResponse = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transcription failed'
      setError(message)
      return null
    } finally {
      setIsTranscribing(false)
    }
  }, [])

  return { transcribe, isTranscribing, error }
}
