"use client";

import { OUTPUT_TYPES } from "@/lib/day20/pipeline/outputs";
import type { OutputType } from "@/types/day20";

interface OutputTogglePillsProps {
  selected: OutputType[];
  onToggle: (key: OutputType) => void;
}

export function OutputTogglePills({
  selected,
  onToggle,
}: OutputTogglePillsProps) {
  return (
    <div>
      <label
        className="block mb-3"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        OUTPUT FORMATS
      </label>
      <div className="flex flex-wrap gap-2">
        {OUTPUT_TYPES.map((ot) => {
          const isOn = selected.includes(ot.key);
          return (
            <button
              key={ot.key}
              type="button"
              onClick={() => onToggle(ot.key)}
              className="transition-all duration-200"
              style={{
                fontFamily: "var(--font-day20-mono)",
                fontSize: "12px",
                padding: "6px 14px",
                border: isOn
                  ? "1px solid rgba(0,255,65,0.2)"
                  : "1px solid #2a2a2a",
                background: isOn ? "rgba(0,255,65,0.08)" : "#161616",
                color: isOn ? "#00FF41" : "#555",
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              {ot.tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
