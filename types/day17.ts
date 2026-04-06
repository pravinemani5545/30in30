export type Grade = "A" | "B" | "C" | "D" | "F";

export type CheckStatus = "pass" | "warning" | "fail" | "unknown";

export interface CheckResult {
  passed: boolean;
  warning: boolean;
  rawRecord: string | null;
  details: string;
}

export interface DKIMCheckResult extends CheckResult {
  selectorFound: string | null;
}

export interface AllCheckResults {
  spf: CheckResult;
  dkim: DKIMCheckResult;
  dmarc: CheckResult;
  mx: CheckResult;
  domainAge: CheckResult;
}

export interface CheckExplanation {
  explanation: string;
  remediation: string | null;
}

export interface ExplanationsOutput {
  overallSummary: string;
  checks: {
    spf: CheckExplanation;
    dkim: CheckExplanation;
    dmarc: CheckExplanation;
    mx: CheckExplanation;
    domainAge: CheckExplanation;
  };
}

export interface DeliverabilityReport {
  id: string;
  domain: string;
  overall_grade: Grade;
  overall_score: number;
  all_checks_passed: boolean;
  spf_result: CheckResult;
  dkim_result: DKIMCheckResult;
  dmarc_result: CheckResult;
  mx_result: CheckResult;
  domain_age_result: CheckResult;
  dkim_selector_found: string | null;
  explanations: ExplanationsOutput;
  lookup_ms: number;
  ai_ms: number;
  ai_model_used: string;
  created_at: string;
}

export interface CheckHistoryItem {
  id: string;
  domain: string;
  overall_grade: Grade;
  overall_score: number;
  all_checks_passed: boolean;
  created_at: string;
}

export type CheckName = "spf" | "dkim" | "dmarc" | "mx" | "domainAge";

export const CHECK_LABELS: Record<CheckName, string> = {
  spf: "SPF Record",
  dkim: "DKIM Record",
  dmarc: "DMARC Policy",
  mx: "MX Records",
  domainAge: "Domain Age",
};

export const GRADE_LABELS: Record<Grade, string> = {
  A: "Campaign Ready",
  B: "Minor Issues",
  C: "Significant Gaps",
  D: "High Risk",
  F: "Will Be Blocked",
};
