"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/hooks/day27/useOnboarding";
import {
  profileSchema,
  preferencesSchema,
  goalsSchema,
} from "@/lib/day27/validations";
import type {
  OnboardingData,
  ProfileData,
  PreferencesData,
  GoalsData,
} from "@/types/day27";
import { ProgressBar } from "./ProgressBar";
import { StepProfile } from "./StepProfile";
import { StepPreferences } from "./StepPreferences";
import { StepGoals } from "./StepGoals";
import { StepReview } from "./StepReview";
import { WizardNavigation } from "./WizardNavigation";

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

export function OnboardingWizardDashboard() {
  const {
    data,
    currentStep,
    setCurrentStep,
    updateStepData,
    submit,
    loading,
    saving,
    error,
    authenticated,
    completed,
  } = useOnboarding();

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Track which steps have been completed / validated
  const getCompletedSteps = useCallback((): number[] => {
    const completed: number[] = [];
    if (data.profile) {
      const result = profileSchema.safeParse(data.profile);
      if (result.success) completed.push(1);
    }
    if (data.preferences) {
      const result = preferencesSchema.safeParse(data.preferences);
      if (result.success) completed.push(2);
    }
    if (data.goals) {
      const result = goalsSchema.safeParse(data.goals);
      if (result.success) completed.push(3);
    }
    return completed;
  }, [data]);

  function validateCurrentStep(): boolean {
    setStepErrors({});
    let schema;
    let stepData;

    if (currentStep === 1) {
      schema = profileSchema;
      stepData = data.profile ?? {};
    } else if (currentStep === 2) {
      schema = preferencesSchema;
      stepData = data.preferences ?? {};
    } else if (currentStep === 3) {
      schema = goalsSchema;
      stepData = data.goals ?? {};
    } else {
      return true; // Review step — no validation needed
    }

    const result = schema.safeParse(stepData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && !errors[String(field)]) {
          errors[String(field)] = issue.message;
        }
      }
      setStepErrors(errors);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setStepErrors({});
    setCurrentStep(Math.min(currentStep + 1, 4));
  }

  function handleBack() {
    setStepErrors({});
    setCurrentStep(Math.max(currentStep - 1, 1));
  }

  function handleEditStep(step: number) {
    setStepErrors({});
    setCurrentStep(step);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await submit();
    setSubmitting(false);
  }

  /* ─── Loading state ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2 h-2"
            style={{
              background: "#00FF41",
              borderRadius: "50%",
              animation: "pulse-dot 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "13px",
              color: "#555",
            }}
          >
            Loading progress...
          </span>
        </div>
      </div>
    );
  }

  /* ─── Auth gate ──────────────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day27")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "14px",
              fontWeight: 700,
              background: "#00FF41",
              color: "#000",
              borderRadius: 0,
            }}
          >
            [ SIGN IN ]
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Completed state ────────────────────────────────────────────── */
  if (completed) {
    return (
      <main className="flex-1 overflow-y-auto">
        <section className="px-6 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Success indicator */}
            <div
              className="inline-flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                background: "rgba(0,255,65,0.1)",
                border: "2px solid #00FF41",
                borderRadius: 0,
              }}
            >
              <span style={{ fontSize: "28px", color: "#00FF41" }}>
                &#x2713;
              </span>
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "var(--font-day27-heading)",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#eeeeee",
                  marginBottom: 8,
                }}
              >
                Onboarding <span style={{ color: "#00FF41" }}>Complete</span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-day27-body)",
                  fontSize: "15px",
                  color: "#999",
                }}
              >
                Your profile has been set up. Here&apos;s a summary of your information.
              </p>
            </div>

            {/* Summary cards */}
            <div className="text-left space-y-4">
              {/* Profile */}
              <div
                className="p-4"
                style={{
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                <span
                  className="block mb-3"
                  style={{
                    fontFamily: "var(--font-day27-mono)",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  PROFILE
                </span>
                <div className="space-y-1">
                  <SummaryRow label="Name" value={data.profile?.displayName} />
                  <SummaryRow label="Role" value={data.profile?.role} />
                  <SummaryRow label="Company" value={data.profile?.company} />
                </div>
              </div>

              {/* Preferences */}
              <div
                className="p-4"
                style={{
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                <span
                  className="block mb-3"
                  style={{
                    fontFamily: "var(--font-day27-mono)",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  PREFERENCES
                </span>
                <div className="space-y-1">
                  <SummaryRow
                    label="Theme"
                    value={THEME_LABELS[data.preferences?.theme ?? ""]}
                  />
                  <SummaryRow
                    label="Notifications"
                    value={data.preferences?.notifications ? "Enabled" : "Disabled"}
                  />
                  <SummaryRow
                    label="Weekly Digest"
                    value={data.preferences?.weeklyDigest ? "Enabled" : "Disabled"}
                  />
                </div>
              </div>

              {/* Goals */}
              <div
                className="p-4"
                style={{
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                <span
                  className="block mb-3"
                  style={{
                    fontFamily: "var(--font-day27-mono)",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#00FF41",
                    opacity: 0.75,
                  }}
                >
                  GOALS
                </span>
                <div className="space-y-1">
                  <SummaryRow label="Goal" value={data.goals?.primaryGoal} />
                  <SummaryRow
                    label="Timeline"
                    value={TIMELINE_LABELS[data.goals?.timeline ?? ""]}
                  />
                  <SummaryRow
                    label="Experience"
                    value={EXPERIENCE_LABELS[data.goals?.experience ?? ""]}
                  />
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "var(--font-day27-mono)",
                fontSize: "11px",
                color: "#555",
              }}
            >
              onboarding_complete // session initialized
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ─── Wizard ─────────────────────────────────────────────────────── */
  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="px-6 py-8 lg:py-10" style={{ background: "#0a0a0a" }}>
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="block mb-3"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#00FF41",
              opacity: 0.75,
            }}
          >
            ONBOARDING WIZARD
          </span>

          <h2
            style={{
              fontFamily: "var(--font-day27-heading)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#eeeeee",
              marginBottom: "12px",
            }}
          >
            Setup <span style={{ color: "#00FF41" }}>Profile</span>
          </h2>

          <p
            className="mb-5 mx-auto max-w-md"
            style={{
              fontFamily: "var(--font-day27-body)",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#999",
            }}
          >
            Complete the 4-step wizard to set up your profile. Progress is saved
            automatically.
          </p>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#00FF41",
              background: "rgba(0,255,65,0.05)",
              border: "1px solid rgba(0,255,65,0.2)",
            }}
          >
            <span
              className="inline-block w-2 h-2"
              style={{
                background: "#00FF41",
                borderRadius: "50%",
                animation: "pulse-dot 2s infinite",
              }}
            />
            STEP {currentStep} OF 4
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="px-6 py-6" style={{ background: "#0a0a0a" }}>
        <div className="max-w-xl mx-auto">
          <ProgressBar
            currentStep={currentStep}
            completedSteps={getCompletedSteps()}
          />
        </div>
      </section>

      {/* Step Content */}
      <section className="px-6 py-6" style={{ background: "#0a0a0a" }}>
        <div className="max-w-xl mx-auto">
          {/* Error banner */}
          {error && (
            <div
              className="p-3 mb-6"
              style={{
                fontFamily: "var(--font-day27-mono)",
                fontSize: "13px",
                color: "#ff4444",
                background: "rgba(255,68,68,0.05)",
                border: "1px solid rgba(255,68,68,0.15)",
                borderRadius: 0,
              }}
            >
              {">"} error: {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <StepProfile
                  data={data.profile ?? {}}
                  onChange={(val: ProfileData) =>
                    updateStepData("profile", val)
                  }
                  errors={stepErrors}
                />
              )}
              {currentStep === 2 && (
                <StepPreferences
                  data={data.preferences ?? {}}
                  onChange={(val: PreferencesData) =>
                    updateStepData("preferences", val)
                  }
                  errors={stepErrors}
                />
              )}
              {currentStep === 3 && (
                <StepGoals
                  data={data.goals ?? {}}
                  onChange={(val: GoalsData) =>
                    updateStepData("goals", val)
                  }
                  errors={stepErrors}
                />
              )}
              {currentStep === 4 && (
                <StepReview
                  data={data}
                  onEditStep={handleEditStep}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <WizardNavigation
            currentStep={currentStep}
            onBack={handleBack}
            onNext={handleNext}
            saving={saving}
          />

          {/* Saving indicator */}
          {saving && (
            <div
              className="flex items-center justify-center gap-2 mt-4"
              style={{
                fontFamily: "var(--font-day27-mono)",
                fontSize: "11px",
                color: "#555",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5"
                style={{
                  background: "#00FF41",
                  borderRadius: "50%",
                  animation: "pulse-dot 1.5s infinite",
                }}
              />
              saving progress...
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ─── Helper ──────────────────────────────────────────────────────── */

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 py-1">
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
        {value || "\u2014"}
      </span>
    </div>
  );
}
