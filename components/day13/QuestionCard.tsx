"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ICPQuestion } from "@/types/day13";

interface QuestionCardProps {
  question: ICPQuestion;
  index: number;
  total: number;
  onSubmit: (answer: string) => void;
  isLastQuestion: boolean;
}

const MIN_CHARS = 20;

export function QuestionCard({
  question,
  index,
  total,
  onSubmit,
  isLastQuestion,
}: QuestionCardProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
    setValue("");
  }, [question.key]);

  // Auto-expand textarea
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    [],
  );

  // Cmd/Ctrl+Enter shortcut
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && value.trim().length >= MIN_CHARS) {
        e.preventDefault();
        onSubmit(value);
      }
    },
    [value, onSubmit],
  );

  const canSubmit = value.trim().length >= MIN_CHARS;

  return (
    <div className="space-y-4">
      {/* Question number */}
      <div
        className="text-xs font-bold tracking-widest"
        style={{ color: "var(--q-active)" }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Question text */}
      <h2
        className="text-lg leading-relaxed"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          color: "var(--foreground)",
        }}
      >
        {question.question}
      </h2>

      {/* Hint */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {question.hint}
      </p>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={3}
        className="w-full resize-none rounded-md border px-3 py-3 text-[15px] leading-relaxed outline-none transition-colors"
        style={{
          backgroundColor: "#0F0F0F",
          borderColor: value ? "var(--border)" : "var(--border)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans)",
          minHeight: "80px",
        }}
        placeholder="Be specific — vague answers produce vague profiles..."
      />

      {/* Character count + submit */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs tabular-nums"
          style={{
            color: canSubmit ? "var(--text-tertiary)" : "var(--text-tertiary)",
          }}
        >
          {value.trim().length} / {MIN_CHARS} min
        </span>

        <div className="flex items-center gap-3">
          <span
            className="text-xs hidden sm:inline"
            style={{ color: "var(--text-tertiary)" }}
          >
            ⌘↵ to continue
          </span>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit(value)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canSubmit
                ? "var(--accent)"
                : "var(--surface-raised)",
              color: canSubmit
                ? "var(--background)"
                : "var(--text-tertiary)",
            }}
          >
            {isLastQuestion ? "Synthesise ICP →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
