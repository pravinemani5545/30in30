"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ThumbnailConceptSet } from "@/types/day12";
import { DRIVERS } from "@/lib/day12/framework/galloway";
import { useCopyToClipboard } from "@/hooks/day12/useCopyToClipboard";

function formatBriefForEmail(set: ThumbnailConceptSet): string {
  const winnerConcept = set.concepts.find((c) => c.isPredictedWinner);
  const lines: string[] = [
    `VIDEO: ${set.video_title}`,
    `NICHE: ${set.niche} | TONE: ${set.tone}`,
    `★ PREDICTED WINNER: ${winnerConcept?.conceptName ?? "N/A"} (${DRIVERS[set.predicted_winner].label})`,
    "",
    "---",
    "",
  ];

  for (const concept of set.concepts) {
    const driverLabel = DRIVERS[concept.driver].label.toUpperCase();
    lines.push(
      `${driverLabel}: ${concept.conceptName}${concept.isPredictedWinner ? " ★" : ""}`,
    );
    lines.push(`Text overlay: ${concept.textOverlay.join(" ")}`);
    lines.push(
      `Colours: ${concept.colourPalette.map((c) => `${c.hex} (${c.role})`).join(", ")}`,
    );
    lines.push(`Palette rationale: ${concept.paletteRationale}`);
    lines.push("Composition:");
    concept.compositionSteps.forEach((s, i) => {
      lines.push(`  ${i + 1}. ${s}`);
    });
    lines.push(`A/B note: ${concept.abNote}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push(`Overall A/B hypothesis: ${set.ab_hypothesis}`);

  return lines.join("\n");
}

export function GmailDraftButton({
  conceptSet,
}: {
  conceptSet: ThumbnailConceptSet;
}) {
  const { copy } = useCopyToClipboard();
  const brief = formatBriefForEmail(conceptSet);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copy(brief)}
      className="gap-2 text-[13px]"
      style={{
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      <Mail className="h-3.5 w-3.5" />
      Copy designer brief
    </Button>
  );
}
