"use client";

import { forwardRef } from "react";
import type { SingleEmail } from "@/types/day15";
import { EMAIL_TYPES } from "@/lib/day15/sequence/arc";
import { DayBadge } from "./DayBadge";
import { EmailTypeBadge } from "./EmailTypeBadge";
import { PivotHighlight } from "./PivotHighlight";
import { FollowUpWarning } from "./FollowUpWarning";
import { SubjectLineTabs } from "./SubjectLineTabs";
import { EmailBody } from "./EmailBody";
import { SlotsSummary } from "./SlotsSummary";
import { useCopyToClipboard } from "@/hooks/day15/useCopyToClipboard";
import { Copy } from "lucide-react";

interface EmailCardProps {
  email: SingleEmail;
}

export const EmailCard = forwardRef<HTMLDivElement, EmailCardProps>(
  function EmailCard({ email }, ref) {
    const meta = EMAIL_TYPES[email.emailType];
    const isPivot = email.emailType === "pivot";
    const { copy } = useCopyToClipboard();

    const handleCopyFull = () => {
      const text = `Subject: ${email.subjectA}\n\n${email.body}`;
      copy(text, "Email copied");
    };

    return (
      <div
        ref={ref}
        className="rounded-lg p-5 space-y-4"
        style={{
          background: "var(--surface)",
          border: isPivot
            ? "1px solid var(--accent)"
            : "1px solid var(--border)",
          boxShadow: isPivot
            ? "0 0 12px color-mix(in srgb, var(--accent) 20%, transparent)"
            : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DayBadge day={email.sendDay} colour={meta.colour} />
            <EmailTypeBadge label={meta.label} colour={meta.colour} />
          </div>
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {email.sendTiming}
          </span>
        </div>

        {/* Pivot banner */}
        {isPivot && <PivotHighlight />}

        {/* Follow-up warning */}
        {email.hasFollowupLanguage && <FollowUpWarning />}

        {/* Subject lines */}
        <SubjectLineTabs subjectA={email.subjectA} subjectB={email.subjectB} />

        {/* Body */}
        <EmailBody body={email.body} />

        {/* Slots summary */}
        <SlotsSummary slots={email.personalizationSlots} />

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {email.wordCount} words
          </span>
          <button
            onClick={handleCopyFull}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--surface-raised)",
              color: "var(--text-secondary)",
            }}
          >
            <Copy size={12} />
            Copy email
          </button>
        </div>
      </div>
    );
  },
);
