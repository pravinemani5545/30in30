export interface ICPQuestion {
  question: string;
  hint: string;
  key: string;
}

export interface FirmographicProfile {
  companySizeRange: string;
  industryVertical: string;
  growthStage: string;
  revenueRange: string;
  techStackSignals: string[];
  geography: string;
  notes: string | null;
}

export interface PainPointHierarchy {
  surfacePain: string;
  realPain: string;
  urgentPain: string;
  triggerEvent: string;
}

export interface ObjectionEntry {
  statedObjection: string;
  underlyingFear: string;
  counterFrame: string;
}

export interface ChannelEntry {
  channel: string;
  reasoning: string;
  tacticalSuggestion: string;
  isInferred: boolean;
}

export interface SynthesisOutput {
  firmographicProfile: FirmographicProfile;
  painPointHierarchy: PainPointHierarchy;
  objectionMap: ObjectionEntry[];
  recommendedChannels: ChannelEntry[];
}

export interface ICPProfile {
  id: string;
  user_id: string;
  company_name: string;
  interview_answers: Record<string, string>;
  firmographic_profile: FirmographicProfile;
  pain_point_hierarchy: PainPointHierarchy;
  objection_map: ObjectionEntry[];
  recommended_channels: ChannelEntry[];
  reality_check_text: string;
  synthesis_ms: number | null;
  reality_check_ms: number | null;
  ai_model_used: string;
  created_at: string;
}

export interface ICPProfileSummary {
  id: string;
  company_name: string;
  created_at: string;
}

export type InterviewState = "idle" | "active" | "submitting" | "complete";
