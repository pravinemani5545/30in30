"use client";

import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SingleEmail } from "@/types/day15";
import { ArcTimeline } from "./ArcTimeline";
import { EmailCard } from "./EmailCard";

interface EmailCardGridProps {
  emails: SingleEmail[];
  sequenceSummary: string;
  pivotAngle: string;
}

export function EmailCardGrid({
  emails,
  sequenceSummary,
  pivotAngle,
}: EmailCardGridProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTimelineSelect = useCallback((index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="space-y-2 px-1">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {sequenceSummary}
        </p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          <span className="font-semibold" style={{ color: "var(--accent)" }}>
            Pivot angle:
          </span>{" "}
          {pivotAngle}
        </p>
      </div>

      {/* Arc Timeline */}
      <ArcTimeline
        activeIndex={activeIndex}
        onSelect={handleTimelineSelect}
      />

      {/* Email Cards */}
      <AnimatePresence mode="wait">
        <div className="space-y-4">
          {emails.map((email, i) => (
            <motion.div
              key={email.emailNumber}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.12,
              }}
            >
              <EmailCard ref={setCardRef(i)} email={email} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
