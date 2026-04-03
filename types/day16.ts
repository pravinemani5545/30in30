export interface VoiceSettings {
  stability: number;
  speed: number;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: "premade" | "cloned" | "generated";
  labels: Record<string, string>;
  preview_url: string | null;
  description: string | null;
}

export type GenerationState =
  | "idle"
  | "generating"
  | "buffering"
  | "ready"
  | "error";

export interface Voiceover {
  id: string;
  user_id: string;
  text_content: string;
  character_count: number;
  voice_id: string;
  voice_name: string | null;
  speed: number;
  stability: number;
  storage_path: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  estimated_cost: number | null;
  script_id: string | null;
  generation_ms: number | null;
  created_at: string;
}

export interface CostEstimate {
  estimate: string;
  tier: "low" | "mid" | "high";
  rawCost: number;
}
