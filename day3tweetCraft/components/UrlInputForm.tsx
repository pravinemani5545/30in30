"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import { UrlPreviewCard } from "./UrlPreviewCard";
import { usePreview } from "@/hooks/usePreview";
import type { GenerationStep } from "@/hooks/useGenerate";

interface UrlInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  step: GenerationStep;
}

export function UrlInputForm({ onSubmit, step }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const { previewData, isLoading: previewLoading } = usePreview(url);

  const isGenerating = step === "fetching" || step === "reading" || step === "crafting";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim() || isGenerating) return;
    await onSubmit(url.trim());
  }

  return (
    <div className="space-y-3 w-full">
      <form onSubmit={handleSubmit}>
        <div className="url-input-wrapper flex items-center gap-0 border rounded-xl overflow-hidden"
          style={{ background: "var(--surface-input)", borderColor: "var(--border)" }}
        >
          <input
            type="url"
            placeholder="Paste a blog post URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-4 py-3.5 text-base bg-transparent outline-none disabled:opacity-50 placeholder:text-text-tertiary"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
            }}
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
      </form>

      {/* URL Preview Card */}
      {(previewLoading || previewData) && url && (
        <UrlPreviewCard preview={previewData!} isLoading={previewLoading && !previewData} />
      )}
    </div>
  );
}
