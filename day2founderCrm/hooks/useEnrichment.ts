"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ContactWithSuggestions } from "@/types";

export type EnrichPhase = "idle" | "apollo" | "claude" | "done";

interface UseEnrichmentOptions {
  onSuccess?: (contact: ContactWithSuggestions) => void;
  onCreditsRefetch?: () => void;
}

export function useEnrichment(options: UseEnrichmentOptions = {}) {
  const [phase, setPhase] = useState<EnrichPhase>("idle");
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);

  async function enrich(linkedinUrl: string, manualPasteText?: string) {
    setPhase("apollo");

    try {
      const body: Record<string, string> = { linkedinUrl };
      if (manualPasteText) {
        body.manualPasteText = manualPasteText;
        setPhase("claude");
      }

      // Apollo phase status transitions
      const apolloTimer = !manualPasteText
        ? setTimeout(() => setPhase("claude"), 3000)
        : null;

      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (apolloTimer) clearTimeout(apolloTimer);

      const data = await res.json() as Record<string, unknown>;

      if (!res.ok) {
        const errCode = data.code as string | undefined;
        if (errCode === "RATE_LIMITED") {
          toast.error("Too many enrichments. Try again in an hour.");
        } else if (errCode === "TIMEOUT") {
          toast.error("Analysis timed out. Please try again.");
        } else {
          toast.error((data.error as string) ?? "Enrichment failed");
        }
        setPhase("idle");
        return;
      }

      // Manual paste required
      if (data.requiresManualPaste) {
        setCreditsRemaining((data.creditsRemaining as number) ?? 0);
        setPendingUrl(linkedinUrl);
        setShowManualPaste(true);
        setPhase("idle");
        return;
      }

      setPhase("done");

      const contact = data.contact as ContactWithSuggestions;
      options.onSuccess?.(contact);
      options.onCreditsRefetch?.();

      if ((data.cached as boolean)) {
        toast.info("Loaded from cache (enriched within 7 days)");
      } else {
        toast.success("Contact enriched successfully");
      }

      // Reset after brief delay
      setTimeout(() => {
        setPhase("idle");
        setShowManualPaste(false);
        setPendingUrl(null);
      }, 500);
    } catch {
      toast.error("Network error. Check your connection.");
      setPhase("idle");
    }
  }

  function dismissManualPaste() {
    setShowManualPaste(false);
    setPendingUrl(null);
    setCreditsRemaining(null);
  }

  return {
    enrich,
    phase,
    showManualPaste,
    pendingUrl,
    creditsRemaining,
    isLoading: phase !== "idle" && phase !== "done",
    dismissManualPaste,
  };
}
