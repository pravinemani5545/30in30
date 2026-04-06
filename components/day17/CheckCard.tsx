"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import type { CheckResult, CheckExplanation, CheckStatus } from "@/types/day17";

function getStatus(result: CheckResult): CheckStatus {
  if (result.passed && !result.warning) return "pass";
  if (result.passed && result.warning) return "warning";
  if (!result.passed && result.warning) return "unknown";
  return "fail";
}

const STATUS_COLORS: Record<CheckStatus, string> = {
  pass: "var(--check-pass)",
  warning: "var(--check-warn)",
  fail: "var(--check-fail)",
  unknown: "var(--check-unknown)",
};

const STATUS_LABELS: Record<CheckStatus, string> = {
  pass: "PASS",
  warning: "WARNING",
  fail: "FAIL",
  unknown: "UNKNOWN",
};

const StatusIcon = ({ status }: { status: CheckStatus }) => {
  const color = STATUS_COLORS[status];
  const size = 16;
  switch (status) {
    case "pass":
      return <CheckCircle2 size={size} style={{ color }} />;
    case "warning":
      return <AlertTriangle size={size} style={{ color }} />;
    case "fail":
      return <XCircle size={size} style={{ color }} />;
    case "unknown":
      return <HelpCircle size={size} style={{ color }} />;
  }
};

interface CheckCardProps {
  name: string;
  result: CheckResult;
  explanation: CheckExplanation;
}

export function CheckCard({ name, result, explanation }: CheckCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(result);
  const color = STATUS_COLORS[status];
  const isLongRecord = (result.rawRecord?.length ?? 0) > 80;

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span
          className="text-[13px] font-bold uppercase tracking-wider"
          style={{ color: "var(--foreground)", letterSpacing: "0.1em" }}
        >
          {name}
        </span>
        <span
          className="flex items-center gap-1.5 text-xs font-medium rounded px-2 py-0.5"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          <StatusIcon status={status} />
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Raw record */}
        {result.rawRecord && (
          <div>
            {isLongRecord ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="font-mono">
                  {expanded
                    ? result.rawRecord
                    : result.rawRecord.slice(0, 80) + "..."}
                </span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            ) : (
              <p
                className="text-xs font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {result.rawRecord}
              </p>
            )}
          </div>
        )}

        {/* Explanation */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--foreground)", lineHeight: 1.65 }}
        >
          {explanation.explanation}
        </p>

        {/* Remediation */}
        {explanation.remediation && (status === "fail" || status === "warning") && (
          <p className="text-[13px] font-medium" style={{ color: "var(--check-warn)" }}>
            <span className="font-bold">Action required: </span>
            {explanation.remediation}
          </p>
        )}
      </div>
    </div>
  );
}
