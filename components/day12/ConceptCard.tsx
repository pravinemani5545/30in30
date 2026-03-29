"use client";

import type { ThumbConcept } from "@/types/day12";
import { DriverBadge } from "./DriverBadge";
import { WinnerBanner } from "./WinnerBanner";
import { TextOverlayDisplay } from "./TextOverlayDisplay";
import { ColourPalette } from "./ColourPalette";
import { CompositionSteps } from "./CompositionSteps";
import { ABHypothesis } from "./ABHypothesis";
import { useCopyToClipboard } from "@/hooks/day12/useCopyToClipboard";
import { Copy, Check } from "lucide-react";

function buildFullBrief(concept: ThumbConcept): string {
  const lines = [
    `${concept.conceptName}`,
    `Driver: ${concept.driver.replace("_", " ")}`,
    "",
    `Text overlay: ${concept.textOverlay.join(" ")}`,
    "",
    `Colour palette:`,
    ...concept.colourPalette.map((c) => `  ${c.hex} — ${c.role}`),
    concept.paletteRationale,
    "",
    `Composition:`,
    ...concept.compositionSteps.map((s, i) => `  ${i + 1}. ${s}`),
    "",
    `A/B note: ${concept.abNote}`,
  ];
  return lines.join("\n");
}

export function ConceptCard({ concept }: { concept: ThumbConcept }) {
  const { copy, copied } = useCopyToClipboard();
  const isWinner = concept.isPredictedWinner;

  return (
    <div
      className="flex flex-col rounded-md border overflow-hidden"
      style={{
        backgroundColor: isWinner
          ? "rgb(232 160 32 / 0.04)"
          : "var(--surface)",
        borderColor: isWinner ? "#E8A020" : "var(--border)",
      }}
    >
      <DriverBadge driver={concept.driver} />

      {isWinner && <WinnerBanner />}

      <div className="flex flex-col gap-6 p-4">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {concept.conceptName}
        </h3>

        <TextOverlayDisplay words={concept.textOverlay} />

        <ColourPalette
          palette={concept.colourPalette}
          rationale={concept.paletteRationale}
        />

        <CompositionSteps steps={concept.compositionSteps} />

        <ABHypothesis text={concept.abNote} />

        <button
          onClick={() => copy(buildFullBrief(concept))}
          className="flex items-center justify-center gap-2 w-full py-2 rounded border text-[13px] font-medium transition-colors hover:bg-white/5"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy full brief
            </>
          )}
        </button>
      </div>
    </div>
  );
}
