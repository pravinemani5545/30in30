"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useYouTubeKit } from "@/hooks/day30/useYouTubeKit";
import { IdeationView } from "./IdeationView";
import { ScriptView } from "./ScriptView";
import { BRollBriefView } from "./BRollBriefView";
import { ThumbnailConceptsView } from "./ThumbnailConceptsView";

type TabKey = "ideation" | "script" | "broll" | "thumbnails";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "ideation", label: "Ideation", icon: "01" },
  { key: "script", label: "Script", icon: "02" },
  { key: "broll", label: "B-Roll", icon: "03" },
  { key: "thumbnails", label: "Thumbnails", icon: "04" },
];

// ─── Loading terminal animation ─────────────────────────────────

interface TerminalLine {
  text: string;
  highlight?: string;
}

const LOADING_SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 0, line: { text: "> initialising youtube-ai-kit..." } },
  {
    delay: 600,
    line: {
      text: "> initialising youtube-ai-kit... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 800, line: { text: "> [1/4] generating ideation..." } },
  {
    delay: 4000,
    line: {
      text: "> [1/4] generating ideation... [DONE]",
      highlight: "[DONE]",
    },
  },
  {
    delay: 4200,
    line: { text: "> [2/4] generating script... (parallel)" },
  },
  {
    delay: 4400,
    line: { text: "> [3/4] generating b-roll brief... (parallel)" },
  },
  {
    delay: 4600,
    line: { text: "> [4/4] generating thumbnails... (parallel)" },
  },
  {
    delay: 8000,
    line: {
      text: "> [2/4] generating script... [DONE]",
      highlight: "[DONE]",
    },
  },
  {
    delay: 9000,
    line: {
      text: "> [3/4] generating b-roll brief... [DONE]",
      highlight: "[DONE]",
    },
  },
  {
    delay: 10000,
    line: {
      text: "> [4/4] generating thumbnails... [DONE]",
      highlight: "[DONE]",
    },
  },
  {
    delay: 10500,
    line: {
      text: "> package complete. [4/4 modules]",
      highlight: "[4/4 modules]",
    },
  },
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

// ─── Module status indicator ────────────────────────────────────

function ModuleIndicator({
  label,
  index,
  status,
}: {
  label: string;
  index: number;
  status: "idle" | "running" | "done" | "failed";
}) {
  const colorMap = {
    idle: "#555",
    running: "#FFB800",
    done: "#00FF41",
    failed: "#ff4444",
  };
  const bgMap = {
    idle: "transparent",
    running: "rgba(255,184,0,0.08)",
    done: "rgba(0,255,65,0.08)",
    failed: "rgba(255,68,68,0.08)",
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{
        background: bgMap[status],
        border: `1px solid ${status === "idle" ? "#2a2a2a" : colorMap[status]}`,
        borderRadius: 0,
      }}
    >
      <span
        className="inline-block w-2 h-2 flex-shrink-0"
        style={{
          background: colorMap[status],
          borderRadius: "50%",
          animation: status === "running" ? "pulse-dot 1.5s infinite" : "none",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-day30-mono)",
          fontSize: "11px",
          color: colorMap[status],
        }}
      >
        {String(index + 1).padStart(2, "0")} {label}
      </span>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────

export function YouTubeAIKitDashboard() {
  const [topic, setTopic] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("ideation");
  const { generate, result, loading, error } = useYouTubeKit();
  const { lines } = useLoadingTerminal(loading);

  async function handleGenerate() {
    if (topic.trim().length < 3) return;
    await generate(topic.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleGenerate();
    }
  }

  // Derive module statuses
  function getModuleStatus(key: TabKey): "idle" | "running" | "done" | "failed" {
    if (!loading && !result) return "idle";
    if (loading) {
      if (key === "ideation") return "running";
      return "running";
    }
    // Result available
    if (key === "ideation") return result?.ideation ? "done" : "failed";
    if (key === "script") return result?.script ? "done" : "failed";
    if (key === "broll") return result?.bRollBrief ? "done" : "failed";
    if (key === "thumbnails") return result?.thumbnails ? "done" : "failed";
    return "idle";
  }

  // Count successful modules
  const doneCount = result
    ? [result.ideation, result.script, result.bRollBrief, result.thumbnails].filter(
        Boolean,
      ).length
    : 0;

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero — only shown when no results and not loading */}
      {!result && !loading && (
        <section className="px-6 py-8 lg:py-10" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="block mb-3"
              style={{
                fontFamily: "var(--font-day30-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              DAY 30 — CAPSTONE
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day30-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Topic{" "}
              <span style={{ color: "#00FF41" }}>&rarr;</span>{" "}
              YouTube Package
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day30-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Enter a topic. Get a complete YouTube content package
              — ideation, script, B-roll brief, and thumbnail concepts.
            </p>

            {/* 4 module indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {TABS.map((tab, i) => (
                <ModuleIndicator
                  key={tab.key}
                  label={tab.label}
                  index={i}
                  status="idle"
                />
              ))}
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
              className="p-4 mb-4"
              style={{
                background: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              {/* Module indicators during loading */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {TABS.map((tab, i) => (
                  <ModuleIndicator
                    key={tab.key}
                    label={tab.label}
                    index={i}
                    status="running"
                  />
                ))}
              </div>

              {/* Terminal lines */}
              <div className="space-y-1">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "var(--font-day30-mono)",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: line.highlight ? "#00FF41" : "#777",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
                {lines.length > 0 && (
                  <span
                    className="inline-block"
                    style={{
                      width: "8px",
                      height: "14px",
                      background: "#00FF41",
                      animation: "blink 1s step-end infinite",
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Topic input */}
          {!loading && (
            <div>
              <label
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                TOPIC
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., How to start a YouTube channel in 2025"
                  maxLength={200}
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "15px",
                    color: "#eeeeee",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    padding: "12px 16px",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#00FF41")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#2a2a2a")
                  }
                />
                <button
                  onClick={handleGenerate}
                  disabled={topic.trim().length < 3 || loading}
                  className="px-6 py-3 transition-all flex-shrink-0"
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    background:
                      topic.trim().length < 3
                        ? "#1a1a1a"
                        : "#00FF41",
                    color:
                      topic.trim().length < 3
                        ? "#555"
                        : "#000",
                    border: "none",
                    borderRadius: 0,
                    cursor:
                      topic.trim().length < 3
                        ? "not-allowed"
                        : "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  {loading ? "GENERATING..." : "GENERATE"}
                </button>
              </div>
              <div
                className="mt-2 text-right"
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "10px",
                  color: "#555",
                }}
              >
                {topic.length}/200
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="p-3"
              style={{
                fontFamily: "var(--font-day30-mono)",
                fontSize: "13px",
                color: "#ff4444",
                background: "rgba(255,68,68,0.05)",
                border: "1px solid rgba(255,68,68,0.15)",
                borderRadius: 0,
              }}
            >
              {">"} error: {error}
            </div>
          )}
        </div>
      </section>

      {/* Results section */}
      {result && (
        <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#00FF41",
                  opacity: 0.75,
                }}
              >
                PACKAGE OUTPUT
              </span>
              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  {doneCount}/4 modules
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  {(result.totalDurationMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Module status bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {TABS.map((tab, i) => (
                <ModuleIndicator
                  key={tab.key}
                  label={tab.label}
                  index={i}
                  status={getModuleStatus(tab.key)}
                />
              ))}
            </div>

            {/* Tab navigation */}
            <div
              className="flex overflow-x-auto mb-6"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const isAvailable =
                  (tab.key === "ideation" && result.ideation) ||
                  (tab.key === "script" && result.script) ||
                  (tab.key === "broll" && result.bRollBrief) ||
                  (tab.key === "thumbnails" && result.thumbnails);

                return (
                  <button
                    key={tab.key}
                    onClick={() => isAvailable && setActiveTab(tab.key)}
                    className="px-4 py-3 flex-shrink-0 transition-all"
                    style={{
                      fontFamily: "var(--font-day30-mono)",
                      fontSize: "12px",
                      color: isActive
                        ? "#00FF41"
                        : isAvailable
                          ? "#999"
                          : "#333",
                      background: isActive
                        ? "rgba(0,255,65,0.05)"
                        : "transparent",
                      borderBottom: isActive
                        ? "2px solid #00FF41"
                        : "2px solid transparent",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      borderRadius: 0,
                      cursor: isAvailable ? "pointer" : "default",
                      letterSpacing: "1px",
                      opacity: isAvailable ? 1 : 0.4,
                    }}
                  >
                    [{tab.icon}] {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div>
              {activeTab === "ideation" && result.ideation && (
                <IdeationView ideation={result.ideation} />
              )}
              {activeTab === "script" && result.script && (
                <ScriptView script={result.script} />
              )}
              {activeTab === "broll" && result.bRollBrief && (
                <BRollBriefView brief={result.bRollBrief} />
              )}
              {activeTab === "thumbnails" && result.thumbnails && (
                <ThumbnailConceptsView thumbnails={result.thumbnails} />
              )}

              {/* Module failed message */}
              {activeTab === "ideation" && !result.ideation && (
                <ModuleFailedMessage module="Ideation" />
              )}
              {activeTab === "script" && !result.script && (
                <ModuleFailedMessage module="Script" />
              )}
              {activeTab === "broll" && !result.bRollBrief && (
                <ModuleFailedMessage module="B-Roll Brief" />
              )}
              {activeTab === "thumbnails" && !result.thumbnails && (
                <ModuleFailedMessage module="Thumbnail Concepts" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Blink animation keyframes */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}

// ─── Module failed message ──────────────────────────────────────

function ModuleFailedMessage({ module }: { module: string }) {
  return (
    <div
      className="p-6 text-center"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,68,68,0.15)",
        borderRadius: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-day30-mono)",
          fontSize: "13px",
          color: "#ff4444",
        }}
      >
        {">"} {module} module failed to generate.
      </p>
      <p
        className="mt-2"
        style={{
          fontFamily: "var(--font-day30-body)",
          fontSize: "13px",
          color: "#555",
        }}
      >
        Try generating again — the other modules may still have succeeded.
      </p>
    </div>
  );
}
