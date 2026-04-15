"use client";

import type { AgentDefinition } from "@/types/day26";

interface AgentEditorProps {
  agents: AgentDefinition[];
  onChange: (agents: AgentDefinition[]) => void;
  disabled?: boolean;
}

export function AgentEditor({ agents, onChange, disabled }: AgentEditorProps) {
  function updateAgent(index: number, field: keyof AgentDefinition, value: string) {
    const updated = [...agents];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addAgent() {
    if (agents.length >= 4) return;
    onChange([
      ...agents,
      { name: "", systemPrompt: "", description: "" },
    ]);
  }

  function removeAgent(index: number) {
    if (agents.length <= 2) return;
    const updated = agents.filter((_, i) => i !== index);
    onChange(updated);
  }

  function moveAgent(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= agents.length) return;
    const updated = [...agents];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-day26-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          AGENTS ({agents.length}/4)
        </span>
        {agents.length < 4 && (
          <button
            onClick={addAgent}
            disabled={disabled}
            className="px-3 py-1 transition-all"
            style={{
              fontFamily: "var(--font-day26-mono)",
              fontSize: "11px",
              letterSpacing: "1px",
              color: disabled ? "#555" : "#00FF41",
              background: disabled ? "#111111" : "rgba(0,255,65,0.08)",
              border: `1px solid ${disabled ? "#2a2a2a" : "rgba(0,255,65,0.2)"}`,
              borderRadius: 0,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            + ADD AGENT
          </button>
        )}
      </div>

      {/* Agent cards */}
      {agents.map((agent, index) => (
        <div
          key={index}
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {/* Agent header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: "1px solid #2a2a2a",
              background: "#161616",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-6 h-6"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#0a0a0a",
                  background: "#00FF41",
                  borderRadius: 0,
                }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "12px",
                  color: "#eeeeee",
                }}
              >
                {agent.name || `Agent ${index + 1}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Move up */}
              {index > 0 && (
                <button
                  onClick={() => moveAgent(index, "up")}
                  disabled={disabled}
                  className="px-2 py-1 transition-all"
                  style={{
                    fontFamily: "var(--font-day26-mono)",
                    fontSize: "11px",
                    color: disabled ? "#555" : "#999",
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  &#9650;
                </button>
              )}
              {/* Move down */}
              {index < agents.length - 1 && (
                <button
                  onClick={() => moveAgent(index, "down")}
                  disabled={disabled}
                  className="px-2 py-1 transition-all"
                  style={{
                    fontFamily: "var(--font-day26-mono)",
                    fontSize: "11px",
                    color: disabled ? "#555" : "#999",
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  &#9660;
                </button>
              )}
              {/* Remove */}
              {agents.length > 2 && (
                <button
                  onClick={() => removeAgent(index)}
                  disabled={disabled}
                  className="px-2 py-1 transition-all"
                  style={{
                    fontFamily: "var(--font-day26-mono)",
                    fontSize: "11px",
                    color: disabled ? "#555" : "#ff4444",
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  &#10005;
                </button>
              )}
            </div>
          </div>

          {/* Agent fields */}
          <div className="p-4 space-y-3">
            {/* Name */}
            <div>
              <label
                className="block mb-1"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                NAME
              </label>
              <input
                type="text"
                value={agent.name}
                onChange={(e) => updateAgent(index, "name", e.target.value)}
                disabled={disabled}
                placeholder="e.g. Research Analyst"
                maxLength={50}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#0a0a0a",
                  border: "1px solid #2a2a2a",
                  color: "#eeeeee",
                  fontFamily: "var(--font-day26-body)",
                  fontSize: "14px",
                  outline: "none",
                  borderRadius: 0,
                }}
                className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block mb-1"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                DESCRIPTION
              </label>
              <input
                type="text"
                value={agent.description}
                onChange={(e) => updateAgent(index, "description", e.target.value)}
                disabled={disabled}
                placeholder="What this agent does..."
                maxLength={200}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#0a0a0a",
                  border: "1px solid #2a2a2a",
                  color: "#eeeeee",
                  fontFamily: "var(--font-day26-body)",
                  fontSize: "14px",
                  outline: "none",
                  borderRadius: 0,
                }}
                className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label
                className="block mb-1"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                SYSTEM PROMPT
              </label>
              <textarea
                value={agent.systemPrompt}
                onChange={(e) => updateAgent(index, "systemPrompt", e.target.value)}
                disabled={disabled}
                placeholder="Instructions for this agent..."
                maxLength={2000}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#0a0a0a",
                  border: "1px solid #2a2a2a",
                  color: "#eeeeee",
                  fontFamily: "var(--font-day26-body)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  outline: "none",
                  borderRadius: 0,
                  resize: "vertical",
                  height: "120px",
                }}
                className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
              />
              <div
                className="flex justify-end mt-1"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "10px",
                  color: "#555",
                }}
              >
                {agent.systemPrompt.length} / 2000
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pipeline visualization */}
      {agents.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 py-2"
          style={{
            fontFamily: "var(--font-day26-mono)",
            fontSize: "11px",
            color: "#555",
          }}
        >
          {agents.map((a, i) => (
            <span key={i} className="flex items-center gap-2">
              <span style={{ color: a.name ? "#00FF41" : "#555" }}>
                {a.name || `Agent ${i + 1}`}
              </span>
              {i < agents.length - 1 && (
                <span style={{ color: "#00FF41" }}>&rarr;</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
