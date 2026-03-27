"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/day10/useCopyToClipboard";

export function SuggestedFix({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="relative mt-3">
      <div
        className="flex items-center justify-between px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider"
        style={{
          background: "var(--surface-raised)",
          color: "var(--text-tertiary)",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <span>Suggested Fix</span>
        <button
          onClick={() => copy(code)}
          className="flex items-center gap-1 transition-colors"
          style={{ color: copied ? "var(--success)" : "var(--text-tertiary)" }}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre
        className="overflow-x-auto p-3 text-[13px] leading-relaxed font-mono"
        style={{
          background: "var(--code-bg, #0D0D0D)",
          color: "var(--code-text, #E2E8F0)",
          borderRadius: "0 0 4px 4px",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
