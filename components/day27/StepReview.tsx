"use client";

import type { OnboardingData } from "@/types/day27";

interface StepReviewProps {
  data: Partial<OnboardingData>;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

const TIMELINE_LABELS: Record<string, string> = {
  "1_month": "1 Month",
  "3_months": "3 Months",
  "6_months": "6 Months",
  "1_year": "1 Year",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const THEME_LABELS: Record<string, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

function SectionHeader({
  label,
  step,
  onEdit,
}: {
  label: string;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span
        style={{
          fontFamily: "var(--font-day27-mono)",
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="px-2 py-1 transition-all"
        style={{
          fontFamily: "var(--font-day27-mono)",
          fontSize: "10px",
          letterSpacing: "1px",
          color: "#555",
          background: "transparent",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
          cursor: "pointer",
        }}
      >
        EDIT
      </button>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span
        style={{
          fontFamily: "var(--font-day27-mono)",
          fontSize: "11px",
          color: "#555",
          minWidth: 100,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-day27-body)",
          fontSize: "14px",
          color: "#eeeeee",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export function StepReview({
  data,
  onEditStep,
  onSubmit,
  submitting,
}: StepReviewProps) {
  const { profile, preferences, goals } = data;

  return (
    <div className="space-y-6">
      <div>
        <span
          className="block mb-4"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          STEP 4 — REVIEW
        </span>
        <p
          style={{
            fontFamily: "var(--font-day27-body)",
            fontSize: "15px",
            color: "#999",
            lineHeight: 1.5,
          }}
        >
          Review your information before completing onboarding.
        </p>
      </div>

      {/* Profile Section */}
      <div
        className="p-4"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <SectionHeader label="Profile" step={1} onEdit={onEditStep} />
        <DataRow label="Name" value={profile?.displayName ?? ""} />
        <DataRow label="Role" value={profile?.role ?? ""} />
        <DataRow label="Company" value={profile?.company ?? ""} />
      </div>

      {/* Preferences Section */}
      <div
        className="p-4"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <SectionHeader label="Preferences" step={2} onEdit={onEditStep} />
        <DataRow
          label="Theme"
          value={THEME_LABELS[preferences?.theme ?? ""] ?? "—"}
        />
        <DataRow
          label="Notifications"
          value={preferences?.notifications ? "Enabled" : "Disabled"}
        />
        <DataRow
          label="Digest"
          value={preferences?.weeklyDigest ? "Enabled" : "Disabled"}
        />
      </div>

      {/* Goals Section */}
      <div
        className="p-4"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <SectionHeader label="Goals" step={3} onEdit={onEditStep} />
        <DataRow label="Goal" value={goals?.primaryGoal ?? ""} />
        <DataRow
          label="Timeline"
          value={TIMELINE_LABELS[goals?.timeline ?? ""] ?? "—"}
        />
        <DataRow
          label="Experience"
          value={EXPERIENCE_LABELS[goals?.experience ?? ""] ?? "—"}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full py-4 transition-all"
        style={{
          fontFamily: "var(--font-day27-mono)",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "2px",
          color: submitting ? "#555" : "#0a0a0a",
          background: submitting ? "#2a2a2a" : "#00FF41",
          border: "none",
          borderRadius: 0,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "COMPLETING..." : "COMPLETE ONBOARDING"}
      </button>
    </div>
  );
}
