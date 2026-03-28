"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { EmailGrade } from "@/types/day11";
import { useCopyToClipboard } from "@/hooks/day11/useCopyToClipboard";
import { useGrade } from "@/hooks/day11/useGrade";

interface RewritePanelProps {
  grade: EmailGrade;
  onRegrade?: (newGrade: EmailGrade) => void;
}

export function RewritePanel({ grade, onRegrade }: RewritePanelProps) {
  const { copied, copy } = useCopyToClipboard();
  const { gradeEmail, isLoading: isRegrading } = useGrade();

  if (!grade.rewrite_email) return null;

  const projectedColor =
    (grade.rewrite_projected_score ?? 0) >= 75
      ? "#22C55E"
      : (grade.rewrite_projected_score ?? 0) >= 70
        ? "#E8A020"
        : "#EF4444";

  async function handleRegrade() {
    if (!grade.rewrite_email) return;
    await gradeEmail(grade.rewrite_email);
    // The useGrade hook's grade state will be updated
    // Parent can listen via onRegrade if needed
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-md border p-4"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="font-sans font-bold text-sm"
          style={{ color: "var(--foreground)" }}
        >
          Improved version
        </h3>
        {grade.rewrite_projected_score != null && (
          <span
            className="text-xs font-sans font-bold px-2 py-0.5 rounded-full"
            style={{
              color: projectedColor,
              backgroundColor: `${projectedColor}18`,
            }}
          >
            projected: {grade.rewrite_projected_score}/100
          </span>
        )}
      </div>

      <div
        className="font-sans whitespace-pre-wrap mb-3"
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "var(--foreground)",
        }}
      >
        {grade.rewrite_email}
      </div>

      {grade.rewrite_explanation && (
        <div className="mb-3">
          <p
            className="font-sans font-bold text-xs mb-1 uppercase"
            style={{
              color: "var(--text-secondary)",
              letterSpacing: "0.08em",
              fontSize: "10px",
            }}
          >
            Why this scores higher
          </p>
          <p
            className="font-sans"
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "var(--text-secondary)",
            }}
          >
            {grade.rewrite_explanation}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => copy(grade.rewrite_email!)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-bold border transition-colors"
          style={{
            borderColor: copied ? "#22C55E" : "var(--border)",
            color: copied ? "#22C55E" : "var(--text-secondary)",
            backgroundColor: copied ? "rgb(34 197 94 / 0.08)" : "transparent",
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>

        <button
          type="button"
          onClick={handleRegrade}
          disabled={isRegrading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-bold border transition-colors disabled:opacity-50"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <RefreshCw size={14} className={isRegrading ? "animate-spin" : ""} />
          Grade the rewrite
        </button>
      </div>
    </motion.div>
  );
}
