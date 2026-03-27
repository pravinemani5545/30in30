"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { LanguageBadge } from "./LanguageBadge";
import { useLanguageDetect } from "@/hooks/day10/useLanguageDetect";

interface CodeInputProps {
  onSubmit: (code: string, language: string) => void;
  isLoading: boolean;
}

export function CodeInput({ onSubmit, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const { language, confidence } = useLanguageDetect(code);

  function handleSubmit() {
    if (code.trim().length < 10 || isLoading) return;
    onSubmit(code, language);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste any code snippet here..."
          className="w-full min-h-[280px] p-4 pr-24 text-[13px] font-mono leading-relaxed resize-y focus:outline-none"
          style={{
            background: "var(--code-bg, #0D0D0D)",
            color: "var(--code-text, #E2E8F0)",
            border: "1px solid var(--border)",
            borderRadius: 6,
          }}
          maxLength={15000}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) handleSubmit();
          }}
        />
        <LanguageBadge language={language} confidence={confidence} />
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-[12px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Reviewed as production code.
        </span>

        <button
          onClick={handleSubmit}
          disabled={code.trim().length < 10 || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all disabled:opacity-40"
          style={{
            background: "var(--accent)",
            color: "var(--background)",
            borderRadius: 6,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.background = "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent)";
          }}
        >
          Review
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {code.length > 0 && (
        <div
          className="text-[11px] text-right"
          style={{ color: "var(--text-tertiary)" }}
        >
          {code.length.toLocaleString()} / 15,000
        </div>
      )}
    </div>
  );
}
