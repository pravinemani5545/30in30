'use client'

import { Globe } from 'lucide-react'
import type { PreviewResponse } from '@/types'

export function UrlPreviewCard({ preview }: { preview: PreviewResponse }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      {preview.faviconUrl ? (
        <img
          src={preview.faviconUrl}
          alt=""
          className="h-5 w-5 rounded shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
      ) : null}
      <Globe className={`h-5 w-5 text-text-tertiary shrink-0 ${preview.faviconUrl ? 'hidden' : ''}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate">
          {preview.title || preview.domain}
        </p>
        {preview.description && (
          <p className="text-xs text-text-tertiary truncate">{preview.description}</p>
        )}
      </div>
      <span className="text-xs text-text-tertiary font-mono shrink-0">{preview.domain}</span>
    </div>
  )
}
