"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePipeline } from "@/hooks/day29/usePipeline";
import { PipelineProgress } from "./PipelineProgress";
import { StageEnrichment } from "./StageEnrichment";
import { StageOutreach } from "./StageOutreach";
import { StageSequence } from "./StageSequence";
import { StageCampaign } from "./StageCampaign";

type ResultTab = "enrichment" | "outreach" | "sequence" | "campaign";

const RESULT_TABS: { key: ResultTab; label: string }[] = [
  { key: "enrichment", label: "Enrichment" },
  { key: "outreach", label: "Outreach" },
  { key: "sequence", label: "Sequence" },
  { key: "campaign", label: "Campaign" },
];

function formatTotalDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function PipelineDemoDashboard() {
  const [companyInput, setCompanyInput] = useState("");
  const [activeTab, setActiveTab] = useState<ResultTab>("enrichment");
  const { run, result, currentStage, loading, error } = usePipeline();

  async function handleRun() {
    if (companyInput.length < 2) {
      toast("> company name must be at least 2 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day29-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }
    setActiveTab("enrichment");
    await run(companyInput);
  }

  const hasResults = result && result.enrichment.status === "complete";

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero — only when no results and not loading */}
      {!result && !loading && (
        <section
          className="px-6 py-8 lg:py-10"
          style={{ background: "#0a0a0a" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="block mb-3"
              style={{
                fontFamily: "var(--font-day29-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              4-STAGE AI PIPELINE
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day29-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Company{" "}
              <span style={{ color: "#00FF41" }}>{">"}</span>{" "}
              Campaign
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day29-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Enter a company name or URL. Watch a 4-stage Gemini pipeline
              enrich, draft, sequence, and preview a full outbound campaign.
            </p>

            {/* Pipeline stages preview */}
            <div
              className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2"
              style={{
                fontFamily: "var(--font-day29-mono)",
                fontSize: "11px",
                color: "#555",
                background: "rgba(0,255,65,0.03)",
                border: "1px solid rgba(0,255,65,0.1)",
                borderRadius: 0,
              }}
            >
              <span style={{ color: "#00FF41" }}>Enrich</span>
              <span style={{ color: "#333" }}>&#8594;</span>
              <span style={{ color: "#00FF41" }}>Draft</span>
              <span style={{ color: "#333" }}>&#8594;</span>
              <span style={{ color: "#00FF41" }}>Sequence</span>
              <span style={{ color: "#333" }}>&#8594;</span>
              <span style={{ color: "#00FF41" }}>Campaign</span>
            </div>
          </div>
        </section>
      )}

      {/* Input section */}
      <section
        className="px-6 py-8"
        style={{
          background: hasResults ? "#0a0a0a" : "#111111",
          borderTop: "1px solid #2a2a2a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Loading state — pipeline progress */}
          {loading && (
            <div className="mb-6">
              <div
                className="px-5 py-6"
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                {/* Terminal header */}
                <div
                  className="flex items-center gap-2 mb-5 pb-3"
                  style={{ borderBottom: "1px solid #2a2a2a" }}
                >
                  <span
                    className="w-2.5 h-2.5 inline-block"
                    style={{ background: "#ff4444", borderRadius: "50%" }}
                  />
                  <span
                    className="w-2.5 h-2.5 inline-block"
                    style={{ background: "#FFB800", borderRadius: "50%" }}
                  />
                  <span
                    className="w-2.5 h-2.5 inline-block"
                    style={{ background: "#22C55E", borderRadius: "50%" }}
                  />
                  <span
                    className="ml-2 text-xs"
                    style={{
                      fontFamily: "var(--font-day29-mono)",
                      color: "#555",
                    }}
                  >
                    pipeline-demo — running
                  </span>
                </div>

                <PipelineProgress
                  result={null}
                  currentStage={currentStage}
                  loading={loading}
                />

                {/* Blinking cursor */}
                <div className="mt-4 pl-8">
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
          )}

          {/* Input form — hide when loading */}
          {!loading && (
            <>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontFamily: "var(--font-day29-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  COMPANY NAME OR URL
                </label>
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  placeholder="e.g. Stripe, shopify.com, notion.so"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && companyInput.length >= 2) {
                      handleRun();
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "#060606",
                    border: "1px solid #2a2a2a",
                    color: "#eeeeee",
                    fontFamily: "var(--font-day29-mono)",
                    fontSize: "14px",
                    outline: "none",
                    borderRadius: 0,
                  }}
                  className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
                />
                <div
                  className="flex justify-between mt-2"
                  style={{
                    fontFamily: "var(--font-day29-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  <span>{companyInput.length} chars</span>
                  <span>min 2 / max 500</span>
                </div>
              </div>

              {error && (
                <div
                  className="p-3 mt-4"
                  style={{
                    fontFamily: "var(--font-day29-mono)",
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

              <button
                type="button"
                onClick={handleRun}
                disabled={companyInput.length < 2}
                className="w-full py-3 mt-5 transition-all"
                style={{
                  fontFamily: "var(--font-day29-mono)",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  background:
                    companyInput.length < 2 ? "#1a1a1a" : "#00FF41",
                  color: companyInput.length < 2 ? "#555" : "#000",
                  border:
                    companyInput.length < 2
                      ? "1px solid #2a2a2a"
                      : "1px solid #00FF41",
                  borderRadius: 0,
                  cursor:
                    companyInput.length < 2 ? "not-allowed" : "pointer",
                }}
              >
                {result ? "[ RUN PIPELINE AGAIN ]" : "[ RUN PIPELINE ]"}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Results */}
      {hasResults && (
        <section className="px-6 py-8" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto">
            {/* Pipeline completion summary */}
            <div
              className="flex flex-wrap items-center gap-6 mb-6"
              style={{
                fontFamily: "var(--font-day29-mono)",
                fontSize: "12px",
                color: "#555",
              }}
            >
              <span>
                <span style={{ color: "#00FF41" }}>4</span> stages complete
              </span>
              <span>
                total:{" "}
                <span style={{ color: "#00FF41" }}>
                  {formatTotalDuration(result.totalDurationMs)}
                </span>
              </span>
              {result.enrichment.data && (
                <span>
                  target:{" "}
                  <span style={{ color: "#00FF41" }}>
                    {result.enrichment.data.name}
                  </span>
                </span>
              )}
            </div>

            {/* Completed pipeline progress */}
            <div
              className="mb-6 px-5 py-5"
              style={{
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              <PipelineProgress
                result={result}
                currentStage={null}
                loading={false}
              />
            </div>

            {/* Result tabs */}
            <div
              className="flex gap-0 mb-6"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              {RESULT_TABS.map((tab) => {
                const stageData = result[tab.key];
                const isAvailable = stageData.status === "complete";
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => isAvailable && setActiveTab(tab.key)}
                    className="px-5 py-3 transition-colors"
                    style={{
                      fontFamily: "var(--font-day29-mono)",
                      fontSize: "12px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color:
                        activeTab === tab.key
                          ? "#00FF41"
                          : isAvailable
                            ? "#555"
                            : "#333",
                      background: "transparent",
                      border: "none",
                      borderBottom:
                        activeTab === tab.key
                          ? "2px solid #00FF41"
                          : "2px solid transparent",
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      borderRadius: 0,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div
              className="p-6"
              style={{
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              {activeTab === "enrichment" && result.enrichment.data && (
                <StageEnrichment data={result.enrichment.data} />
              )}
              {activeTab === "outreach" && result.outreach.data && (
                <StageOutreach data={result.outreach.data} />
              )}
              {activeTab === "sequence" && result.sequence.data && (
                <StageSequence data={result.sequence.data} />
              )}
              {activeTab === "campaign" && result.campaign.data && (
                <StageCampaign data={result.campaign.data} />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
