"use client";

import type { ChangeType } from "@/types/day18";

const FILTERS: { label: string; value: ChangeType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pricing", value: "pricing" },
  { label: "Feature", value: "feature" },
  { label: "Hiring", value: "hiring" },
  { label: "Messaging", value: "messaging" },
];

interface FeedFiltersProps {
  activeFilter: ChangeType | "all";
  onFilterChange: (filter: ChangeType | "all") => void;
}

export function FeedFilters({ activeFilter, onFilterChange }: FeedFiltersProps) {
  return (
    <div className="flex gap-1 mt-3">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeFilter === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            style={{
              background: isActive ? "var(--accent)" : "var(--surface-raised)",
              color: isActive ? "var(--background)" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
