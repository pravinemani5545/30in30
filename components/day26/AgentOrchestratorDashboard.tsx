"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useOrchestrator } from "@/hooks/day26/useOrchestrator";
import { DEFAULT_AGENTS, DEFAULT_INPUT_PROMPT } from "@/lib/day26/templates";
import type { AgentDefinition, SavedWorkflow } from "@/types/day26";
import { AgentEditor } from "./AgentEditor";
import { WorkflowInput } from "./WorkflowInput";
import { ExecutionLog } from "./ExecutionLog";
import { SavedWorkflowsList } from "./SavedWorkflowsList";

type Tab = "build" | "history";

export function AgentOrchestratorDashboard() {
  const [tab, setTab] = useState<Tab>("build");
  const [agents, setAgents] = useState<AgentDefinition[]>([...DEFAULT_AGENTS]);
  const [inputPrompt, setInputPrompt] = useState(DEFAULT_INPUT_PROMPT);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    execute,
    execution,
    workflows,
    loading,
    executing,
    error,
    saveWorkflow,
    authenticated,
  } = useOrchestrator();

  async function handleExecute() {
    // Validate agents have required fields
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      if (!a.name.trim()) {
        toast(`Agent ${i + 1} needs a name`, {
          style: {
            background: "#161616",
            border: "1px solid rgba(255,68,68,0.15)",
            color: "#ff4444",
            fontFamily: "var(--font-day26-mono)",
            fontSize: "13px",
            borderRadius: 0,
          },
        });
        return;
      }
      if (a.systemPrompt.trim().length < 10) {
        toast(`Agent "${a.name}" needs a system prompt (min 10 chars)`, {
          style: {
            background: "#161616",
            border: "1px solid rgba(255,68,68,0.15)",
            color: "#ff4444",
            fontFamily: "var(--font-day26-mono)",
            fontSize: "13px",
            borderRadius: 0,
          },
        });
        return;
      }
    }

    if (inputPrompt.trim().length < 5) {
      toast("Input prompt must be at least 5 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    await execute({
      agents,
      inputPrompt: inputPrompt.trim(),
    });
  }

  async function handleSave() {
    const trimmedName = saveName.trim();
    if (!trimmedName) {
      toast("Enter a workflow name", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    setSaving(true);
    const success = await saveWorkflow(trimmedName, {
      agents,
      inputPrompt: inputPrompt.trim(),
    });
    setSaving(false);

    if (success) {
      setSaveName("");
      toast("Workflow saved", {
        style: {
          background: "#161616",
          border: "1px solid rgba(0,255,65,0.15)",
          color: "#00FF41",
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
    }
  }

  function handleLoadWorkflow(workflow: SavedWorkflow) {
    if (workflow.definition?.agents) {
      setAgents([...workflow.definition.agents]);
    }
    if (workflow.definition?.inputPrompt) {
      setInputPrompt(workflow.definition.inputPrompt);
    }
    setTab("build");
    toast(`Loaded "${workflow.name}"`, {
      style: {
        background: "#161616",
        border: "1px solid rgba(0,255,65,0.15)",
        color: "#00FF41",
        fontFamily: "var(--font-day26-mono)",
        fontSize: "13px",
        borderRadius: 0,
      },
    });
  }

  /* ─── Auth gate ─────────────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day26-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day26")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day26-mono)",
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
    <main className="flex-1 overflow-y-auto">
      {/* Hero section — only when no execution and not executing */}
      {!execution && !executing && (
        <section className="px-6 py-8 lg:py-10" style={{ background: "#0a0a0a" }}>
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="block mb-3"
              style={{
                fontFamily: "var(--font-day26-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              AGENT ORCHESTRATOR
            </span>

            <h2
              style={{
                fontFamily: "var(--font-day26-heading)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#eeeeee",
                marginBottom: "12px",
              }}
            >
              Build <span style={{ color: "#00FF41" }}>&rarr;</span> Execute
            </h2>

            <p
              className="mb-5 mx-auto max-w-md"
              style={{
                fontFamily: "var(--font-day26-body)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              Define multi-agent workflows. Each agent&apos;s output becomes the
              next agent&apos;s input. Sequential pipeline execution via Gemini.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5"
              style={{
                fontFamily: "var(--font-day26-mono)",
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
              ORCHESTRATOR v1.0
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section
        className="px-6"
        style={{
          background: "#0a0a0a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div className="max-w-3xl mx-auto flex gap-0">
          {(["build", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-3 transition-all"
              style={{
                fontFamily: "var(--font-day26-mono)",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: tab === t ? "#00FF41" : "#555",
                background: tab === t ? "#111111" : "transparent",
                borderBottom: tab === t ? "2px solid #00FF41" : "2px solid transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section
        className="px-6 py-8"
        style={{
          background: "#0a0a0a",
        }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {tab === "build" && (
            <>
              {/* Agent Editor */}
              <AgentEditor
                agents={agents}
                onChange={setAgents}
                disabled={executing}
              />

              {/* Divider */}
              <div style={{ borderTop: "1px solid #2a2a2a" }} />

              {/* Input + Execute */}
              <WorkflowInput
                value={inputPrompt}
                onChange={setInputPrompt}
                onExecute={handleExecute}
                executing={executing}
              />

              {/* Executing indicator */}
              {executing && (
                <div
                  className="p-4"
                  style={{
                    background: "#111111",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                  }}
                >
                  <div
                    className="flex items-center gap-3"
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "13px",
                      color: "#00FF41",
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
                    Executing {agents.length}-agent pipeline...
                  </div>
                  <div
                    className="mt-2 flex gap-2"
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "11px",
                      color: "#555",
                    }}
                  >
                    {agents.map((a, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span>{a.name}</span>
                        {i < agents.length - 1 && (
                          <span style={{ color: "#00FF41" }}>&rarr;</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div
                  className="p-3"
                  style={{
                    fontFamily: "var(--font-day26-mono)",
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

              {/* Execution results */}
              {execution && (
                <>
                  <div style={{ borderTop: "1px solid #2a2a2a" }} />
                  <ExecutionLog execution={execution} />
                </>
              )}

              {/* Save workflow */}
              <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "24px" }}>
                <span
                  className="block mb-3"
                  style={{
                    fontFamily: "var(--font-day26-mono)",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  SAVE WORKFLOW
                </span>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Workflow name..."
                    maxLength={100}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: "#060606",
                      border: "1px solid #2a2a2a",
                      color: "#eeeeee",
                      fontFamily: "var(--font-day26-body)",
                      fontSize: "14px",
                      outline: "none",
                      borderRadius: 0,
                    }}
                    className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving || !saveName.trim()}
                    className="px-4 py-2 transition-all"
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "12px",
                      letterSpacing: "1px",
                      color: saving || !saveName.trim() ? "#555" : "#00FF41",
                      background: saving || !saveName.trim() ? "#111111" : "rgba(0,255,65,0.08)",
                      border: `1px solid ${saving || !saveName.trim() ? "#2a2a2a" : "rgba(0,255,65,0.2)"}`,
                      borderRadius: 0,
                      cursor: saving || !saveName.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    {saving ? "SAVING..." : "SAVE"}
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "history" && (
            <SavedWorkflowsList
              workflows={workflows}
              loading={loading}
              onLoad={handleLoadWorkflow}
            />
          )}
        </div>
      </section>
    </main>
  );
}
