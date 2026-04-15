// ─── Day 24: VideoIdeaEngine Types ──────────────────────────────────

export interface OutlierVideo {
  title: string;
  views: number;
  subscribers: number;
  ratio: number; // views / subscribers
  uploadDate: string;
  whyOutlier: string;
}

export interface Pattern {
  name: string;
  description: string;
  examples: string[];
  frequency: number; // how many outliers used this pattern (1-10)
}

export interface VideoIdea {
  title: string;
  hook: string; // first 10 seconds script
  angle: string; // unique angle/perspective
  format: string; // e.g. "listicle", "story", "tutorial"
  estimatedPerformance: "high" | "medium" | "moderate";
  reasoning: string; // why this idea would work
}

export interface VideoIdeaAnalysis {
  niche: string;
  outlierVideos: OutlierVideo[];
  patterns: Pattern[];
  ideas: VideoIdea[];
}
