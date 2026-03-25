'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Crosshair, LogOut, Globe as GlobeIcon } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UrlInputForm } from '@/components/day6/UrlInputForm'
import { ExtractionProgress } from '@/components/day6/ExtractionProgress'
import { ExtractionMethodBanner } from '@/components/day6/ExtractionMethodBanner'
import { ResultGrid } from '@/components/day6/ResultGrid'
import { HistorySidebar } from '@/components/day6/HistorySidebar'
import { EmptyState } from '@/components/day6/EmptyState'
import { GmailDraftButton } from '@/components/day6/GmailDraftButton'
import type { CompetitorAnalysis, AnalyzeProgressStep } from '@/types/day6'

const INITIAL_STEPS: AnalyzeProgressStep[] = [
  { id: 'browser', label: 'Launching browser...', status: 'pending' },
  { id: 'render', label: 'Rendering page...', status: 'pending' },
  { id: 'extract', label: 'Extracting content...', status: 'pending' },
  { id: 'analyse', label: 'Analysing with Gemini...', status: 'pending' },
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

  async function handleSignOut() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    window.location.href = '/login?redirectTo=/day6/dashboard'
  }

  async function handleAnalyze(url: string) {
    setIsLoading(true)
    setShowProgress(true)
    setAnalysis(null)
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'pending' })))

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
      const res = await fetch('/api/day6/analyze', {
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
      setSteps(prev => prev.map(s => ({
        ...s,
        status: s.status === 'pending' ? 'complete' : s.status === 'active' ? 'complete' : s.status,
      })))

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
      const res = await fetch(`/api/day6/analyses/${id}`)
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
      <aside className="hidden lg:flex lg:w-[280px] flex-col border-r border-border bg-card/30 shrink-0">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg text-foreground">CompetitorRadar</span>
          </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1 p-4">
          <HistorySidebar
            onSelect={handleSelectHistory}
            selectedId={analysis?.id || null}
            refreshTrigger={refreshTrigger}
          />
        </ScrollArea>
        <Separator />
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Header - visible on mobile, hidden on desktop since sidebar has branding */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg text-foreground">CompetitorRadar</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-3xl text-foreground">Analyse a competitor</h1>
            <p className="text-sm text-muted-foreground">
              Paste any URL to get a strategic teardown in seconds
            </p>
          </div>

          <UrlInputForm onSubmit={handleAnalyze} isLoading={isLoading} />

          {analysis?.render_method && (
            <ExtractionMethodBanner method={analysis.render_method} />
          )}

          {showProgress && <ExtractionProgress steps={steps} />}

          {analysis && analysis.status === 'complete' ? (
            <div className="space-y-4">
              {/* Result header bar */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <AnalysisFavicon analysis={analysis} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{analysis.domain}</p>
                    <p className="text-xs text-muted-foreground">
                      Analysed {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                    analysis.render_method === 'js_rendered'
                      ? 'bg-badge-js/15 text-badge-js'
                      : 'bg-badge-static/15 text-badge-static'
                  }`}>
                    {analysis.render_method === 'js_rendered' ? 'JS Rendered' : 'Static'}
                  </span>
                  <GmailDraftButton analysis={analysis} />
                </div>
              </div>

              <ResultGrid analysis={analysis} />
            </div>
          ) : !showProgress ? (
            <EmptyState />
          ) : null}

          {/* Mobile history */}
          <div className="lg:hidden">
            <Separator className="mb-6" />
            <HistorySidebar
              onSelect={handleSelectHistory}
              selectedId={analysis?.id || null}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function AnalysisFavicon({ analysis }: { analysis: CompetitorAnalysis }) {
  const [failed, setFailed] = useState(false)

  if (analysis.favicon_url && !failed) {
    return (
      <img
        src={analysis.favicon_url}
        alt=""
        className="h-5 w-5 rounded"
        onError={() => setFailed(true)}
      />
    )
  }
  return <GlobeIcon className="h-5 w-5 text-muted-foreground" />
}
