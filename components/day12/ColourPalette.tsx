"use client";

import { ColourSwatch } from "./ColourSwatch";
import { SectionCopyButton } from "./SectionCopyButton";
import type { ColourSwatch as ColourSwatchType } from "@/types/day12";

interface ColourPaletteProps {
  palette: ColourSwatchType[];
  rationale: string;
}

export function ColourPalette({ palette, rationale }: ColourPaletteProps) {
  const copyText = palette.map((c) => `${c.hex} (${c.role})`).join(", ") + "\n" + rationale;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.1em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          COLOUR PALETTE
        </span>
        <SectionCopyButton text={copyText} />
      </div>
      <div className="flex gap-3">
        {palette.map((swatch) => (
          <ColourSwatch key={swatch.hex} hex={swatch.hex} role={swatch.role} />
        ))}
      </div>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {rationale}
      </p>
    </div>
  );
}
