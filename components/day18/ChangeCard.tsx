"use client";

import { ExternalLink } from "lucide-react";
import { ChangeTypeBadge } from "./ChangeTypeBadge";
import { DiffExcerpt } from "./DiffExcerpt";
import { OutreachPromptBox } from "./OutreachPromptBox";
import type { CompanyChange } from "@/types/day18";

interface ChangeCardProps {
  change: CompanyChange;
  onGenerateOutreach: (
    changeId: string,
  ) => Promise<{ outreachAngle?: string; error?: string }>;
}

export function ChangeCard({ change, onGenerateOutreach }: ChangeCardProps) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header: company name + badge */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          {change.favicon_url && (
            <img
              src={change.favicon_url}
              alt=""
              width={16}
              height={16}
              className="rounded-sm flex-shrink-0"
            />
          )}
          <span
            className="text-[15px] font-semibold truncate"
            style={{ color: "var(--foreground)" }}
          >
            {change.domain ?? extractDomain(change.url)}
          </span>
        </div>
        <ChangeTypeBadge type={change.change_type} />
      </div>

      {/* URL */}
      <a
        href={change.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs flex items-center gap-1 mb-3 hover:underline"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span className="truncate max-w-[300px]">{change.url}</span>
        <ExternalLink size={10} className="flex-shrink-0" />
      </a>

      {/* Date */}
      <p className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
        {formatRelative(change.detected_at)}
      </p>

      {/* Summary */}
      <p
        className="text-sm leading-[1.65] mb-3"
        style={{ color: "var(--foreground)" }}
      >
        {change.summary}
      </p>

      {/* Diff excerpt */}
      {(change.before_excerpt || change.after_excerpt) && (
        <DiffExcerpt
          before={change.before_excerpt}
          after={change.after_excerpt}
        />
      )}

      {/* Outreach prompt */}
      <OutreachPromptBox
        change={change}
        onGenerate={onGenerateOutreach}
      />
    </div>
  );
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `Detected ${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}
