"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useAnalyze } from "@/hooks/use-analyze";
import { AnalysisResult } from "./analysis-result";
import { SaveNudge } from "./save-nudge";

export function PitchInput() {
  const [pitch, setPitch] = useState("");
  const { analysis, saved, loading, error, analyze, reset } = useAnalyze();
  const charCount = pitch.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pitch.length < 10) {
      toast.error("Pitch must be at least 10 characters");
      return;
    }
    await analyze(pitch);
  }

  function handleNewAnalysis() {
    setPitch("");
    reset();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Describe your startup in one sentence..."
            maxLength={500}
            disabled={loading}
            className="w-full bg-surface border border-border rounded-lg px-5 py-4 text-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`font-[family-name:var(--font-mono)] text-sm transition-colors ${
              charCount >= 500
                ? "text-score-red"
                : charCount >= 400
                  ? "text-score-amber"
                  : "text-text-muted"
            }`}
          >
            {charCount}/500
          </span>

          {error && (
            <span className="text-score-red text-sm">{error}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || pitch.length < 10}
          className="w-full bg-accent hover:bg-accent-hover text-background font-semibold rounded-lg px-4 py-4 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            "Analyzing..."
          ) : (
            <>
              <Stethoscope className="w-5 h-5" />
              Diagnose
            </>
          )}
        </button>
      </form>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6 w-full max-w-xl mx-auto">
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton h-16 w-24" />
            <div className="skeleton h-4 w-48" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-10" />
                </div>
                <div className="skeleton h-1.5 w-full" />
              </div>
            ))}
          </div>
          <div className="skeleton h-16 w-full" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {analysis && !loading && (
        <div className="space-y-4">
          <AnalysisResult analysis={analysis} />

          {!saved && <SaveNudge />}

          {saved && (
            <p className="text-center font-[family-name:var(--font-mono)] text-sm text-score-green">
              Analysis saved to your history
            </p>
          )}

          <button
            onClick={handleNewAnalysis}
            className="w-full border border-border hover:border-text-muted text-text-secondary rounded-lg px-4 py-3.5 text-base transition-colors"
          >
            Analyze another pitch
          </button>
        </div>
      )}
    </div>
  );
}
