"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { ContactWithSuggestions } from "@/types/day2";
import { PersonCard } from "@/components/day2/PersonCard";
import { CompanyCard } from "@/components/day2/CompanyCard";
import { FollowUpCard } from "@/components/day2/FollowUpCard";

interface EnrichmentPanelProps {
  contact: ContactWithSuggestions;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function EnrichmentPanel({ contact }: EnrichmentPanelProps) {
  const [suggestions, setSuggestions] = useState(contact.follow_up_suggestions);

  async function handleMarkUsed(id: string) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_used: true } : s))
    );

    try {
      await fetch(`/api/day2/follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_used: true }),
      });
    } catch {
      // Revert on failure
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_used: false } : s))
      );
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Person */}
      <motion.div variants={itemVariants}>
        <PersonCard contact={contact} />
      </motion.div>

      {/* Company */}
      {contact.company_name && (
        <motion.div variants={itemVariants}>
          <CompanyCard contact={contact} />
        </motion.div>
      )}

      {/* Follow-up suggestions */}
      {suggestions.length > 0 && (
        <motion.div variants={itemVariants}>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "10px",
            }}
          >
            Follow-up Drafts
          </p>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <FollowUpCard
                key={suggestion.id}
                suggestion={suggestion}
                onMarkUsed={handleMarkUsed}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Confidence + source */}
      {(contact.enrichment_confidence || contact.enrichment_notes) && (
        <motion.div variants={itemVariants}>
          <div
            style={{
              padding: "10px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
            }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {contact.enrichment_confidence && (
                <span
                  style={{
                    fontSize: "11px",
                    color: contact.enrichment_confidence === "high"
                      ? "var(--success)"
                      : contact.enrichment_confidence === "medium"
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  {contact.enrichment_confidence.charAt(0).toUpperCase() + contact.enrichment_confidence.slice(1)} confidence
                </span>
              )}
              {contact.enrichment_source && (
                <span style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>
                  via {contact.enrichment_source === "manual_paste" ? "manual paste" : contact.enrichment_source}
                </span>
              )}
            </div>
            {contact.enrichment_notes && (
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>
                {contact.enrichment_notes}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
