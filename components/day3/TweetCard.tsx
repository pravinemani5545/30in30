"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { TweetVariation } from "@/types/day3";
import { TweetTypeBadge } from "./TweetTypeBadge";
import { CharacterCounter } from "./CharacterCounter";
import { HookScoreRing } from "./HookScoreRing";
import { EngagementBars } from "./EngagementBars";
import { GmailDraftButton } from "./GmailDraftButton";
import { useCopyToClipboard } from "@/hooks/day3/useCopyToClipboard";
import { useRegenerate } from "@/hooks/day3/useRegenerate";

interface TweetCardProps {
  variation: TweetVariation;
  generationId: string;
  articleTitle: string;
  articleUrl: string;
  onRegenerated: (updated: TweetVariation) => void;
}

export function TweetCard({
  variation: initialVariation,
  generationId,
  articleTitle,
  articleUrl,
  onRegenerated,
}: TweetCardProps) {
  const [variation, setVariation] = useState(initialVariation);
  const [hookOpen, setHookOpen] = useState(false);
  const [copied, copy] = useCopyToClipboard();
  const { regenerate, loadingVariations } = useRegenerate();

  const isRegenerating = loadingVariations.has(variation.variation_number);

  function handleRegenerated(updated: TweetVariation) {
    setVariation(updated);
    onRegenerated(updated);
  }

  return (
    <div
      className="rounded-xl border p-5 space-y-4 flex flex-col"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            #{variation.variation_number}
          </span>
          <TweetTypeBadge type={variation.tweet_type} />
          <CharacterCounter count={variation.character_count} />
        </div>
        <HookScoreRing score={variation.hook_score} />
      </div>

      {/* Tweet body */}
      <p
        className="text-base leading-relaxed font-medium flex-1"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          opacity: isRegenerating ? 0.4 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {variation.content}
      </p>

      {/* Engagement bars */}
      <EngagementBars
        retweet={variation.retweet_potential}
        reply={variation.reply_bait}
        saves={variation.saves_potential}
      />

      {/* Hook analysis collapsible */}
      <div>
        <button
          onClick={() => setHookOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          {hookOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Hook analysis
        </button>
        {hookOpen && (
          <div className="mt-2 space-y-2">
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {variation.hook_analysis}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              <span style={{ color: "var(--success)" }}>Why it works: </span>
              {variation.why_this_works}
            </p>
            {variation.potential_weakness && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                <span style={{ color: "var(--error)" }}>Potential weakness: </span>
                {variation.potential_weakness}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "var(--border)" }} />

      {/* Action row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Copy */}
        <button
          onClick={() => copy(variation.content)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: copied ? "rgba(34,197,94,0.15)" : "var(--accent-muted)",
            color: copied ? "var(--success)" : "var(--accent)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(232,160,32,0.3)"}`,
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        <GmailDraftButton
          tweetContent={variation.content}
          articleTitle={articleTitle}
          articleUrl={articleUrl}
        />

        {/* Regenerate */}
        <button
          onClick={() => regenerate(generationId, variation.variation_number, handleRegenerated)}
          disabled={isRegenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ml-auto disabled:opacity-50"
          style={{
            background: "transparent",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
          title="Regenerate this variation"
        >
          <RefreshCw size={13} className={isRegenerating ? "animate-spin" : ""} />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
}
