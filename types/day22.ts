// ─── Day 22: B-RollFinder Types ─────────────────────────────────────

export interface BRollConcept {
  timestamp: string;        // e.g. "0:00 - 0:45"
  scriptExcerpt: string;    // the portion of script this covers
  visualConcept: string;    // description of what to show
  searchTerms: string[];    // 3-5 search terms for stock footage
  mood: string;             // e.g. "energetic", "contemplative", "urgent"
  duration: number;         // seconds
}

export interface BRollAnalysis {
  totalDuration: string;    // estimated total video duration
  wordCount: number;
  concepts: BRollConcept[];
}

export interface AnalyzeScriptInput {
  script: string;
}
