'use client'

import { useEffect, useState } from 'react'
import { Globe, Trash2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          History
        </span>
        {analyses.length > 0 && (
          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground">
            {analyses.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4">No analyses yet</p>
      ) : (
        <div className="space-y-1">
          {analyses.map((analysis) => {
            const topWeakness = (analysis.weaknesses as Weakness[])?.[0]
            const isSelected = selectedId === analysis.id
            return (
              <button
                key={analysis.id}
                onClick={() => onSelect(analysis.id)}
                className={cn(
                  'w-full text-left rounded-lg px-3 py-2.5 transition-colors group',
                  isSelected
                    ? 'bg-card ring-1 ring-primary/30'
                    : 'hover:bg-card/50'
                )}
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
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm text-foreground truncate flex-1 font-medium">
                    {analysis.domain}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, analysis.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5 ml-6">
                  <span className="text-[11px] text-muted-foreground">
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
      )}
    </div>
  )
}
