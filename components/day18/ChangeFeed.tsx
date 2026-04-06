"use client";

import { RefreshCw } from "lucide-react";
import { FeedFilters } from "./FeedFilters";
import { DigestSummary } from "./DigestSummary";
import { ChangeCard } from "./ChangeCard";
import { EmptyFeedState } from "./EmptyFeedState";
import type { CompanyChange, ChangeType } from "@/types/day18";

interface ChangeFeedProps {
  changes: CompanyChange[];
  loading: boolean;
  activeFilter: ChangeType | "all";
  setActiveFilter: (filter: ChangeType | "all") => void;
  days: number;
  setDays: (days: number) => void;
  refresh: () => void;
  generateOutreach: (
    changeId: string,
  ) => Promise<{ outreachAngle?: string; error?: string }>;
}

export function ChangeFeed({
  changes,
  loading,
  activeFilter,
  setActiveFilter,
  days,
  refresh,
  generateOutreach,
}: ChangeFeedProps) {
  return (
    <div className="p-4 lg:p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2
            className="text-[22px]"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--foreground)",
            }}
          >
            Changes
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "var(--surface-raised)",
              color: "var(--text-secondary)",
            }}
          >
            Last {days} days
          </span>
        </div>
        <button
          onClick={refresh}
          className="p-2 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Refresh feed"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Digest summary */}
      {changes.length > 0 && <DigestSummary changes={changes} />}

      {/* Filters */}
      <FeedFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Change cards */}
      {loading ? (
        <div className="space-y-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-lg skeleton-pulse"
              style={{ background: "var(--surface)" }}
            />
          ))}
        </div>
      ) : changes.length === 0 ? (
        <EmptyFeedState days={days} />
      ) : (
        <div className="space-y-3 mt-4">
          {changes.map((change) => (
            <ChangeCard
              key={change.id}
              change={change}
              onGenerateOutreach={generateOutreach}
            />
          ))}
        </div>
      )}
    </div>
  );
}
