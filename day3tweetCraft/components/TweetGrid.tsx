"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { TweetVariation, GenerateResponse } from "@/types";
import { TweetCard } from "./TweetCard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

interface TweetGridProps {
  result: GenerateResponse;
}

export function TweetGrid({ result }: TweetGridProps) {
  const [variations, setVariations] = useState<TweetVariation[]>(result.variations);

  function handleRegenerated(updated: TweetVariation) {
    setVariations((prev) =>
      prev.map((v) => (v.variation_number === updated.variation_number ? updated : v))
    );
  }

  // Article summary + key insights header
  return (
    <div className="space-y-6">
      {/* Article summary */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Article link */}
        <a
          href={result.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-3 group"
        >
          {result.articleFaviconUrl && (
            <img
              src={result.articleFaviconUrl}
              alt=""
              className="w-4 h-4 rounded-sm flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <span
            className="text-sm font-medium truncate group-hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {result.articleTitle || result.articleDomain}
          </span>
          <ExternalLink size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
        </a>
        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          {result.articleSummary}
        </p>
        <div className="flex flex-wrap gap-2">
          {result.keyInsights.map((insight, i) => (
            <span
              key={i}
              className="inline-block px-2 py-1 rounded-lg text-xs"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
                border: "1px solid rgba(232,160,32,0.2)",
              }}
            >
              {insight}
            </span>
          ))}
        </div>
      </div>

      {/* Tweet cards — 2+2+1 grid on desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {variations.slice(0, 4).map((variation) => (
          <motion.div key={variation.id} variants={itemVariants}>
            <TweetCard
              variation={variation}
              generationId={result.generationId}
              articleTitle={result.articleTitle}
              articleUrl={result.articleUrl}
              onRegenerated={handleRegenerated}
            />
          </motion.div>
        ))}
        {variations[4] && (
          <motion.div variants={itemVariants} className="md:col-span-2">
            <TweetCard
              variation={variations[4]}
              generationId={result.generationId}
              articleTitle={result.articleTitle}
              articleUrl={result.articleUrl}
              onRegenerated={handleRegenerated}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
