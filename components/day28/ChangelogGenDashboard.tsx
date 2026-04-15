"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useChangelogGen } from "@/hooks/day28/useChangelogGen";
import { NarrativeView } from "./NarrativeView";
import { SectionsView } from "./SectionsView";
import { TweetHooksView } from "./TweetHooksView";

type Tab = "narrative" | "structured" | "tweets";

const LOADING_LINES = [
  { delay: 0, text: "> parsing git log..." },
  { delay: 600, text: "> parsing git log... [DONE]" },
  { delay: 800, text: "> extracting commit metadata..." },
  { delay: 1400, text: "> extracting commit metadata... [DONE]" },
  { delay: 1600, text: "> initialising gemini-2.5-flash..." },
  { delay: 2200, text: "> initialising gemini-2.5-flash... [DONE]" },
  { delay: 2400, text: "> generating narrative changelog..." },
  { delay: 4000, text: "> generating narrative changelog... [DONE]" },
  { delay: 4200, text: "> generating structured sections..." },
  { delay: 5500, text: "> generating structured sections... [DONE]" },
  { delay: 5700, text: "> generating tweet hooks..." },
  { delay: 7000, text: "> generating tweet hooks... [DONE]" },
  { delay: 7200, text: "> pipeline complete. all outputs ready." },
];

function LoadingTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setLines([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const { delay, text } of LOADING_LINES) {
      timers.push(
        setTimeout(() => {
          setLines((prev) => {
            const baseLine = text.replace(/\s*\[DONE\]$/, "");
            if (text.includes("[DONE]")) {
              const filtered = prev.filter((l) => l !== baseLine);
              return [...filtered, text];
            }
            return [...prev, text];
          });
        }, delay),
      );
    }
    timersRef.current = timers;

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
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
            fontFamily: "var(--font-day28-mono)",
            color: "#555",
          }}
        >
          changelog-gen — running
        </span>
      </div>
      <div
        className="p-5 space-y-1 min-h-[200px]"
        style={{
          fontFamily: "var(--font-day28-mono)",
          fontSize: "13px",
          lineHeight: 1.8,
          background: "#060606",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: "#999" }}>
            {line.includes("[DONE]") ? (
              <>
                {line.replace(" [DONE]", "")}
                <span style={{ color: "#00FF41" }}> [DONE]</span>
              </>
            ) : line.includes("pipeline complete") ? (
              <span style={{ color: "#00FF41" }}>{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
        <div>
          <span
            className="inline-block w-2 h-4 align-middle"
            style={{
              background: "#00FF41",
              animation: "cursor-blink 1s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ChangelogGenDashboard() {
  const [gitLog, setGitLog] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("narrative");
  const { generate, result, loading, error } = useChangelogGen();

  async function handleGenerate() {
    if (gitLog.length < 20) {
      toast("> git log must be at least 20 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day28-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }
    await generate(gitLog);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "narrative", label: "Narrative" },
    { key: "structured", label: "Structured" },
    { key: "tweets", label: "Tweets" },
  ];

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero section — only show when no results and not loading */}
      {!result && !loading && (
        <section
          className="px-6 py-8 lg:py-10"
          style={{ background: "#0a0a0a" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="block mb-3"
              style={{
                fontFamily: "var(--font-day28-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              CHANGELOG GENERATOR
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day28-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Git Log{" "}
              <span style={{ color: "#00FF41" }}>{">"}</span>{" "}
              Changelog
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day28-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Paste your git log. Get a narrative changelog, structured
              sections, and 5 tweetable content hooks.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5"
              style={{
                fontFamily: "var(--font-day28-mono)",
                fontSize: "11px",
                color: "#00FF41",
                background: "rgba(0,255,65,0.05)",
                border: "1px solid rgba(0,255,65,0.2)",
                borderRadius: 0,
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
              CHANGELOG ENGINE v1.0
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
          {loading && (
            <div className="mb-6">
              <LoadingTerminal />
            </div>
          )}

          {!loading && (
            <>
              {/* Git log textarea */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  GIT LOG
                </label>
                <textarea
                  value={gitLog}
                  onChange={(e) => setGitLog(e.target.value)}
                  placeholder="Paste your git log here (e.g. output of git log --oneline --since='2 weeks ago')..."
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "16px",
                    background: "#060606",
                    border: "1px solid #2a2a2a",
                    color: "#eeeeee",
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "13px",
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
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  <span>{gitLog.length.toLocaleString()} chars</span>
                  <span>min 20 / max 20,000</span>
                </div>
              </div>
            </>
          )}

          {error && (
            <div
              className="p-3"
              style={{
                fontFamily: "var(--font-day28-mono)",
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

          {/* Generate button */}
          {!loading && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={gitLog.length < 20}
              className="w-full py-3 transition-all"
              style={{
                fontFamily: "var(--font-day28-mono)",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                background:
                  gitLog.length < 20 ? "#1a1a1a" : "#00FF41",
                color: gitLog.length < 20 ? "#555" : "#000",
                border:
                  gitLog.length < 20
                    ? "1px solid #2a2a2a"
                    : "1px solid #00FF41",
                borderRadius: 0,
                cursor: gitLog.length < 20 ? "not-allowed" : "pointer",
              }}
            >
              {result ? "[ REGENERATE ]" : "[ GENERATE CHANGELOG ]"}
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto">
            {/* Stats bar */}
            <div
              className="flex items-center gap-6 mb-6"
              style={{
                fontFamily: "var(--font-day28-mono)",
                fontSize: "12px",
                color: "#555",
              }}
            >
              <span>
                <span style={{ color: "#00FF41" }}>{result.commitCount}</span>{" "}
                commits
              </span>
              <span>
                <span style={{ color: "#00FF41" }}>{result.dateRange}</span>
              </span>
              <span>
                <span style={{ color: "#00FF41" }}>{result.sections.length}</span>{" "}
                sections
              </span>
              <span>
                <span style={{ color: "#00FF41" }}>{result.tweetHooks.length}</span>{" "}
                hooks
              </span>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-0 mb-6"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className="px-5 py-3 transition-colors"
                  style={{
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color:
                      activeTab === tab.key ? "#00FF41" : "#555",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      activeTab === tab.key
                        ? "2px solid #00FF41"
                        : "2px solid transparent",
                    cursor: "pointer",
                    borderRadius: 0,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "narrative" && (
              <NarrativeView narrative={result.narrative} />
            )}
            {activeTab === "structured" && (
              <SectionsView sections={result.sections} />
            )}
            {activeTab === "tweets" && (
              <TweetHooksView hooks={result.tweetHooks} />
            )}
          </div>
        </section>
      )}
    </main>
  );
}
