"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import type { ContactWithSuggestions } from "@/types";
import { useEnrichment } from "@/hooks/useEnrichment";
import { useCredits } from "@/hooks/useCredits";

interface LinkedInInputFormProps {
  onEnrichmentComplete: (contact: ContactWithSuggestions) => void;
}

export function LinkedInInputForm({ onEnrichmentComplete }: LinkedInInputFormProps) {
  const [url, setUrl] = useState("");
  const [manualText, setManualText] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const { credits, loading: creditsLoading, decrementLocal, refetch: refetchCredits } = useCredits();

  const {
    enrich,
    phase,
    showManualPaste,
    pendingUrl,
    isLoading,
  } = useEnrichment({
    onSuccess: (contact) => {
      onEnrichmentComplete(contact);
      setUrl("");
      setManualText("");
      setUrlError(null);
    },
    onCreditsRefetch: () => {
      decrementLocal();
      void refetchCredits();
    },
  });

  function validateUrl(value: string): boolean {
    const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?$/;
    if (!value.trim()) {
      setUrlError(null);
      return false;
    }
    if (!pattern.test(value.trim())) {
      setUrlError("Must be a LinkedIn profile URL (linkedin.com/in/username)");
      return false;
    }
    setUrlError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateUrl(url)) return;
    void enrich(url.trim());
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualText.trim() || !pendingUrl) return;
    void enrich(pendingUrl, manualText.trim());
  }

  const statusText = () => {
    if (phase === "apollo") return "Enriching with Apollo...";
    if (phase === "claude") return "Analyzing with Claude...";
    if (phase === "done") return "Done!";
    if (!creditsLoading && credits) {
      const remaining = credits.creditsRemaining;
      if (remaining === 0) return "0 enrichments remaining — paste manually below";
      return `${remaining} enrichment${remaining === 1 ? "" : "s"} remaining this month`;
    }
    return "";
  };

  return (
    <div>
      {/* Main URL input */}
      <form onSubmit={handleSubmit}>
        <div
          className="linkedin-input-wrapper relative"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlError) validateUrl(e.target.value);
            }}
            onBlur={() => validateUrl(url)}
            placeholder="Paste a LinkedIn profile URL..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "14px 16px",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--foreground)",
              fontSize: "16px",
              fontFamily: "var(--font-mono)",
            }}
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            style={{
              margin: "6px",
              padding: "8px 16px",
              background: isLoading || !url.trim() ? "var(--surface-raised)" : "var(--accent)",
              color: isLoading || !url.trim() ? "var(--text-tertiary)" : "var(--background)",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isLoading || !url.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              transition: "background 150ms, transform 100ms",
              flexShrink: 0,
            }}
            className="hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ArrowRight size={14} />
            )}
            Enrich
          </button>

          {/* Animated underline */}
          <span className="linkedin-underline" />
        </div>
      </form>

      {/* Validation error */}
      {urlError && (
        <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "6px" }}>
          {urlError}
        </p>
      )}

      {/* Status / credit indicator */}
      <p
        style={{
          color: phase !== "idle" ? "var(--accent)" : "var(--text-tertiary)",
          fontSize: "12px",
          marginTop: "8px",
          minHeight: "16px",
          transition: "color 150ms",
        }}
      >
        {statusText()}
      </p>

      {/* Manual paste fallback */}
      {showManualPaste && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>
            Apollo couldn't find this profile automatically.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "12px" }}>
            Go to the LinkedIn profile, select all text (Cmd+A), copy it, then paste below. Claude will analyze it directly.
          </p>
          <form onSubmit={handleManualSubmit}>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste the full LinkedIn profile text here..."
              rows={6}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--foreground)",
                fontSize: "13px",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
              className="focus:border-[color:var(--accent)] transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={isLoading || manualText.trim().length < 50}
                style={{
                  padding: "8px 16px",
                  background: isLoading || manualText.trim().length < 50
                    ? "var(--surface-raised)"
                    : "var(--accent)",
                  color: isLoading || manualText.trim().length < 50
                    ? "var(--text-tertiary)"
                    : "var(--background)",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: isLoading || manualText.trim().length < 50 ? "not-allowed" : "pointer",
                  transition: "background 150ms",
                }}
              >
                {isLoading ? "Analyzing..." : "Analyze with Claude →"}
              </button>
            </div>
            {manualText.trim().length > 0 && manualText.trim().length < 50 && (
              <p style={{ color: "var(--text-tertiary)", fontSize: "11px", marginTop: "4px" }}>
                Paste at least 50 characters of profile text
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
