// Day 18 — CompanyTracker types

export type ChangeType = "pricing" | "feature" | "hiring" | "messaging" | "other";

export type CompanyStatus = "active" | "error" | "pending";

export interface TrackedCompany {
  id: string;
  user_id: string;
  url: string;
  domain: string;
  favicon_url: string | null;
  current_hash: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  is_active: boolean;
  fetch_error: string | null;
  is_js_rendered: boolean;
  created_at: string;
}

export interface CompanyChange {
  id: string;
  company_id: string;
  user_id: string;
  url: string;
  change_type: ChangeType;
  summary: string;
  before_excerpt: string | null;
  after_excerpt: string | null;
  old_hash: string;
  new_hash: string;
  ai_sdr_notified: boolean;
  outreach_prompt: string | null;
  ai_model_used: string;
  detected_at: string;
  // Joined fields
  domain?: string;
  favicon_url?: string | null;
}

export interface CronRun {
  id: string;
  started_at: string;
  completed_at: string | null;
  urls_checked: number;
  changes_found: number;
  errors: number;
  digest_sent: boolean;
}

export interface ClassifyOutput {
  changeType: ChangeType;
  summary: string;
  beforeExcerpt: string;
  afterExcerpt: string;
  outreachPrompt: string;
}

export interface FetchResult {
  html: string;
  error?: string;
}

export interface DigestChange {
  domain: string;
  url: string;
  change_type: ChangeType;
  summary: string;
  detected_at: string;
}

export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  pricing: "Pricing",
  feature: "Feature",
  hiring: "Hiring",
  messaging: "Messaging",
  other: "Other",
};

export const CHANGE_TYPE_COLORS: Record<ChangeType, string> = {
  pricing: "var(--change-pricing)",
  feature: "var(--change-feature)",
  hiring: "var(--change-hiring)",
  messaging: "var(--change-messaging)",
  other: "var(--change-other)",
};
