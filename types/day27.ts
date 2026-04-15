// ─── Day 27: OnboardingWizard Types ──────────────────────────────────

export interface ProfileData {
  displayName: string;
  role: string;
  company: string;
}

export interface PreferencesData {
  theme: "dark" | "light" | "system";
  notifications: boolean;
  weeklyDigest: boolean;
}

export interface GoalsData {
  primaryGoal: string;
  timeline: "1_month" | "3_months" | "6_months" | "1_year";
  experience: "beginner" | "intermediate" | "advanced";
}

export interface OnboardingData {
  profile: ProfileData;
  preferences: PreferencesData;
  goals: GoalsData;
}

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: number;
  data: Partial<OnboardingData>;
  completed_at: string | null;
  created_at: string;
}
