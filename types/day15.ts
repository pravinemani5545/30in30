export interface SingleEmail {
  emailNumber: number;
  emailType: EmailType;
  sendDay: number;
  sendTiming: string;
  subjectA: string;
  subjectB: string;
  body: string;
  personalizationSlots: string[];
  wordCount: number;
  hasFollowupLanguage: boolean;
}

export interface SequenceOutput {
  sequenceSummary: string;
  pivotAngle: string;
  emails: SingleEmail[];
}

export interface EmailSequence {
  id: string;
  user_id: string;
  persona: string;
  value_proposition: string;
  social_proof: string;
  observation: string | null;
  emails: SingleEmail[];
  used_in_campaign: boolean;
  campaign_id: string | null;
  has_followup_warning: boolean;
  generation_ms: number;
  ai_model_used: string;
  sequence_summary: string;
  pivot_angle: string;
  created_at: string;
}

export interface SequenceInput {
  persona: string;
  valueProp: string;
  socialProof: string;
  observation?: string;
}

export interface SequenceHistoryItem {
  id: string;
  persona: string;
  has_followup_warning: boolean;
  created_at: string;
}

export type EmailType =
  | "pattern_interrupt"
  | "social_proof_reframe"
  | "pivot"
  | "gracious_breakup"
  | "long_tail_reengagement";
