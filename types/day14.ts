export type HookQuality = "strong" | "weak" | "pending";

export interface ScriptSection {
  marker: string;
  label: string;
  content: string;
}

export interface Script {
  id: string;
  user_id: string;
  topic: string;
  target_duration: number;
  target_word_count: number;
  actual_word_count: number | null;
  script_content: string;
  sections: ScriptSection[] | null;
  status: "complete" | "failed";
  generation_ms: number | null;
  ai_model_used: string;
  created_at: string;
}

export interface ScriptSummary {
  id: string;
  topic: string;
  target_duration: number;
  actual_word_count: number | null;
  created_at: string;
  hook_quality: HookQuality | null;
}

export interface HookValidation {
  id: string;
  script_id: string;
  quality: HookQuality;
  reasoning: string | null;
  hook_text: string | null;
  validated_at: string;
}
