"use client";

import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, X, ClipboardPaste } from "lucide-react";
import { UrlPreviewCard } from "./UrlPreviewCard";
import { usePreview } from "@/hooks/usePreview";
import type { GenerationStep } from "@/hooks/useGenerate";

interface UrlInputFormProps {
  onSubmit: (url: string, pastedContent?: string) => Promise<void>;
  step: GenerationStep;
  autoOpenPaste?: boolean;
}

export function UrlInputForm({ onSubmit, step, autoOpenPaste }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [pastedContent, setPastedContent] = useState("");
  const { previewData, isLoading: previewLoading } = usePreview(url);

  const isGenerating = step === "fetching" || step === "reading" || step === "crafting";

  useEffect(() => {
    if (autoOpenPaste) setShowPaste(true);
  }, [autoOpenPaste]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim() || isGenerating) return;
    await onSubmit(url.trim(), showPaste && pastedContent.trim() ? pastedContent.trim() : undefined);
  }

  return (
    <div className="space-y-3 w-full">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* URL row */}
        <div
          className="url-input-wrapper flex items-center gap-0 border rounded-xl overflow-hidden"
          style={{ background: "var(--surface-input)", borderColor: "var(--border)" }}
        >
          <input
            type="url"
            placeholder="Paste a blog post URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-4 py-3.5 text-base bg-transparent outline-none disabled:opacity-50 placeholder:text-text-tertiary"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}
            autoFocus
          />

          {url && !isGenerating && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="px-2 py-1 flex-shrink-0 transition-opacity opacity-50 hover:opacity-100"
              style={{ color: "var(--text-tertiary)" }}
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={!url.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium flex-shrink-0 transition-all disabled:opacity-50"
            style={{
              background: "var(--accent)",
              color: "#0C0C0C",
              borderLeft: "1px solid var(--accent-hover)",
            }}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Generate
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Paste area */}
        {showPaste && (
          <div className="space-y-1.5">
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Open the article, press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>Cmd+A</kbd> then <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>Cmd+C</kbd>, and paste below.
            </p>
            <textarea
              placeholder="Paste the article text here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              rows={6}
              maxLength={50000}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
              style={{
                background: "var(--surface-input)",
                borderColor: pastedContent ? "var(--accent)" : "var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
              }}
            />
            {pastedContent && (
              <p className="text-xs text-right" style={{ color: "var(--text-tertiary)" }}>
                {pastedContent.length.toLocaleString()} chars
              </p>
            )}
          </div>
        )}
      </form>

      {/* Paste toggle */}
      <button
        type="button"
        onClick={() => { setShowPaste((v) => !v); setPastedContent(""); }}
        className="flex items-center gap-1.5 text-xs transition-opacity opacity-50 hover:opacity-90"
        style={{ color: "var(--text-secondary)" }}
      >
        <ClipboardPaste size={12} />
        {showPaste ? "Hide paste area" : "Page blocked? Paste content instead"}
      </button>

      {/* URL Preview Card */}
      {!showPaste && (previewLoading || previewData) && url && (
        <UrlPreviewCard preview={previewData!} isLoading={previewLoading && !previewData} />
      )}
    </div>
  );
}
