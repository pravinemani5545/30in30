'use client'

import { Clock, Trash2 } from 'lucide-react'
import type { VoicePostSummary } from '@/types/day7'
import { Skeleton } from '@/components/ui/skeleton'

interface HistorySidebarProps {
  posts: VoicePostSummary[]
  isLoading: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  selectedId: string | null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function HistorySidebar({
  posts,
  isLoading,
  onSelect,
  onDelete,
  selectedId,
}: HistorySidebarProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <Clock className="h-8 w-8 text-[var(--text-tertiary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No posts yet</p>
        <p className="text-xs text-[var(--text-tertiary)]">
          Record a voice memo to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1 p-2">
      <p className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
        History
      </p>
      {posts.map((post) => (
        <div
          key={post.id}
          className={`group flex cursor-pointer items-start justify-between rounded-lg px-3 py-2 transition-colors ${
            selectedId === post.id
              ? 'bg-[var(--accent-muted)]'
              : 'hover:bg-[var(--surface-raised)]'
          }`}
          onClick={() => onSelect(post.id)}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-[var(--text-primary)]">
              {post.post_headline || 'Untitled post'}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {formatDate(post.created_at)}
              {post.post_word_count ? ` · ${post.post_word_count} words` : ''}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(post.id)
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-3.5 w-3.5 text-[var(--text-tertiary)] hover:text-[var(--error)]" />
          </button>
        </div>
      ))}
    </div>
  )
}
