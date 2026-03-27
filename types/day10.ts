export type FindingSeverity = "critical" | "high" | "medium" | "low";
export type FindingCategory = "bug" | "security" | "performance" | "style";
export type ReviewStatus = "pending" | "reviewing" | "complete" | "failed";

export interface Finding {
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  lineReference: string;
  severityRationale: string;
  description: string;
  suggestedFix: string;
}

export interface CodeReviewOutput {
  confirmedLanguage: string;
  totalLines: number;
  summary: string;
  hasRlsRisk: boolean;
  findings: Finding[];
}

export interface CodeReview {
  id: string;
  user_id: string;
  code_snippet: string;
  detected_language: string;
  confirmed_language: string | null;
  status: ReviewStatus;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_lines: number | null;
  summary: string | null;
  findings: Finding[];
  ai_model_used: string;
  review_ms: number | null;
  error_message: string | null;
  created_at: string;
}

export interface CodeReviewSummary {
  id: string;
  detected_language: string;
  confirmed_language: string | null;
  status: ReviewStatus;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  summary: string | null;
  created_at: string;
}
