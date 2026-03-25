// ─── Enums ───────────────────────────────────────────────────────────────────

export type ContactStatus = "new" | "contacted" | "replied" | "closed";
export type FollowUpTone = "warm" | "direct" | "casual";
export type EnrichmentSource = "apollo" | "manual_paste" | "mock";
export type EnrichmentConfidence = "high" | "medium" | "low";
export type EnrichmentJobStatus = "pending" | "running" | "completed" | "failed";

// ─── Database row types ───────────────────────────────────────────────────────

export interface Contact {
  id: string;
  user_id: string;
  linkedin_url: string;
  linkedin_username: string;
  full_name: string | null;
  headline: string | null;
  current_title: string | null;
  location: string | null;
  avatar_url: string | null;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_description: string | null;
  key_talking_points: string[] | null;
  recent_signals: string[] | null;
  enrichment_source: EnrichmentSource | null;
  enrichment_confidence: EnrichmentConfidence | null;
  enrichment_notes: string | null;
  enriched_at: string | null;
  raw_provider_data: Record<string, unknown> | null;
  status: ContactStatus;
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUpSuggestion {
  id: string;
  contact_id: string;
  user_id: string;
  message_text: string;
  tone: FollowUpTone;
  is_used: boolean;
  created_at: string;
}

export interface EnrichmentJob {
  id: string;
  user_id: string;
  contact_id: string | null;
  linkedin_url: string;
  status: EnrichmentJobStatus;
  source: EnrichmentSource | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface EnrichmentUsage {
  id: string;
  user_id: string;
  credits_used: number;
  month_year: string;
  last_reset_at: string;
  updated_at: string;
}

// ─── Enrichment pipeline ─────────────────────────────────────────────────────

export interface EmploymentHistoryItem {
  title: string | null;
  organization_name: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
}

export interface EducationItem {
  school: string | null;
  degree: string | null;
  field_of_study: string | null;
  graduation_year: number | null;
}

export interface RawProfileData {
  source: EnrichmentSource;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  photoUrl: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  companyDomain: string | null;
  companyIndustry: string | null;
  companySize: string | null;
  employmentHistory: EmploymentHistoryItem[];
  skills: string[];
  education: EducationItem[];
  rawText: string | null;
}

// ─── Claude Structured Output ─────────────────────────────────────────────────

export interface EnrichmentResultPerson {
  fullName: string;
  headline: string;
  location: string;
  summary: string;
  keyTalkingPoints: string[];
}

export interface EnrichmentResultCompany {
  name: string;
  domain: string;
  industry: string;
  estimatedSize: string;
  description: string;
  recentSignals: string[];
}

export interface EnrichmentResultFollowUp {
  tone: FollowUpTone;
  message: string;
}

export interface EnrichmentResult {
  person: EnrichmentResultPerson;
  company: EnrichmentResultCompany;
  followUpSuggestions: EnrichmentResultFollowUp[];
  enrichmentConfidence: EnrichmentConfidence;
  enrichmentNotes: string;
}

// ─── Composite types ──────────────────────────────────────────────────────────

export interface ContactWithSuggestions extends Contact {
  follow_up_suggestions: FollowUpSuggestion[];
}

// ─── API response types ───────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
}

export interface EnrichResponse {
  contact: ContactWithSuggestions;
  cached: boolean;
}

export interface EnrichRequiresManualPaste {
  requiresManualPaste: true;
  creditsRemaining: number;
}

export interface CreditsResponse {
  creditsUsed: number;
  creditsRemaining: number;
  monthYear: string;
  limit: number;
}

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  hasMore: boolean;
}
