"use client";

import type { ICPProfile as ICPProfileType } from "@/types/day13";
import { FirmographicProfile } from "./FirmographicProfile";
import { PainPointHierarchy } from "./PainPointHierarchy";
import { ObjectionMap } from "./ObjectionMap";
import { OutreachChannels } from "./OutreachChannels";
import { RealityCheck } from "./RealityCheck";
import { RotateCcw, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  profile: ICPProfileType;
  onNewInterview: () => void;
}

export function ICPProfile({ profile, onNewInterview }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const sections = [
      `ICP Profile — ${profile.company_name}`,
      `Generated: ${new Date(profile.created_at).toLocaleDateString()}`,
      "",
      "FIRMOGRAPHIC PROFILE",
      `Company Size: ${profile.firmographic_profile.companySizeRange}`,
      `Industry: ${profile.firmographic_profile.industryVertical}`,
      `Growth Stage: ${profile.firmographic_profile.growthStage}`,
      `Revenue: ${profile.firmographic_profile.revenueRange}`,
      `Geography: ${profile.firmographic_profile.geography}`,
      profile.firmographic_profile.techStackSignals.length > 0
        ? `Tech Signals: ${profile.firmographic_profile.techStackSignals.join(", ")}`
        : "",
      "",
      "PAIN POINT HIERARCHY",
      `Surface: ${profile.pain_point_hierarchy.surfacePain}`,
      `Real: ${profile.pain_point_hierarchy.realPain}`,
      `Urgent: ${profile.pain_point_hierarchy.urgentPain}`,
      `Trigger: ${profile.pain_point_hierarchy.triggerEvent}`,
      "",
      "OBJECTION MAP",
      ...profile.objection_map.map(
        (o) =>
          `Objection: "${o.statedObjection}" | Fear: ${o.underlyingFear} | Counter: ${o.counterFrame}`,
      ),
      "",
      "OUTREACH CHANNELS",
      ...profile.recommended_channels.map(
        (c) =>
          `${c.channel}${c.isInferred ? " [inferred]" : ""}: ${c.reasoning} → ${c.tacticalSuggestion}`,
      ),
      "",
      "REALITY CHECK",
      profile.reality_check_text,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(sections);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profile]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            ICP Profile
          </p>
          <h1
            className="text-2xl italic"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--foreground)",
            }}
          >
            {profile.company_name}
          </h1>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Generated {new Date(profile.created_at).toLocaleDateString()} · Based
            on your 10-question interview
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {copied ? (
              <Check size={12} style={{ color: "var(--success)" }} />
            ) : (
              <Copy size={12} />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onNewInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--background)",
            }}
          >
            <RotateCcw size={12} />
            New Interview
          </button>
        </div>
      </div>

      {/* Five sections */}
      <FirmographicProfile data={profile.firmographic_profile} />
      <PainPointHierarchy data={profile.pain_point_hierarchy} />
      <ObjectionMap data={profile.objection_map} />
      <OutreachChannels data={profile.recommended_channels} />
      <RealityCheck text={profile.reality_check_text} />
    </div>
  );
}
