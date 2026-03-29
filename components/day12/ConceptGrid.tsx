"use client";

import { motion } from "framer-motion";
import type { ThumbConcept } from "@/types/day12";
import { ConceptCard } from "./ConceptCard";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ConceptGrid({ concepts }: { concepts: ThumbConcept[] }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {concepts.map((concept, i) =>
        prefersReducedMotion ? (
          <ConceptCard key={concept.driver} concept={concept} />
        ) : (
          <motion.div
            key={concept.driver}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: i * 0.15,
            }}
          >
            <ConceptCard concept={concept} />
          </motion.div>
        ),
      )}
    </div>
  );
}
