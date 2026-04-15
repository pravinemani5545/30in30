// ─── Day 30: YouTubeAIKit (Capstone) Types ─────────────────────

export interface TitleVariation {
  title: string;
  hook: string;
  angle: string;
  targetEmotion: string;
}

export interface Ideation {
  topic: string;
  variations: TitleVariation[];
  selectedIndex: number;
}

export interface ScriptSection {
  name: string;
  content: string;
  duration: string;
  notes: string;
}

export interface Script {
  title: string;
  totalDuration: string;
  wordCount: number;
  sections: ScriptSection[];
}

export interface BRollItem {
  timestamp: string;
  description: string;
  searchTerms: string[];
  mood: string;
}

export interface BRollBrief {
  items: BRollItem[];
  totalClips: number;
}

export interface ThumbnailConcept {
  layout: string;
  textOverlay: string;
  emotionTrigger: string;
  colorScheme: string;
  description: string;
}

export interface ThumbnailPack {
  concepts: ThumbnailConcept[];
}

export interface YouTubePackage {
  ideation: Ideation | null;
  script: Script | null;
  bRollBrief: BRollBrief | null;
  thumbnails: ThumbnailPack | null;
  totalDurationMs: number;
}
