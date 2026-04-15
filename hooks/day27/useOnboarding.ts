"use client";

import { useState, useEffect, useCallback } from "react";
import type { OnboardingData, OnboardingProgress } from "@/types/day27";

interface UseOnboardingReturn {
  data: Partial<OnboardingData>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateStepData: <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K],
  ) => void;
  submit: () => Promise<boolean>;
  loading: boolean;
  saving: boolean;
  error: string | null;
  authenticated: boolean;
  completed: boolean;
}

export function useOnboarding(): UseOnboardingReturn {
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [currentStep, setCurrentStepState] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Fetch saved progress on mount
  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/day27/progress");

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const json = await res.json();

      if (json.progress) {
        const progress = json.progress as OnboardingProgress;
        if (progress.data) setData(progress.data);
        if (progress.current_step) setCurrentStepState(progress.current_step);
        if (progress.completed_at) setCompleted(true);
      }
    } catch {
      // silent — first visit
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  function updateStepData<K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // Save progress to Supabase
  async function saveProgress(step: number, progressData: Partial<OnboardingData>) {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/day27/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: step, data: progressData }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return false;
      }

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to save progress");
        return false;
      }

      if (json.progress?.completed_at) {
        setCompleted(true);
      }

      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function setCurrentStep(step: number) {
    setCurrentStepState(step);
    // Save progress whenever step changes
    saveProgress(step, data);
  }

  async function submit(): Promise<boolean> {
    // Final submission — set step to 4 with all data
    const success = await saveProgress(4, data);
    if (success) {
      setCompleted(true);
    }
    return success;
  }

  return {
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
  };
}
