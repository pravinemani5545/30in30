"use client";

import { motion } from "framer-motion";
import type { ThumbConcept } from "@/types/day12";
import { ConceptCard } from "./ConceptCard";
import { ImageIcon, Loader2 } from "lucide-react";

interface ImageState {
  loading: boolean;
  url: string | null;
  error: string | null;
}

interface ConceptGridProps {
  concepts: ThumbConcept[];
  images: Record<number, ImageState>;
  onGenerateImage: (index: number) => void;
  onGenerateAllImages: () => void;
  anyImageLoading: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ConceptGrid({
  concepts,
  images,
  onGenerateImage,
  onGenerateAllImages,
  anyImageLoading,
}: ConceptGridProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const allHaveImages = concepts.every(
    (_, i) => images[i]?.url,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {concepts.map((concept, i) => {
          const imgState = images[i];
          const card = (
            <ConceptCard
              key={concept.driver}
              concept={concept}
              imageUrl={imgState?.url ?? null}
              imageLoading={imgState?.loading ?? false}
              imageError={imgState?.error ?? null}
              onGenerateImage={() => onGenerateImage(i)}
            />
          );

          if (prefersReducedMotion) return card;

          return (
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
              {card}
            </motion.div>
          );
        })}
      </div>

      {!allHaveImages && (
        <button
          onClick={onGenerateAllImages}
          disabled={anyImageLoading}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border text-[13px] font-medium transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
          }}
        >
          {anyImageLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating images...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Generate all 3 images
            </>
          )}
        </button>
      )}
    </div>
  );
}
