"use client";

import { ICP_QUESTIONS } from "@/lib/day13/icp/questions";
import { useRef, useEffect } from "react";

interface PreviousAnswersProps {
  answers: Record<string, string>;
  answeredCount: number;
  scrollToIndex: number | null;
}

export function PreviousAnswers({
  answers,
  answeredCount,
  scrollToIndex,
}: PreviousAnswersProps) {
  const refs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (scrollToIndex !== null) {
      const el = refs.current.get(scrollToIndex);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollToIndex]);

  if (answeredCount === 0) return null;

  const answered = ICP_QUESTIONS.slice(0, answeredCount);

  return (
    <div className="space-y-4 mb-8">
      {answered.map((q, i) => (
        <div
          key={q.key}
          ref={(el) => {
            if (el) refs.current.set(i, el);
          }}
          className="pb-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {String(i + 1).padStart(2, "0")}. {q.question}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--foreground)" }}
          >
            {answers[q.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
