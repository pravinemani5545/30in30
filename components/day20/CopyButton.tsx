"use client";

import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/day20/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  async function handleCopy() {
    const ok = await copy(text);
    if (ok) {
      toast("> copied to clipboard [OK]", {
        style: {
          background: "#161616",
          border: "1px solid #2a2a2a",
          color: "#00FF41",
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 transition-colors"
      style={{
        fontFamily: "var(--font-day20-mono)",
        fontSize: "11px",
        color: copied ? "#00FF41" : "#555",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
      }}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" style={{ color: "#00FF41" }} />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
}
