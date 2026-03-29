"use client";

import { useState } from "react";
import { ConceptForm } from "./ConceptForm";
import { ConceptGrid } from "./ConceptGrid";
import { GeneratingState } from "./GeneratingState";
import { EmptyState } from "./EmptyState";
import { HistorySidebar } from "./HistorySidebar";
import { GmailDraftButton } from "./GmailDraftButton";
import { useGenerateConcepts } from "@/hooks/day12/useGenerateConcepts";
import { useConcepts, useConceptDetail } from "@/hooks/day12/useConcepts";
import type { ThumbnailConceptSet } from "@/types/day12";

export function ThumbnailDashboard() {
  const { generate, loading, error, clearError } = useGenerateConcepts();
  const { items, loading: historyLoading, addToHistory, removeFromHistory } =
    useConcepts();
  const [activeConceptSet, setActiveConceptSet] =
    useState<ThumbnailConceptSet | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );

  const { data: historyDetail, loading: detailLoading } =
    useConceptDetail(selectedHistoryId);

  // Display either fresh generation or history detail
  const displaySet = selectedHistoryId ? historyDetail : activeConceptSet;

  async function handleGenerate(input: {
    videoTitle: string;
    niche: string;
    tone: string;
  }) {
    clearError();
    setSelectedHistoryId(null);
    const result = await generate(input);
    if (result) {
      setActiveConceptSet(result);
      addToHistory(result);
    }
  }

  function handleHistorySelect(id: string) {
    setSelectedHistoryId(id);
    setActiveConceptSet(null);
  }

  function handleHistoryDeleted(id: string) {
    removeFromHistory(id);
    if (selectedHistoryId === id) {
      setSelectedHistoryId(null);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-49px)]">
      <HistorySidebar
        items={items}
        activeId={selectedHistoryId ?? activeConceptSet?.id ?? null}
        onSelect={handleHistorySelect}
        onDeleted={handleHistoryDeleted}
        loading={historyLoading}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="max-w-lg mx-auto">
            <ConceptForm
              onSubmit={handleGenerate}
              loading={loading}
              error={error}
            />
          </div>

          {loading && <GeneratingState />}

          {!loading && displaySet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {displaySet.video_title}
                  </h2>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {displaySet.niche} · {displaySet.tone}
                  </p>
                </div>
                <GmailDraftButton conceptSet={displaySet} />
              </div>

              <ConceptGrid concepts={displaySet.concepts} />

              <div
                className="rounded-md border p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <span
                  className="text-[10px] font-bold tracking-[0.1em]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  OVERALL A/B HYPOTHESIS
                </span>
                <p
                  className="text-[13px] italic leading-relaxed mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {displaySet.ab_hypothesis}
                </p>
              </div>
            </div>
          )}

          {!loading && !displaySet && !detailLoading && <EmptyState />}

          {detailLoading && <GeneratingState />}
        </div>
      </main>
    </div>
  );
}
