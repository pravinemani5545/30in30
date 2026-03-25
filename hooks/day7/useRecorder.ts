'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { RecordingState } from '@/types/day7'

interface UseRecorderReturn {
  state: RecordingState
  audioBlob: Blob | null
  audioBlobUrl: string | null
  duration: number
  stream: MediaStream | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearRecording: () => void
}

export function useRecorder(): UseRecorderReturn {
  const [state, setState] = useState<RecordingState>('idle')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [audioBlobUrl, stream])

  const startRecording = useCallback(async () => {
    try {
      setState('requesting-permission')
      chunksRef.current = []

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      setStream(mediaStream)

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioBlobUrl(url)
        setState('stopped')

        // Stop all tracks
        mediaStream.getTracks().forEach((t) => t.stop())
        setStream(null)

        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start(1000) // Collect data every second
      startTimeRef.current = Date.now()
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)

      setState('recording')
    } catch (error) {
      setState('idle')
      throw error
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setState('stopping')
      mediaRecorderRef.current.stop()
    }
  }, [])

  const clearRecording = useCallback(() => {
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl)
    }
    setAudioBlob(null)
    setAudioBlobUrl(null)
    setDuration(0)
    setState('idle')
    chunksRef.current = []
  }, [audioBlobUrl])

  return {
    state,
    audioBlob,
    audioBlobUrl,
    duration,
    stream,
    startRecording,
    stopRecording,
    clearRecording,
  }
}
