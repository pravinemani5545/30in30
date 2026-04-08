// ─── Day 20: ContentRepurposingPipeline Types ─────────────────────

export interface VoiceCalibration {
  examplePost: string;
  tone: string;
  vocabUse: string;
  vocabAvoid: string;
}

export interface SummaryCard {
  title: string;
  keyPoints: string[];
  quote: string;
  platforms: string[];
}

export interface XThread {
  tweetCount: number;
  tweets: string[];
}

export interface YouTubeTimestamp {
  time: string;
  label: string;
}

export interface YouTubeDescription {
  title: string;
  body: string;
  timestamps: YouTubeTimestamp[];
  tags: string[];
}

export interface NewsletterSection {
  body: string;
  cta: string;
}

export interface TikTokCaptions {
  short: string;
  medium: string;
  long: string;
}

export interface PipelineOutputs {
  summaryCard: SummaryCard;
  xThread: XThread;
  standaloneTweets: string[];
  youtubeDescription: YouTubeDescription;
  newsletterSection: NewsletterSection;
  linkedinPost: string;
  tiktokCaptions: TikTokCaptions;
}

export type OutputType =
  | "summaryCard"
  | "xThread"
  | "standaloneTweets"
  | "youtubeDescription"
  | "newsletterSection"
  | "linkedinPost"
  | "tiktokCaptions";

export interface RepurposedContent {
  id: string;
  user_id: string;
  source_text: string;
  word_count: number;
  had_voice_calibration: boolean;
  outputs: PipelineOutputs;
  generation_ms: number;
  ai_model_used: string;
  created_at: string;
}

export interface RepurposedContentListItem {
  id: string;
  word_count: number;
  had_voice_calibration: boolean;
  created_at: string;
  source_text: string;
}

export interface RepurposeInput {
  sourceText: string;
  calibration?: VoiceCalibration;
  selectedOutputs: OutputType[];
}
