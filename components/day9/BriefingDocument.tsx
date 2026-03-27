"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Printer, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { Briefing } from "@/types/day9";
import { BriefingHeader } from "./BriefingHeader";
import { BriefingSection } from "./BriefingSection";
import { TalkingPoint } from "./TalkingPoint";
import { ObjectionCard } from "./ObjectionCard";
import { ConversationStarter } from "./ConversationStarter";
import { SourcesList } from "./SourcesList";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SECTION_COLORS = {
  background: "#8B5CF6",
  company: "#06B6D4",
  talking: "#E8A020",
  objections: "#EF4444",
  starters: "#22C55E",
};

const staggerDelay = 0.12; // 120ms between sections

function AnimatedSection({
  index,
  children,
  skipAnimation,
}: {
  index: number;
  children: React.ReactNode;
  skipAnimation: boolean;
}) {
  if (skipAnimation) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * staggerDelay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function BriefingDocument({ briefing }: { briefing: Briefing }) {
  const prefersReducedMotion = useReducedMotion();
  const skipAnimation = !!prefersReducedMotion;
  const docRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    window.print();
  }

  async function handleCopy() {
    const text = formatBriefingAsText(briefing);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Briefing copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="briefing-document" ref={docRef}>
      <BriefingHeader briefing={briefing} />

      <div className="space-y-6">
        {/* Section 1: Background */}
        {briefing.background && (
          <AnimatedSection index={0} skipAnimation={skipAnimation}>
            <BriefingSection
              title="Background"
              accentColor={SECTION_COLORS.background}
              confidence={briefing.background_confidence ?? undefined}
            >
              <p>{briefing.background}</p>
            </BriefingSection>
          </AnimatedSection>
        )}

        {/* Section 2: Company Context */}
        {briefing.company_context && (
          <AnimatedSection index={1} skipAnimation={skipAnimation}>
            <BriefingSection
              title="Company Context"
              accentColor={SECTION_COLORS.company}
              confidence={briefing.company_confidence ?? undefined}
            >
              <p>{briefing.company_context}</p>
            </BriefingSection>
          </AnimatedSection>
        )}

        {/* Section 3: Talking Points */}
        {briefing.talking_points && briefing.talking_points.length > 0 && (
          <AnimatedSection index={2} skipAnimation={skipAnimation}>
            <BriefingSection
              title="Talking Points"
              accentColor={SECTION_COLORS.talking}
            >
              {briefing.talking_points.map((tp, i) => (
                <TalkingPoint key={i} point={tp} index={i} />
              ))}
            </BriefingSection>
          </AnimatedSection>
        )}

        {/* Section 4: Likely Objections */}
        {briefing.objections && briefing.objections.length > 0 && (
          <AnimatedSection index={3} skipAnimation={skipAnimation}>
            <BriefingSection
              title="Likely Objections"
              accentColor={SECTION_COLORS.objections}
              className="section-objections"
            >
              {briefing.objections.map((obj, i) => (
                <ObjectionCard key={i} objection={obj} />
              ))}
            </BriefingSection>
          </AnimatedSection>
        )}

        {/* Section 5: Conversation Starters */}
        {briefing.conversation_starters &&
          briefing.conversation_starters.length > 0 && (
            <AnimatedSection index={4} skipAnimation={skipAnimation}>
              <BriefingSection
                title="Conversation Starters"
                accentColor={SECTION_COLORS.starters}
              >
                {briefing.conversation_starters.map((cs, i) => (
                  <ConversationStarter key={i} starter={cs} />
                ))}
              </BriefingSection>
            </AnimatedSection>
          )}
      </div>

      {/* Sources */}
      {briefing.sources && <SourcesList sources={briefing.sources} />}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-6 print-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--foreground)]"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--foreground)]"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-1.5 text-[#22C55E]" />
          ) : (
            <Copy className="w-4 h-4 mr-1.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function formatBriefingAsText(briefing: Briefing): string {
  const lines: string[] = [];
  lines.push(`MEETING PREP: ${briefing.person_name} @ ${briefing.company_name}`);
  lines.push(`Context: ${briefing.meeting_context}`);
  lines.push("");

  if (briefing.background) {
    lines.push("--- BACKGROUND ---");
    lines.push(briefing.background);
    lines.push("");
  }

  if (briefing.company_context) {
    lines.push("--- COMPANY CONTEXT ---");
    lines.push(briefing.company_context);
    lines.push("");
  }

  if (briefing.talking_points) {
    lines.push("--- TALKING POINTS ---");
    briefing.talking_points.forEach((tp, i) => {
      lines.push(`${i + 1}. ${tp.point}`);
      lines.push(`   ${tp.explanation}`);
    });
    lines.push("");
  }

  if (briefing.objections) {
    lines.push("--- LIKELY OBJECTIONS ---");
    briefing.objections.forEach((obj) => {
      lines.push(`They: "${obj.objection}"`);
      lines.push(`You: ${obj.response}`);
      lines.push("");
    });
  }

  if (briefing.conversation_starters) {
    lines.push("--- CONVERSATION STARTERS ---");
    briefing.conversation_starters.forEach((cs) => {
      lines.push(`"${cs.starter}"`);
    });
    lines.push("");
  }

  lines.push("Generated by MeetingPrep · Powered by Serper + Gemini Flash");
  return lines.join("\n");
}
