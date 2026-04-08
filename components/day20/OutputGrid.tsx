"use client";

import { motion } from "framer-motion";
import { OutputCard } from "./OutputCard";
import { OUTPUT_TYPES } from "@/lib/day20/pipeline/outputs";
import type { OutputType, PipelineOutputs } from "@/types/day20";

interface OutputGridProps {
  outputs: PipelineOutputs;
  selectedOutputs: OutputType[];
}

const CARD_ORDER: OutputType[] = [
  "summaryCard",
  "xThread",
  "standaloneTweets",
  "youtubeDescription",
  "newsletterSection",
  "linkedinPost",
  "tiktokCaptions",
];

export function OutputGrid({ outputs, selectedOutputs }: OutputGridProps) {
  const visibleCards = CARD_ORDER.filter(
    (key) =>
      selectedOutputs.includes(key) &&
      OUTPUT_TYPES.some((o) => o.key === key) &&
      outputs[key] !== undefined,
  );

  return (
    <div className="space-y-4">
      {visibleCards.map((key, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            delay: i * 0.06,
          }}
        >
          <OutputCard outputType={key} outputs={outputs} />
        </motion.div>
      ))}
    </div>
  );
}
