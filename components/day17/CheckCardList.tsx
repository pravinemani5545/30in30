"use client";

import { motion } from "framer-motion";
import { CheckCard } from "./CheckCard";
import type { DeliverabilityReport, CheckName } from "@/types/day17";
import { CHECK_LABELS } from "@/types/day17";

const CHECK_ORDER: { key: CheckName; resultKey: keyof DeliverabilityReport }[] = [
  { key: "spf", resultKey: "spf_result" },
  { key: "dkim", resultKey: "dkim_result" },
  { key: "dmarc", resultKey: "dmarc_result" },
  { key: "mx", resultKey: "mx_result" },
  { key: "domainAge", resultKey: "domain_age_result" },
];

interface CheckCardListProps {
  report: DeliverabilityReport;
}

export function CheckCardList({ report }: CheckCardListProps) {
  return (
    <div className="space-y-3">
      {CHECK_ORDER.map(({ key, resultKey }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
        >
          <CheckCard
            name={CHECK_LABELS[key]}
            result={report[resultKey] as DeliverabilityReport["spf_result"]}
            explanation={report.explanations.checks[key]}
          />
        </motion.div>
      ))}
    </div>
  );
}
