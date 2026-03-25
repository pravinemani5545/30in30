'use client'

import { Globe, ExternalLink } from 'lucide-react'
import type { PreviewResponse } from '@/types/day6'

export function UrlPreviewCard({ preview }: { preview: PreviewResponse }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/50">
      {preview.faviconUrl ? (
        <img
          src={preview.faviconUrl}
          alt=""
          className="h-6 w-6 rounded shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
      ) : null}
      <Globe className={`h-6 w-6 text-muted-foreground shrink-0 ${preview.faviconUrl ? 'hidden' : ''}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {preview.title || preview.domain}
        </p>
        {preview.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{preview.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground font-mono">{preview.domain}</span>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  )
}
