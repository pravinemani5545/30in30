"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { FollowUpSuggestion, FollowUpTone } from "@/types";

const toneConfig: Record<FollowUpTone, { label: string; color: string; bg: string }> = {
  warm: {
    label: "Warm",
    color: "#E8A020",
    bg: "rgba(232, 160, 32, 0.12)",
  },
  direct: {
    label: "Direct",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.12)",
  },
  casual: {
    label: "Casual",
    color: "#14B8A6",
    bg: "rgba(20, 184, 166, 0.12)",
  },
};

interface FollowUpCardProps {
  suggestion: FollowUpSuggestion;
  onMarkUsed?: (id: string) => void;
}

export function FollowUpCard({ suggestion, onMarkUsed }: FollowUpCardProps) {
  const [copied, copy] = useCopyToClipboard();
  const tone = toneConfig[suggestion.tone];

  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        opacity: suggestion.is_used ? 0.5 : 1,
        transition: "opacity 150ms",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Tone badge */}
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: 500,
              color: tone.color,
              background: tone.bg,
              marginBottom: "8px",
            }}
          >
            {tone.label}
          </span>

          {/* Message */}
          <p
            style={{
              color: "var(--foreground)",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            {suggestion.message_text}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={() => {
            copy(suggestion.message_text);
            if (!suggestion.is_used) {
              onMarkUsed?.(suggestion.id);
            }
          }}
          title="Copy message"
          style={{
            flexShrink: 0,
            padding: "6px 8px",
            background: copied ? "rgba(34, 197, 94, 0.12)" : "var(--surface-raised)",
            border: `1px solid ${copied ? "rgba(34, 197, 94, 0.3)" : "var(--border)"}`,
            borderRadius: "6px",
            color: copied ? "var(--success)" : "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            transition: "background 150ms, color 150ms, border-color 150ms",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {suggestion.is_used && (
        <p style={{ color: "var(--text-tertiary)", fontSize: "11px", marginTop: "8px" }}>
          Used
        </p>
      )}
    </div>
  );
}
