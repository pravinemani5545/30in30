"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/day12/useCopyToClipboard";

export function SectionCopyButton({ text }: { text: string }) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className="p-1 rounded transition-colors hover:bg-white/5"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
      ) : (
        <Copy
          className="h-3.5 w-3.5"
          style={{ color: "var(--text-tertiary)" }}
        />
      )}
    </button>
  );
}
