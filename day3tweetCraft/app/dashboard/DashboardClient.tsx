"use client";

import { useState, useCallback } from "react";
import { UrlInputForm } from "@/components/UrlInputForm";
import { GenerationStatus } from "@/components/GenerationStatus";
import { TweetGrid } from "@/components/TweetGrid";
import { EmptyState } from "@/components/EmptyState";
import { HistorySidebar } from "@/components/HistorySidebar";
import { useGenerate } from "@/hooks/useGenerate";
import type { GenerateResponse } from "@/types";
import { History } from "lucide-react";

export function DashboardClient() {
  const { step, result, error, generate, reset } = useGenerate();
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(null);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);

  const handleGenerate = useCallback(
    async (url: string) => {
      reset();
      const data = await generate(url);
      if (data) {
        setActiveGenerationId(data.generationId);
      }
    },
    [generate, reset]
  );

  async function handleSelectFromHistory(id: string) {
    setActiveGenerationId(id);
    // Fetch full generation
    try {
      const res = await fetch(`/api/generations/${id}`);
      const data = await res.json() as { generation: Record<string, unknown>; variations: GenerateResponse["variations"] };
      if (res.ok && data.generation) {
        const gen = data.generation;
        const reconstructed: GenerateResponse = {
          generationId: id,
          articleTitle: gen.article_title as string ?? "",
          articleDomain: gen.article_domain as string ?? "",
          articleFaviconUrl: gen.article_favicon_url as string ?? "",
          articleSummary: (gen.tweet_variations as { articleSummary?: string } | null)?.articleSummary ?? "",
          keyInsights: (gen.tweet_variations as { keyInsights?: string[] } | null)?.keyInsights ?? [],
          variations: data.variations,
          contentQuality: gen.content_quality as GenerateResponse["contentQuality"],
          cached: true,
        };
        // This would need to be passed up — for now just trigger a re-render indicator
        // In a more complete implementation, we'd use a global store
      }
    } catch {
      // Silently fail
    }
  }

  const isWorking = step === "fetching" || step === "reading" || step === "crafting";
  const showEmpty = step === "idle" && !result;
  const showResult = step === "done" && result;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <HistorySidebar
          activeGenerationId={activeGenerationId}
          onSelectGeneration={handleSelectFromHistory}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              TweetCraft
            </h1>
            {/* Mobile history button */}
            <button
              className="lg:hidden p-2 rounded-lg border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              onClick={() => setHistorySheetOpen(true)}
            >
              <History size={16} />
            </button>
          </div>

          {/* URL input */}
          <UrlInputForm onSubmit={handleGenerate} step={step} />

          {/* Error message */}
          {step === "error" && error && (
            <div
              className="rounded-xl border p-4 text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.25)",
                color: "var(--error)",
              }}
            >
              {error}
            </div>
          )}

          {/* Generation in progress */}
          {isWorking && (
            <GenerationStatus step={step} articleTitle={result?.articleTitle} />
          )}

          {/* Results */}
          {showResult && result && <TweetGrid result={result} />}

          {/* Empty state */}
          {showEmpty && <EmptyState />}
        </div>
      </main>

      {/* Mobile history bottom sheet */}
      {historySheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setHistorySheetOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-l border-r overflow-hidden"
            style={{ background: "var(--surface)", borderColor: "var(--border)", maxHeight: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <HistorySidebar
                activeGenerationId={activeGenerationId}
                onSelectGeneration={(id) => {
                  handleSelectFromHistory(id);
                  setHistorySheetOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
