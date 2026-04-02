"use client";

import { useState, useCallback } from "react";
import { useGenerateSequence } from "@/hooks/day15/useGenerateSequence";
import { useSequences, useSequenceDetail } from "@/hooks/day15/useSequences";
import { useDeleteSequence } from "@/hooks/day15/useDeleteSequence";
import { SequenceForm } from "./SequenceForm";
import { EmailCardGrid } from "./EmailCardGrid";
import { GeneratingState } from "./GeneratingState";
import { EmptyState } from "./EmptyState";
import { SequenceActions } from "./SequenceActions";
import { HistorySidebar } from "./HistorySidebar";
import type { EmailSequence, SequenceInput } from "@/types/day15";
import { toast } from "sonner";

export function EmailSequenceDashboard() {
  const { generate, loading: generating, error: genError } =
    useGenerateSequence();
  const {
    items: historyItems,
    loading: historyLoading,
    refresh: refreshHistory,
    addToHistory,
  } = useSequences();
  const { deleteSequence, deleting } = useDeleteSequence();

  const [activeSequence, setActiveSequence] = useState<EmailSequence | null>(
    null,
  );
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );

  const { sequence: selectedSequence, loading: selectedLoading } =
    useSequenceDetail(selectedHistoryId);

  const displaySequence = selectedHistoryId ? selectedSequence : activeSequence;

  const handleGenerate = useCallback(
    async (input: SequenceInput) => {
      const seq = await generate(input);
      if (seq) {
        setActiveSequence(seq);
        setSelectedHistoryId(null);
        addToHistory({
          id: seq.id,
          persona: seq.persona,
          has_followup_warning: seq.has_followup_warning,
          created_at: seq.created_at,
        });
        toast.success("Sequence generated");
      }
    },
    [generate, addToHistory],
  );

  const handleSelectHistory = useCallback((id: string) => {
    setSelectedHistoryId(id);
    setActiveSequence(null);
  }, []);

  const handleDeleteHistory = useCallback(
    async (id: string) => {
      const ok = await deleteSequence(id);
      if (ok) {
        if (selectedHistoryId === id) {
          setSelectedHistoryId(null);
        }
        refreshHistory();
      }
    },
    [deleteSequence, selectedHistoryId, refreshHistory],
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside
        className="hidden lg:block w-64 shrink-0 border-r overflow-y-auto"
        style={{ borderColor: "var(--border)" }}
      >
        <HistorySidebar
          items={historyItems}
          loading={historyLoading}
          selectedId={selectedHistoryId}
          onSelect={handleSelectHistory}
          onDelete={handleDeleteHistory}
          deleting={deleting}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {/* Title */}
          <div className="space-y-1">
            <h2
              className="text-[22px]"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--foreground)",
              }}
            >
              5-Email Outbound Sequence
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Pattern interrupt, social proof, pivot, break-up, re-engagement.
            </p>
          </div>

          {/* Form */}
          <SequenceForm
            onSubmit={handleGenerate}
            loading={generating}
            error={genError}
          />

          {/* Results */}
          {generating ? (
            <GeneratingState />
          ) : displaySequence ? (
            <div className="space-y-6">
              <EmailCardGrid
                emails={displaySequence.emails}
                sequenceSummary={
                  displaySequence.sequence_summary ?? ""
                }
                pivotAngle={displaySequence.pivot_angle ?? ""}
              />
              <SequenceActions emails={displaySequence.emails} />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      {/* Mobile history - bottom sheet */}
      <div
        className="lg:hidden border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <HistorySidebar
          items={historyItems}
          loading={historyLoading}
          selectedId={selectedHistoryId}
          onSelect={handleSelectHistory}
          onDelete={handleDeleteHistory}
          deleting={deleting}
        />
      </div>
    </div>
  );
}
