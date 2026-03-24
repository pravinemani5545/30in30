'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { UrlInputForm } from '@/components/UrlInputForm'
import { ExtractionProgress } from '@/components/ExtractionProgress'
import { ExtractionMethodBanner } from '@/components/ExtractionMethodBanner'
import { ResultGrid } from '@/components/ResultGrid'
import { HistorySidebar } from '@/components/HistorySidebar'
import { EmptyState } from '@/components/EmptyState'
import { GmailDraftButton } from '@/components/GmailDraftButton'
import type { CompetitorAnalysis, AnalyzeProgressStep } from '@/types'

const INITIAL_STEPS: AnalyzeProgressStep[] = [
  { id: 'browser', label: 'Launching browser...', status: 'pending' },
  { id: 'render', label: 'Rendering page...', status: 'pending' },
  { id: 'extract', label: 'Extracting content...', status: 'pending' },
  { id: 'analyse', label: 'Analysing with Claude...', status: 'pending' },
]

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [steps, setSteps] = useState<AnalyzeProgressStep[]>(INITIAL_STEPS)
  const [showProgress, setShowProgress] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const updateStep = useCallback((id: string, status: AnalyzeProgressStep['status'], label?: string) => {
    setSteps(prev => prev.map(s =>
      s.id === id ? { ...s, status, label: label || s.label } : s
    ))
  }, [])

  async function handleAnalyze(url: string) {
    setIsLoading(true)
    setShowProgress(true)
    setAnalysis(null)
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'pending' })))

    // Simulate progress steps
    updateStep('browser', 'active')
    setTimeout(() => {
      updateStep('browser', 'complete')
      updateStep('render', 'active', `Rendering ${new URL(url).hostname}...`)
    }, 1500)
    setTimeout(() => {
      updateStep('render', 'complete')
      updateStep('extract', 'active')
    }, 4000)
    setTimeout(() => {
      updateStep('extract', 'complete')
      updateStep('analyse', 'active')
    }, 6000)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Something went wrong')
        setShowProgress(false)
        setIsLoading(false)
        return
      }

      const data: CompetitorAnalysis = await res.json()
      // Complete all steps
      setSteps(prev => prev.map(s => ({
        ...s,
        status: s.status === 'pending' ? 'complete' : s.status === 'active' ? 'complete' : s.status,
      })))

      // Check if fallback was used
      if (data.render_method === 'static_only') {
        updateStep('browser', 'skipped', 'Browser skipped — static extraction used')
        updateStep('render', 'skipped', 'Switched to static extraction')
      }

      setTimeout(() => {
        setAnalysis(data)
        setShowProgress(false)
        setRefreshTrigger(prev => prev + 1)
      }, 500)
    } catch {
      toast.error('Something went wrong. Please try again.')
      setShowProgress(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSelectHistory(id: string) {
    try {
      const res = await fetch(`/api/analyses/${id}`)
      if (res.ok) {
        const data: CompetitorAnalysis = await res.json()
        setAnalysis(data)
        setShowProgress(false)
      }
    } catch {
      toast.error('Failed to load analysis')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:block w-[280px] border-r border-border p-4 shrink-0 overflow-y-auto">
        <HistorySidebar
          onSelect={handleSelectHistory}
          selectedId={analysis?.id || null}
          refreshTrigger={refreshTrigger}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="space-y-1">
          <h1 className="font-display text-3xl">CompetitorRadar</h1>
          <p className="text-sm text-text-secondary">
            Strategic teardown from any competitor URL
          </p>
        </div>

        <UrlInputForm onSubmit={handleAnalyze} isLoading={isLoading} />

        {analysis?.render_method && (
          <ExtractionMethodBanner method={analysis.render_method} />
        )}

        {showProgress && <ExtractionProgress steps={steps} />}

        {analysis && analysis.status === 'complete' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  {analysis.domain}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  analysis.render_method === 'js_rendered'
                    ? 'bg-badge-js/15 text-badge-js'
                    : 'bg-badge-static/15 text-badge-static'
                }`}>
                  {analysis.render_method === 'js_rendered' ? 'JS Rendered' : 'Static'}
                </span>
              </div>
              <GmailDraftButton analysis={analysis} />
            </div>
            <ResultGrid analysis={analysis} />
          </div>
        ) : !showProgress ? (
          <EmptyState />
        ) : null}

        {/* Mobile history */}
        <div className="lg:hidden border-t border-border pt-6">
          <HistorySidebar
            onSelect={handleSelectHistory}
            selectedId={analysis?.id || null}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </main>
    </div>
  )
}
