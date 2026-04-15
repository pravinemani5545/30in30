"use client";

import type { SavedWorkflow } from "@/types/day26";

interface SavedWorkflowsListProps {
  workflows: SavedWorkflow[];
  loading: boolean;
  onLoad: (workflow: SavedWorkflow) => void;
}

export function SavedWorkflowsList({
  workflows,
  loading,
  onLoad,
}: SavedWorkflowsListProps) {
  if (loading) {
    return (
      <div
        className="py-12 text-center"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          color: "#555",
        }}
      >
        {">"} loading workflows...
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div
        className="py-12 text-center"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          color: "#555",
        }}
      >
        {">"} no saved workflows yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <span
        className="block"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        SAVED WORKFLOWS ({workflows.length})
      </span>

      {workflows.map((workflow) => {
        const date = new Date(workflow.created_at);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const agentCount = workflow.definition?.agents?.length ?? 0;

        return (
          <div
            key={workflow.id}
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
            }}
          >
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  fontFamily: "var(--font-day26-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#eeeeee",
                }}
              >
                {workflow.name}
              </div>
              <div
                className="flex items-center gap-3 mt-1"
                style={{
                  fontFamily: "var(--font-day26-mono)",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                <span>{agentCount} agents</span>
                <span>&middot;</span>
                <span>{dateStr}</span>
              </div>
            </div>

            <button
              onClick={() => onLoad(workflow)}
              className="flex-shrink-0 px-3 py-1.5 ml-4 transition-all"
              style={{
                fontFamily: "var(--font-day26-mono)",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#00FF41",
                background: "rgba(0,255,65,0.08)",
                border: "1px solid rgba(0,255,65,0.2)",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              LOAD
            </button>
          </div>
        );
      })}
    </div>
  );
}
