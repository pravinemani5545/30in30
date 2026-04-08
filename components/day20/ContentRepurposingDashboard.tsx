"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HeroTerminal } from "./HeroTerminal";
import { LoadingTerminal } from "./LoadingTerminal";
import { SourceTextarea } from "./SourceTextarea";
import { VoiceCalibration } from "./VoiceCalibration";
import { OutputTogglePills } from "./OutputTogglePills";
import { RunButton } from "./RunButton";
import { OutputGrid } from "./OutputGrid";
import { PipelineHistory } from "./PipelineHistory";
import { useRepurpose } from "@/hooks/day20/useRepurpose";
import { useRepurposedList, useRepurposedDetail } from "@/hooks/day20/useRepurposedContent";
import { useVoiceCalibration } from "@/hooks/day20/useVoiceCalibration";
import { ALL_OUTPUT_KEYS } from "@/lib/day20/pipeline/outputs";
import type { OutputType, PipelineOutputs } from "@/types/day20";

export function ContentRepurposingDashboard() {
  const [sourceText, setSourceText] = useState("");
  const [selectedOutputs, setSelectedOutputs] =
    useState<OutputType[]>(ALL_OUTPUT_KEYS);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const { calibration, update: updateCalibration, hasCalibration } =
    useVoiceCalibration();
  const {
    run,
    result,
    wasTrimmed,
    loading,
    error,
    authenticated,
  } = useRepurpose();
  const { items, refresh: refreshHistory, authenticated: listAuthenticated } =
    useRepurposedList();
  const { content: historyDetail } = useRepurposedDetail(activeHistoryId);

  const handleToggleOutput = useCallback((key: OutputType) => {
    setSelectedOutputs((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  }, []);

  async function handleRun() {
    if (sourceText.length < 100) {
      toast("Source text must be at least 100 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    setActiveHistoryId(null);

    await run({
      sourceText,
      calibration: hasCalibration ? calibration : undefined,
      selectedOutputs,
    });

    refreshHistory();
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/day20/repurpose/${id}`, { method: "DELETE" });
      if (activeHistoryId === id) setActiveHistoryId(null);
      refreshHistory();
    } catch {
      // silent
    }
  }

  // Determine what outputs to show
  const displayOutputs: PipelineOutputs | null = activeHistoryId
    ? (historyDetail?.outputs as PipelineOutputs | undefined) ?? null
    : result?.outputs ?? null;

  const displaySelected: OutputType[] = activeHistoryId
    ? (historyDetail?.outputs
        ? (Object.keys(historyDetail.outputs) as OutputType[])
        : ALL_OUTPUT_KEYS)
    : selectedOutputs;

  const isAuthenticated = authenticated && listAuthenticated;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day20-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required to run pipeline
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day20")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day20-mono)",
              fontSize: "14px",
              fontWeight: 700,
              background: "#00FF41",
              color: "#000",
              borderRadius: 0,
            }}
          >
            [ SIGN IN ]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      {/* History sidebar — desktop only */}
      <aside
        className="hidden lg:block w-72 flex-shrink-0 overflow-y-auto"
        style={{
          borderRight: "1px solid #2a2a2a",
          background: "#0a0a0a",
        }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        >
          <span
            style={{
              fontFamily: "var(--font-day20-mono)",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#00FF41",
              opacity: 0.75,
            }}
          >
            HISTORY
          </span>
        </div>
        <PipelineHistory
          items={items}
          activeId={activeHistoryId}
          onSelect={(id) => {
            setActiveHistoryId(id === activeHistoryId ? null : id);
          }}
          onDelete={handleDelete}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero section */}
        {!displayOutputs && !loading && (
          <section
            className="px-6 py-8 lg:py-10"
            style={{ background: "#0a0a0a" }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <span
                className="block mb-3"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#00FF41",
                  opacity: 0.75,
                }}
              >
                CONTENT REPURPOSING PIPELINE
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-day20-heading)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#eeeeee",
                  marginBottom: "12px",
                }}
              >
                One source.{" "}
                <span style={{ color: "#00FF41" }}>Seven formats.</span>{" "}
                Zero rewrites.
              </h2>

              <p
                className="mb-5 mx-auto max-w-md"
                style={{
                  fontFamily: "var(--font-day20-body)",
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#999",
                }}
              >
                Feed your long-form content. Get back everything you need
                for the week — in your voice.
              </p>

              {/* Hero badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "11px",
                  color: "#00FF41",
                  background: "rgba(0,255,65,0.05)",
                  border: "1px solid rgba(0,255,65,0.2)",
                }}
              >
                <span
                  className="inline-block w-2 h-2"
                  style={{
                    background: "#00FF41",
                    borderRadius: "50%",
                    animation: "pulse-dot 2s infinite",
                  }}
                />
                PROCESSING ENGINE v1.0
              </div>
            </div>
          </section>
        )}

        {/* Input form */}
        <section
          className="px-6 py-8"
          style={{
            background: displayOutputs ? "#0a0a0a" : "#111111",
            borderTop: "1px solid #2a2a2a",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Loading terminal */}
            {loading && (
              <div className="mb-6">
                <LoadingTerminal active={loading} />
              </div>
            )}

            {!loading && (
              <>
                <SourceTextarea value={sourceText} onChange={setSourceText} />
                <VoiceCalibration
                  calibration={calibration}
                  onUpdate={updateCalibration}
                  hasCalibration={hasCalibration}
                />
                <OutputTogglePills
                  selected={selectedOutputs}
                  onToggle={handleToggleOutput}
                />
              </>
            )}

            {error && (
              <div
                className="p-3"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "13px",
                  color: "#ff4444",
                  background: "rgba(255,68,68,0.05)",
                  border: "1px solid rgba(255,68,68,0.15)",
                }}
              >
                {">"} error: {error}
              </div>
            )}

            {wasTrimmed && (
              <div
                className="p-3"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "13px",
                  color: "#FFB800",
                  background: "rgba(255,184,0,0.05)",
                  border: "1px solid rgba(255,184,0,0.15)",
                }}
              >
                {">"} source trimmed to first 3,000 words for optimal
                results
              </div>
            )}

            <RunButton
              loading={loading}
              disabled={sourceText.length < 100}
              onClick={handleRun}
            />
          </div>
        </section>

        {/* Output grid */}
        {displayOutputs && (
          <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
            <div className="max-w-3xl mx-auto">
              <span
                className="block mb-4"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#00FF41",
                  opacity: 0.75,
                }}
              >
                PIPELINE OUTPUT
              </span>
              <OutputGrid
                outputs={displayOutputs}
                selectedOutputs={displaySelected}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
