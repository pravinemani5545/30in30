"use client";

import { SECTION_COLORS } from "@/lib/day14/script/structure";
import type { ScriptSection as ScriptSectionType } from "@/types/day14";
import { StreamingCursor } from "./StreamingCursor";

interface ScriptSectionProps {
  section: ScriptSectionType;
  isActive: boolean;
}

export function ScriptSection({ section, isActive }: ScriptSectionProps) {
  const borderColor = SECTION_COLORS[section.marker] ?? "var(--accent)";

  return (
    <div
      className="rounded-md px-4 py-3"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        background: "var(--surface-raised, #1A1A1A)",
      }}
    >
      <span
        className="mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{
          color: borderColor,
          background: `color-mix(in srgb, ${borderColor} 12%, transparent)`,
          fontFamily: "var(--font-sans)",
        }}
      >
        {section.label}
      </span>
      <div
        className="text-[15px] leading-[1.75] whitespace-pre-wrap"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-sans)",
          fontWeight: section.marker === "[HOOK]" ? 500 : 400,
        }}
      >
        {section.content}
        {isActive && <StreamingCursor />}
      </div>
    </div>
  );
}
