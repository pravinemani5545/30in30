"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DiffExcerptProps {
  before: string | null;
  after: string | null;
}

export function DiffExcerpt({ before, after }: DiffExcerptProps) {
  const [open, setOpen] = useState(false);

  if (!before && !after) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {open ? "Hide change" : "Show change"}
      </button>

      {open && (
        <div
          className="mt-2 rounded-md p-3 text-xs font-mono space-y-2"
          style={{
            background: "var(--surface-raised)",
            color: "var(--text-secondary)",
          }}
        >
          {before && (
            <div>
              <span
                className="text-[10px] font-sans font-medium uppercase tracking-wider"
                style={{ color: "var(--error)" }}
              >
                Before
              </span>
              <p className="mt-1 leading-relaxed">{before}</p>
            </div>
          )}
          {after && (
            <div>
              <span
                className="text-[10px] font-sans font-medium uppercase tracking-wider"
                style={{ color: "var(--success)" }}
              >
                After
              </span>
              <p className="mt-1 leading-relaxed">{after}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
