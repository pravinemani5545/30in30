"use client";

import type { SingleEmail } from "@/types/day15";
import { useCopyToClipboard } from "@/hooks/day15/useCopyToClipboard";
import { Copy } from "lucide-react";

interface SequenceActionsProps {
  emails: SingleEmail[];
}

export function SequenceActions({ emails }: SequenceActionsProps) {
  const { copy } = useCopyToClipboard();

  const handleCopyAll = () => {
    const text = emails
      .map(
        (e) =>
          `--- Email ${e.emailNumber}: ${e.emailType.replace(/_/g, " ").toUpperCase()} (Day ${e.sendDay}) ---\nSubject: ${e.subjectA}\n\n${e.body}`,
      )
      .join("\n\n");
    copy(text, "Full sequence copied");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopyAll}
        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
        style={{
          background: "var(--surface-raised)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        }}
      >
        <Copy size={14} />
        Copy full sequence
      </button>
    </div>
  );
}
