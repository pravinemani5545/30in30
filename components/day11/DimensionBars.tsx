"use client";

import { motion } from "framer-motion";
import type { EmailGrade } from "@/types/day11";
import { DimensionBar } from "./DimensionBar";

interface DimensionBarsProps {
  grade: EmailGrade;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function DimensionBars({ grade }: DimensionBarsProps) {
  return (
    <motion.div
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={item}>
        <DimensionBar
          dimension="personalization"
          score={grade.personalization_score}
          finding={grade.personalization_finding}
          delay={0}
        />
      </motion.div>
      <motion.div variants={item}>
        <DimensionBar
          dimension="spam"
          score={grade.spam_score}
          finding={grade.spam_finding}
          delay={0.1}
        />
      </motion.div>
      <motion.div variants={item}>
        <DimensionBar
          dimension="cta"
          score={grade.cta_score}
          finding={grade.cta_finding}
          delay={0.2}
        />
      </motion.div>
      <motion.div variants={item}>
        <DimensionBar
          dimension="reading"
          score={grade.reading_score}
          finding={grade.reading_finding}
          delay={0.3}
        />
      </motion.div>
    </motion.div>
  );
}
