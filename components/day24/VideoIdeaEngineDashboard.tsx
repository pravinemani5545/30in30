"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useVideoIdeaEngine } from "@/hooks/day24/useVideoIdeaEngine";
import { OutlierTable } from "./OutlierTable";
import { PatternList } from "./PatternList";
import { IdeaCard } from "./IdeaCard";

/* ─── Loading terminal animation ─────────────────────────────────── */

interface TerminalLine {
  text: string;
  highlight?: string;
}

const LOADING_SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 0, line: { text: "> parsing niche keyword..." } },
  { delay: 600, line: { text: "> parsing niche keyword... [DONE]", highlight: "[DONE]" } },
  { delay: 800, line: { text: "> initialising gemini-2.5-flash..." } },
  { delay: 1400, line: { text: "> initialising gemini-2.5-flash... [DONE]", highlight: "[DONE]" } },
  { delay: 1600, line: { text: "> scanning niche landscape..." } },
  { delay: 2800, line: { text: "> scanning niche landscape... [DONE]", highlight: "[DONE]" } },
  { delay: 3000, line: { text: "> generating outlier video data..." } },
  { delay: 4500, line: { text: "> generating outlier video data... [DONE]", highlight: "[DONE]" } },
  { delay: 4700, line: { text: "> extracting content patterns..." } },
  { delay: 6000, line: { text: "> extracting content patterns... [DONE]", highlight: "[DONE]" } },
  { delay: 6200, line: { text: "> generating video ideas..." } },
  { delay: 7800, line: { text: "> generating video ideas... [DONE]", highlight: "[DONE]" } },
  { delay: 8000, line: { text: "> compiling results..." } },
  { delay: 8600, line: { text: "> compiling results... [DONE]", highlight: "[DONE]" } },
  { delay: 8900, line: { text: "> analysis complete.", highlight: "complete." } },
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

/* ─── Dashboard ──────────────────────────────────────────────────── */

export function VideoIdeaEngineDashboard() {
  const [niche, setNiche] = useState("");
  const { analyze, result, loading, error } = useVideoIdeaEngine();
  const { lines } = useLoadingTerminal(loading);

  async function handleAnalyze() {
    const trimmed = niche.trim();
    if (trimmed.length < 2) {
      toast("Niche must be at least 2 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day24-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    await analyze(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !loading) {
      handleAnalyze();
    }
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
                fontFamily: "var(--font-day24-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              VIDEO IDEA ENGINE
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day24-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Niche{" "}
              <span style={{ color: "#00FF41" }}>&rarr;</span>{" "}
              Video Ideas
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day24-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Enter a niche keyword. AI simulates outlier video analysis,
              extracts content patterns, and generates 5 video ideas with
              titles, hooks, and estimated performance.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5"
              style={{
                fontFamily: "var(--font-day24-mono)",
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
              OUTLIER ANALYSIS v1.0
            </div>
          </div>
        </section>
      )}

      {/* Input section */}
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
                    fontFamily: "var(--font-day24-mono)",
                    color: "#555",
                  }}
                >
                  video-idea-engine — analyzing
                </span>
              </div>

              {/* Terminal body */}
              <div
                className="p-5 space-y-1 min-h-[200px]"
                style={{
                  fontFamily: "var(--font-day24-mono)",
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
                        <span style={{ color: "#00FF41" }}>
                          {line.highlight}
                        </span>
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
              {/* Input */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontFamily: "var(--font-day24-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  NICHE KEYWORD
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. personal finance, AI tools, home gym..."
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "#060606",
                    border: "1px solid #2a2a2a",
                    color: "#eeeeee",
                    fontFamily: "var(--font-day24-body)",
                    fontSize: "15px",
                    lineHeight: 1.5,
                    outline: "none",
                    borderRadius: 0,
                  }}
                  className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
                />
                <div
                  className="flex justify-between mt-2"
                  style={{
                    fontFamily: "var(--font-day24-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  <span>{niche.length} / 100</span>
                  <span>press enter to generate</span>
                </div>
              </div>
            </>
          )}

          {/* Error display */}
          {error && (
            <div
              className="p-3"
              style={{
                fontFamily: "var(--font-day24-mono)",
                fontSize: "13px",
                color: "#ff4444",
                background: "rgba(255,68,68,0.05)",
                border: "1px solid rgba(255,68,68,0.15)",
              }}
            >
              {">"} error: {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || niche.trim().length < 2}
            className="w-full py-3 px-4 transition-all"
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: loading || niche.trim().length < 2 ? "#555" : "#0a0a0a",
              background:
                loading || niche.trim().length < 2 ? "#1a1a1a" : "#00FF41",
              border: `1px solid ${
                loading || niche.trim().length < 2 ? "#2a2a2a" : "#00FF41"
              }`,
              borderRadius: 0,
              cursor:
                loading || niche.trim().length < 2
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "ANALYZING..." : "GENERATE IDEAS"}
          </button>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Niche echo */}
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "var(--font-day24-mono)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                RESULTS FOR
              </span>
              <span
                className="px-2 py-1"
                style={{
                  fontFamily: "var(--font-day24-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#00FF41",
                  background: "rgba(0,255,65,0.08)",
                  border: "1px solid rgba(0,255,65,0.2)",
                  borderRadius: 0,
                }}
              >
                {result.niche}
              </span>
            </div>

            {/* Outlier Videos */}
            <OutlierTable videos={result.outlierVideos} />

            {/* Patterns */}
            <PatternList patterns={result.patterns} />

            {/* Video Ideas */}
            <div>
              <div
                className="flex items-center gap-2 mb-4"
                style={{
                  fontFamily: "var(--font-day24-mono)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#00FF41",
                  opacity: 0.75,
                }}
              >
                VIDEO IDEAS ({result.ideas.length})
              </div>
              <div className="space-y-4">
                {result.ideas.map((idea, i) => (
                  <IdeaCard
                    key={`${idea.title}-${i}`}
                    idea={idea}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
