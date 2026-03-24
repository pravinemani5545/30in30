'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Loader2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://competitor.com"
            className="h-11 pl-9 bg-background text-foreground"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!url || isLoading}
          className="h-11 px-5 gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Analyse
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {previewLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading preview...
        </div>
      )}

      {preview && !previewLoading && <UrlPreviewCard preview={preview} />}
    </div>
  )
}
