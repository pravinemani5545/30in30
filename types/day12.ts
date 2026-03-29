export type Driver = "curiosity_gap" | "pattern_interrupt" | "emotion_signal";
export type Tone = "inspiring" | "shocking" | "educational" | "entertaining" | "controversial" | "authentic";

export interface ColourSwatch {
  hex: string;
  role: string;
}

export interface ThumbConcept {
  driver: Driver;
  conceptName: string;
  isPredictedWinner: boolean;
  textOverlay: string[];
  colourPalette: ColourSwatch[];
  paletteRationale: string;
  compositionSteps: string[];
  abNote: string;
}

export interface ThumbnailConceptSet {
  id: string;
  user_id: string;
  video_title: string;
  niche: string;
  tone: Tone;
  predicted_winner: Driver;
  ab_hypothesis: string;
  concepts: ThumbConcept[];
  generation_ms: number | null;
  ai_model_used: string;
  created_at: string;
}

export interface ThumbnailConceptSummary {
  id: string;
  video_title: string;
  niche: string;
  tone: Tone;
  predicted_winner: Driver;
  created_at: string;
}
