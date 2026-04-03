export interface ElevenLabsVoiceResponse {
  voices: {
    voice_id: string;
    name: string;
    category: string;
    labels: Record<string, string>;
    preview_url: string | null;
    description: string | null;
  }[];
}

export interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface ElevenLabsGenerateRequest {
  text: string;
  model_id: string;
  voice_settings: ElevenLabsVoiceSettings;
}
