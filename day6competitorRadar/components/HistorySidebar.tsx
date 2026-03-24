'use client'

import { useEffect, useState } from 'react'
import { Globe, Trash2 } from 'lucide-react'
import { SeverityBadge } from './SeverityBadge'
import type { CompetitorAnalysisSummary, Weakness } from '@/types'

interface Props {
  onSelect: (id: string) => void
  selectedId: string | null
  refreshTrigger: number
}

export function HistorySidebar({ onSelect, selectedId, refreshTrigger }: Props) {
  const [analyses, setAnalyses] = useState<CompetitorAnalysisSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/analyses')
        if (res.ok) {
          const data = await res.json()
          setAnalyses(data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [refreshTrigger])

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    await fetch(`/api/analyses/${id}`, { method: 'DELETE' })
    setAnalyses(prev => prev.filter(a => a.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
          History
        </span>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-lg bg-surface animate-pulse" />
        ))}
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
          History
        </span>
        <p className="text-sm text-text-tertiary">No analyses yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
        History
      </span>
      <div className="space-y-1">
        {analyses.map((analysis) => {
          const topWeakness = (analysis.weaknesses as Weakness[])?.[0]
          return (
            <button
              key={analysis.id}
              onClick={() => onSelect(analysis.id)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors group ${
                selectedId === analysis.id
                  ? 'bg-surface-raised border border-border'
                  : 'hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                {analysis.favicon_url ? (
                  <img
                    src={analysis.favicon_url}
                    alt=""
                    className="h-4 w-4 rounded shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <Globe className="h-4 w-4 text-text-tertiary shrink-0" />
                )}
                <span className="text-sm text-text-primary truncate flex-1">
                  {analysis.domain}
                </span>
                <button
                  onClick={(e) => handleDelete(e, analysis.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5 text-text-tertiary hover:text-error" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1 ml-6">
                <span className="text-xs text-text-tertiary">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
                {topWeakness && (
                  <SeverityBadge severity={topWeakness.severity} />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
