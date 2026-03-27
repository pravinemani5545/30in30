"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { CodeReview, FindingSeverity } from "@/types/day10";
import { SeveritySummaryBar } from "./SeveritySummaryBar";
import { FindingCard } from "./FindingCard";
import { CleanStateBanner } from "./CleanStateBanner";

const GROUP_DELAYS: Record<FindingSeverity, number> = {
  critical: 0,
  high: 0.2,
  medium: 0.35,
  low: 0.45,
};

const WITHIN_GROUP_DELAY = 0.08;

export function ReviewResults({ review }: { review: CodeReview }) {
  const groupRefs = useRef<Partial<Record<FindingSeverity, HTMLDivElement>>>({});

  const scrollToSeverity = useCallback((severity: FindingSeverity) => {
    groupRefs.current[severity]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const findings = review.findings ?? [];
  const isClean =
    review.critical_count === 0 && review.high_count === 0;

  // Group findings by severity
  const groups: Record<FindingSeverity, typeof findings> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };
  for (const f of findings) {
    groups[f.severity].push(f);
  }

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {review.summary && (
        <div>
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Summary
          </h2>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {review.summary}
          </p>
        </div>
      )}

      {/* Severity bar */}
      <SeveritySummaryBar
        criticalCount={review.critical_count}
        highCount={review.high_count}
        mediumCount={review.medium_count}
        lowCount={review.low_count}
        onSeverityClick={scrollToSeverity}
      />

      {/* Clean state */}
      {isClean && <CleanStateBanner />}

      {/* Findings by severity group */}
      {(["critical", "high", "medium", "low"] as FindingSeverity[]).map(
        (severity) => {
          const group = groups[severity];
          if (group.length === 0) return null;

          return (
            <div
              key={severity}
              ref={(el) => {
                if (el) groupRefs.current[severity] = el;
              }}
              className="space-y-3"
            >
              {group.map((finding, idx) => (
                <motion.div
                  key={`${severity}-${idx}`}
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, x: -8 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: reducedMotion
                      ? 0
                      : GROUP_DELAYS[severity] + idx * WITHIN_GROUP_DELAY,
                  }}
                >
                  <FindingCard finding={finding} />
                </motion.div>
              ))}
            </div>
          );
        }
      )}

      {/* Metadata */}
      <div
        className="flex flex-wrap gap-4 pt-4 text-[12px]"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <span>
          {review.confirmed_language ?? review.detected_language} ·{" "}
          {review.total_lines} lines
        </span>
        {review.review_ms && <span>{review.review_ms}ms</span>}
        <span>{review.ai_model_used}</span>
      </div>
    </div>
  );
}
