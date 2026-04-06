"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { TrackedCompany } from "@/types/day18";

interface CompanyRowProps {
  company: TrackedCompany;
  onRemove: (id: string) => Promise<{ error?: string }>;
}

export function CompanyRow({ company, onRemove }: CompanyRowProps) {
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    const { error } = await onRemove(company.id);
    if (error) {
      toast.error(error);
      setRemoving(false);
    }
  }

  const statusColor = company.fetch_error
    ? "var(--status-error)"
    : company.last_checked_at
      ? "var(--status-active)"
      : "var(--status-pending)";

  const lastChecked = company.last_checked_at
    ? formatRelative(company.last_checked_at)
    : "Not checked yet";

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-md group transition-colors"
      style={{ background: "transparent" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface-raised)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {/* Favicon */}
      {company.favicon_url ? (
        <img
          src={company.favicon_url}
          alt=""
          width={16}
          height={16}
          className="rounded-sm flex-shrink-0"
        />
      ) : (
        <div
          className="w-4 h-4 rounded-sm flex-shrink-0"
          style={{ background: "var(--border)" }}
        />
      )}

      {/* Company info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm font-medium truncate"
            style={{ color: "var(--foreground)" }}
          >
            {company.domain}
          </span>
          {company.is_js_rendered && (
            <AlertTriangle size={12} style={{ color: "var(--status-pending)" }} />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: statusColor }}
          />
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {lastChecked}
          </span>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        disabled={removing}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[var(--surface-raised)]"
        style={{ color: "var(--text-tertiary)" }}
        title="Remove from watchlist"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
