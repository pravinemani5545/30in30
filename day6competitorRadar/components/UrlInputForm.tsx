'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { UrlPreviewCard } from './UrlPreviewCard'
import type { PreviewResponse } from '@/types'

interface Props {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export function UrlInputForm({ onSubmit, isLoading }: Props) {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = useCallback(async (inputUrl: string) => {
    if (!inputUrl || !inputUrl.startsWith('http')) {
      setPreview(null)
      return
    }

    setPreviewLoading(true)
    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(inputUrl)}`)
      if (res.ok) {
        const data = await res.json()
        setPreview(data)
        setError(null)
      } else {
        const errData = await res.json()
        setError(errData.error || null)
        setPreview(null)
      }
    } catch {
      setPreview(null)
    } finally {
      setPreviewLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.length > 10) fetchPreview(url)
    }, 500)
    return () => clearTimeout(timer)
  }, [url, fetchPreview])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url || isLoading) return
    setError(null)
    onSubmit(url)
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a competitor's URL..."
            className="w-full rounded-lg border border-border bg-surface-input px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none"
            disabled={isLoading}
          />
          <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-accent transition-all duration-300 focus-within:w-full" />
        </div>
        <button
          type="submit"
          disabled={!url || isLoading}
          className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Analyse
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      {previewLoading && (
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading preview...
        </div>
      )}

      {preview && !previewLoading && <UrlPreviewCard preview={preview} />}
    </div>
  )
}
