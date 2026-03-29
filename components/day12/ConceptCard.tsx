"use client";

import type { ThumbConcept } from "@/types/day12";
import { DriverBadge } from "./DriverBadge";
import { WinnerBanner } from "./WinnerBanner";
import { TextOverlayDisplay } from "./TextOverlayDisplay";
import { ColourPalette } from "./ColourPalette";
import { CompositionSteps } from "./CompositionSteps";
import { ABHypothesis } from "./ABHypothesis";
import { useCopyToClipboard } from "@/hooks/day12/useCopyToClipboard";
import { Copy, Check, ImageIcon, Loader2, Download } from "lucide-react";

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

interface ConceptCardProps {
  concept: ThumbConcept;
  imageUrl: string | null;
  imageLoading: boolean;
  imageError: string | null;
  onGenerateImage: () => void;
}

export function ConceptCard({
  concept,
  imageUrl,
  imageLoading,
  imageError,
  onGenerateImage,
}: ConceptCardProps) {
  const { copy, copied } = useCopyToClipboard();
  const isWinner = concept.isPredictedWinner;

  function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `thumbnail-${concept.driver}.png`;
    link.click();
  }

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

        {/* Generated Image */}
        {imageUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold tracking-[0.1em]"
                style={{ color: "var(--text-tertiary)" }}
              >
                GENERATED THUMBNAIL
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 p-1 rounded text-[11px] transition-colors hover:bg-white/5"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Download className="h-3 w-3" />
                Save
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Thumbnail mockup: ${concept.conceptName}`}
              className="w-full rounded-md border"
              style={{ borderColor: "var(--border)", aspectRatio: "16/9", objectFit: "cover" }}
            />
          </div>
        )}

        {imageError && (
          <p className="text-[12px]" style={{ color: "var(--error)" }}>
            {imageError}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => copy(buildFullBrief(concept))}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded border text-[13px] font-medium transition-colors hover:bg-white/5"
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
                Copy brief
              </>
            )}
          </button>

          <button
            onClick={onGenerateImage}
            disabled={imageLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded border text-[13px] font-medium transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{
              borderColor: imageUrl ? "var(--border)" : "var(--accent)",
              color: imageUrl ? "var(--text-secondary)" : "var(--accent)",
            }}
          >
            {imageLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : imageUrl ? (
              <>
                <ImageIcon className="h-3.5 w-3.5" />
                Regenerate
              </>
            ) : (
              <>
                <ImageIcon className="h-3.5 w-3.5" />
                Generate image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
