"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Improvement } from "@/types";

interface RewriteCardProps {
  improvement: Improvement;
  index: number;
}

export function RewriteCard({ improvement, index }: RewriteCardProps) {
  const [copied, setCopied] = useState(false);
  const label = String(index + 1).padStart(2, "0");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(improvement.rewrite);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-surface-elevated border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:border-text-muted"
        aria-label="Copy rewrite"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-score-green" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-text-muted" />
        )}
      </button>

      <div className="space-y-3">
        <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
          {label}
        </span>
        <p className="text-text-primary text-sm leading-relaxed pr-8">
          {improvement.rewrite}
        </p>
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
            {improvement.reasoning}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-accent">
            Key change: {improvement.what_changed}
          </p>
        </div>
      </div>
    </div>
  );
}
