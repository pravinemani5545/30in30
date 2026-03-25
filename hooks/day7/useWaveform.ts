'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface UseWaveformReturn {
  frequencyData: Uint8Array | null
}

export function useWaveform(stream: MediaStream | null): UseWaveformReturn {
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationRef = useRef<number | null>(null)

  const updateFrequencyData = useCallback(() => {
    if (!analyserRef.current) return

    const data = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(data)
    setFrequencyData(new Uint8Array(data))

    animationRef.current = requestAnimationFrame(updateFrequencyData)
  }, [])

  useEffect(() => {
    if (!stream) {
      setFrequencyData(null)
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 64 // 32 frequency bins
    analyser.smoothingTimeConstant = 0.8

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    animationRef.current = requestAnimationFrame(updateFrequencyData)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      source.disconnect()
      void audioContext.close()
      analyserRef.current = null
      audioContextRef.current = null
    }
  }, [stream, updateFrequencyData])

  return { frequencyData }
}
