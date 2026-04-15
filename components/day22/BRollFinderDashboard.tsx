"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useBRollFinder } from "@/hooks/day22/useBRollFinder";
import { AnalyzeButton } from "./AnalyzeButton";
import { ScriptSummaryBar } from "./ScriptSummaryBar";
import { ConceptCard } from "./ConceptCard";

interface TerminalLine {
  text: string;
  highlight?: string;
}

const LOADING_SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 0, line: { text: "> reading script input..." } },
  { delay: 600, line: { text: "> reading script input... [DONE]", highlight: "[DONE]" } },
  { delay: 800, line: { text: "> counting words & estimating duration..." } },
  { delay: 1400, line: { text: "> counting words & estimating duration... [DONE]", highlight: "[DONE]" } },
  { delay: 1600, line: { text: "> initialising gemini-2.5-flash..." } },
  { delay: 2100, line: { text: "> initialising gemini-2.5-flash... [DONE]", highlight: "[DONE]" } },
  { delay: 2300, line: { text: "> segmenting script at 130 WPM..." } },
  { delay: 3400, line: { text: "> segmenting script at 130 WPM... [DONE]", highlight: "[DONE]" } },
  { delay: 3600, line: { text: "> generating visual concepts..." } },
  { delay: 5000, line: { text: "> generating visual concepts... [DONE]", highlight: "[DONE]" } },
  { delay: 5200, line: { text: "> mapping search terms..." } },
  { delay: 6200, line: { text: "> mapping search terms... [DONE]", highlight: "[DONE]" } },
  { delay: 6400, line: { text: "> assigning mood indicators..." } },
  { delay: 7000, line: { text: "> assigning mood indicators... [DONE]", highlight: "[DONE]" } },
  { delay: 7300, line: { text: "> analysis complete.", highlight: "complete." } },
];

function useLoadingTerminal(active: boolean) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = useCallback(() => {
    setLines([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const allTimers = LOADING_SEQUENCE.map(({ delay, line }) => {
      const timer = setTimeout(() => {
        setLines((prev) => {
          if (line.highlight === "[DONE]") {
            const baseText = line.text.replace(/\s*\[DONE\]$/, "");
            const filtered = prev.filter((l) => !l.text.startsWith(baseText));
            return [...filtered, line];
          }
          return [...prev, line];
        });
      }, delay);
      return timer;
    });

    timersRef.current = allTimers;
  }, []);

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setLines([]);
  }, []);

  useEffect(() => {
    if (active) {
      start();
    } else {
      reset();
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [active, start, reset]);

  return { lines };
}

export function BRollFinderDashboard() {
  const [script, setScript] = useState("");
  const { analyze, result, loading, error } = useBRollFinder();
  const { lines } = useLoadingTerminal(loading);

  const wordCount = script.trim()
    ? script.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = script.length;

  async function handleAnalyze() {
    if (script.length < 50) {
      toast("Script must be at least 50 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day22-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    await analyze(script);
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero section — only when no results and not loading */}
      {!result && !loading && (
        <section
          className="px-6 py-8 lg:py-10"
          style={{ background: "#0a0a0a" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="block mb-3"
              style={{
                fontFamily: "var(--font-day22-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              B-ROLL PLANNING ENGINE
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day22-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Script{" "}
              <span style={{ color: "#00FF41" }}>&rarr;</span>{" "}
              B-Roll
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day22-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Paste your video or podcast script. Get timestamped B-roll
              concepts, stock footage search terms, and mood mapping — all
              based on 130 WPM speaking rate.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5"
              style={{
                fontFamily: "var(--font-day22-mono)",
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
              VISUAL PLANNER v1.0
            </div>
          </div>
        </section>
      )}

      {/* Input form */}
      <section
        className="px-6 py-8"
        style={{
          background: result ? "#0a0a0a" : "#111111",
          borderTop: "1px solid #2a2a2a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Loading terminal */}
          {loading && (
            <div
              style={{
                background: "#161616",
                border: "1px solid #2a2a2a",
              }}
            >
              {/* Top bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "#1a1a1a",
                  borderBottom: "1px solid #2a2a2a",
                }}
              >
                <span
                  className="w-3 h-3 inline-block"
                  style={{ background: "#ff4444", borderRadius: "50%" }}
                />
                <span
                  className="w-3 h-3 inline-block"
                  style={{ background: "#FFB800", borderRadius: "50%" }}
                />
                <span
                  className="w-3 h-3 inline-block"
                  style={{ background: "#22C55E", borderRadius: "50%" }}
                />
                <span
                  className="ml-3 text-xs"
                  style={{
                    fontFamily: "var(--font-day22-mono)",
                    color: "#555",
                  }}
                >
                  b-roll-finder — analyzing
                </span>
              </div>

              {/* Terminal body */}
              <div
                className="p-5 space-y-1 min-h-[200px]"
                style={{
                  fontFamily: "var(--font-day22-mono)",
                  fontSize: "13px",
                  lineHeight: 1.8,
                  background: "#060606",
                }}
              >
                {lines.map((line, i) => (
                  <div
                    key={`${i}-${line.text}`}
                    className="transition-opacity duration-200"
                    style={{ opacity: 1, color: "#999" }}
                  >
                    {line.highlight ? (
                      <>
                        {line.text.replace(line.highlight, "")}
                        <span style={{ color: "#00FF41" }}>{line.highlight}</span>
                      </>
                    ) : (
                      line.text
                    )}
                  </div>
                ))}
                {loading && (
                  <div>
                    <span
                      className="inline-block w-2 h-4 align-middle"
                      style={{
                        background: "#00FF41",
                        animation: "cursor-blink 1s infinite",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Textarea */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontFamily: "var(--font-day22-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  SCRIPT INPUT
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Paste your video or podcast script here..."
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "16px",
                    background: "#060606",
                    border: "1px solid #2a2a2a",
                    color: "#eeeeee",
                    fontFamily: "var(--font-day22-body)",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    resize: "none",
                    outline: "none",
                    borderRadius: 0,
                    overflowY: "auto",
                  }}
                  className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
                />
                <div
                  className="flex justify-between mt-2"
                  style={{
                    fontFamily: "var(--font-day22-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  <span>{charCount.toLocaleString()} chars</span>
                  <span>{wordCount.toLocaleString()} words</span>
                </div>
              </div>
            </>
          )}

          {/* Error display */}
          {error && (
            <div
              className="p-3"
              style={{
                fontFamily: "var(--font-day22-mono)",
                fontSize: "13px",
                color: "#ff4444",
                background: "rgba(255,68,68,0.05)",
                border: "1px solid rgba(255,68,68,0.15)",
              }}
            >
              {">"} error: {error}
            </div>
          )}

          <AnalyzeButton
            loading={loading}
            disabled={script.length < 50}
            onClick={handleAnalyze}
          />
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto space-y-6">
            <span
              className="block mb-4"
              style={{
                fontFamily: "var(--font-day22-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              B-ROLL ANALYSIS
            </span>

            <ScriptSummaryBar
              totalDuration={result.totalDuration}
              wordCount={result.wordCount}
              conceptCount={result.concepts.length}
            />

            <div className="space-y-4">
              {result.concepts.map((concept, i) => (
                <ConceptCard
                  key={`${concept.timestamp}-${i}`}
                  concept={concept}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
