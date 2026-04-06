"use client";

import { Eye } from "lucide-react";
import { AddUrlForm } from "./AddUrlForm";
import { CompanyRow } from "./CompanyRow";
import type { TrackedCompany } from "@/types/day18";

interface WatchlistPanelProps {
  companies: TrackedCompany[];
  loading: boolean;
  adding: boolean;
  addCompany: (url: string) => Promise<{ error?: string }>;
  removeCompany: (id: string) => Promise<{ error?: string }>;
}

export function WatchlistPanel({
  companies,
  loading,
  adding,
  addCompany,
  removeCompany,
}: WatchlistPanelProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Eye size={16} style={{ color: "var(--accent)" }} />
        <h2
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          Watching {companies.length} compan{companies.length === 1 ? "y" : "ies"}
        </h2>
      </div>

      <AddUrlForm onAdd={addCompany} adding={adding} />

      <div className="mt-4 space-y-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-md skeleton-pulse"
              style={{ background: "var(--surface-raised)" }}
            />
          ))
        ) : companies.length === 0 ? (
          <p
            className="text-sm py-8 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            Add a company URL to start tracking
          </p>
        ) : (
          companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              onRemove={removeCompany}
            />
          ))
        )}
      </div>
    </div>
  );
}
