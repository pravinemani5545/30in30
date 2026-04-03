"use client";

import { Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GenerationState } from "@/types/day16";

interface GenerateButtonProps {
  state: GenerationState;
  onClick: () => void;
  disabled?: boolean;
}

export function GenerateButton({
  state,
  onClick,
  disabled,
}: GenerateButtonProps) {
  const isLoading = state === "generating" || state === "buffering";
  const hasGenerated = state === "ready" || state === "error";

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {state === "generating" ? "Generating..." : "Buffering audio..."}
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          {hasGenerated ? "Regenerate" : "Generate Voiceover"}
        </>
      )}
    </Button>
  );
}
