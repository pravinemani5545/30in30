"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/day15/useCopyToClipboard";

interface SubjectLineTabsProps {
  subjectA: string;
  subjectB: string;
}

export function SubjectLineTabs({
  subjectA,
  subjectB,
}: SubjectLineTabsProps) {
  const [active, setActive] = useState<"A" | "B">("A");
  const [copied, setCopied] = useState(false);
  const { copy } = useCopyToClipboard();

  const subject = active === "A" ? subjectA : subjectB;
  const charCount = subject.length;

  const handleCopy = async () => {
    const ok = await copy(subject, "Subject line copied");
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActive("A")}
          className="rounded px-2 py-0.5 text-[10px] font-bold uppercase transition-colors"
          style={{
            background:
              active === "A" ? "var(--variant-a)" : "var(--surface-raised)",
            color:
              active === "A" ? "#fff" : "var(--text-secondary)",
          }}
        >
          A
        </button>
        <button
          onClick={() => setActive("B")}
          className="rounded px-2 py-0.5 text-[10px] font-bold uppercase transition-colors"
          style={{
            background:
              active === "B" ? "var(--variant-b)" : "var(--surface-raised)",
            color:
              active === "B" ? "#fff" : "var(--text-secondary)",
          }}
        >
          B
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <p
          className="text-[15px] font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {subject}
        </p>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded p-1 transition-colors hover:opacity-70"
          title="Copy subject line"
        >
          {copied ? (
            <Check size={14} style={{ color: "var(--success)" }} />
          ) : (
            <Copy size={14} style={{ color: "var(--text-secondary)" }} />
          )}
        </button>
      </div>

      <p
        className="text-xs"
        style={{
          color: charCount > 50 ? "var(--accent)" : "var(--text-tertiary)",
        }}
      >
        {charCount} chars{charCount > 50 ? " — may truncate on mobile" : ""}
      </p>
    </div>
  );
}
