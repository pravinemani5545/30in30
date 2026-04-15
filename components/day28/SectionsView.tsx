"use client";

import type { ChangelogSection } from "@/types/day28";

interface SectionsViewProps {
  sections: ChangelogSection[];
}

const SECTION_COLORS: Record<string, string> = {
  features: "#00FF41",
  "new features": "#00FF41",
  added: "#00FF41",
  fixes: "#EF4444",
  "bug fixes": "#EF4444",
  bugfixes: "#EF4444",
  improvements: "#E8A020",
  improved: "#E8A020",
  enhancements: "#E8A020",
  performance: "#E8A020",
  breaking: "#8B5CF6",
  "breaking changes": "#8B5CF6",
  deprecated: "#8B5CF6",
  removed: "#EF4444",
  security: "#EF4444",
  docs: "#06B6D4",
  documentation: "#06B6D4",
  refactor: "#06B6D4",
  chores: "#555555",
  other: "#555555",
};

function getSectionColor(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, color] of Object.entries(SECTION_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "#00FF41";
}

export function SectionsView({ sections }: SectionsViewProps) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        const color = getSectionColor(section.title);
        return (
          <div
            key={i}
            style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
            }}
          >
            {/* Section header */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                borderBottom: "1px solid #2a2a2a",
                background: "#161616",
              }}
            >
              <span style={{ fontSize: "16px" }}>{section.emoji}</span>
              <span
                style={{
                  fontFamily: "var(--font-day28-heading)",
                  fontWeight: 600,
                  fontSize: "14px",
                  color,
                }}
              >
                {section.title}
              </span>
              <span
                className="ml-auto"
                style={{
                  fontFamily: "var(--font-day28-mono)",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                {section.items.length} item{section.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Items */}
            <div className="p-4 space-y-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3">
                  <span
                    className="mt-2 flex-shrink-0"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: color,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-day28-body)",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "#ccc",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
