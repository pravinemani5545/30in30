// ─── Enums ───────────────────────────────────────────────────────────────────

export type TweetType = "hook" | "story" | "stat" | "contrarian" | "listicle";
export type GenerationStatus = "pending" | "parsing" | "generating" | "completed" | "failed";
export type ContentQuality = "full" | "limited" | "og_only";

// ─── Parsed Article ───────────────────────────────────────────────────────────

export interface ParsedArticle {
  url: string;
  domain: string;
  faviconUrl: string;
  title: string;
  description: string;
  author: string | null;
  publishedAt: string | null;
  ogImageUrl: string | null;
  mainContent: string;
  wordCount: number;
  estimatedReadMinutes: number;
  contentQuality: ContentQuality;
}

// ─── Claude Output ────────────────────────────────────────────────────────────

export interface ClaudeTweetVariation {
  variationNumber: number;
  tweetType: TweetType;
  content: string;
  characterCount: number;
  hookScore: number;
  hookAnalysis: string;
  retweetPotential: number;
  replyBait: number;
  savesPotential: number;
  whyThisWorks: string;
  potentialWeakness: string;
}

export interface ClaudeGenerateOutput {
  articleSummary: string;
  keyInsights: string[];
  tweets: ClaudeTweetVariation[];
}

// ─── Database Types ───────────────────────────────────────────────────────────

export interface TweetVariation {
  id: string;
  generation_id: string;
  user_id: string;
  variation_number: number;
  tweet_type: TweetType;
  content: string;
  character_count: number;
  hook_score: number;
  hook_analysis: string;
  retweet_potential: number;
  reply_bait: number;
  saves_potential: number;
  why_this_works: string;
  potential_weakness: string;
  is_regenerated: boolean;
  copied_at: string | null;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  article_url: string;
  article_title: string | null;
  article_domain: string | null;
  article_favicon_url: string | null;
  content_quality: ContentQuality;
  status: GenerationStatus;
  tweet_variations: ClaudeGenerateOutput | null;
  article_summary: string | null;
  key_insights: string[] | null;
  error_message: string | null;
  generation_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationWithVariations extends Generation {
  variations: TweetVariation[];
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface GenerateResponse {
  generationId: string;
  articleUrl: string;
  articleTitle: string;
  articleDomain: string;
  articleFaviconUrl: string;
  articleSummary: string;
  keyInsights: string[];
  variations: TweetVariation[];
  contentQuality: ContentQuality;
  cached: boolean;
}

export interface PreviewResponse {
  title: string;
  description: string;
  domain: string;
  faviconUrl: string;
  estimatedReadMinutes: number;
  ogImageUrl: string | null;
}

export interface ApiError {
  error: string;
  code?: string;
}

// ─── History List Item ────────────────────────────────────────────────────────

export interface GenerationListItem {
  id: string;
  article_url: string;
  article_title: string | null;
  article_domain: string | null;
  article_favicon_url: string | null;
  created_at: string;
  top_hook_score: number | null;
}
