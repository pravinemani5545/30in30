export type BriefingStatus =
  | "queued"
  | "searching"
  | "synthesising"
  | "complete"
  | "failed";

export type ConfidenceLevel = "verified" | "likely" | "uncertain";

export type DataQuality = "rich" | "adequate" | "limited";

export interface BriefingInput {
  personName: string;
  companyName: string;
  meetingContext: string;
}

export interface SearchQuery {
  query: string;
  type: "general" | "linkedin" | "news";
  label: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  date: string | null;
  queryType: string;
}

export interface AggregatedResults {
  results: SearchResult[];
  queryCount: number;
  partial: boolean;
}

export interface BriefingSection {
  text: string;
  confidence: ConfidenceLevel;
  notes: string | null;
}

export interface TalkingPoint {
  point: string;
  explanation: string;
  source: string | null;
}

export interface Objection {
  objection: string;
  response: string;
}

export interface ConversationStarter {
  starter: string;
  seededBy: string;
}

export interface SourceItem {
  url: string;
  title: string;
  queryType: string;
  date: string | null;
}

export interface ClaudeBriefingOutput {
  background: BriefingSection;
  companyContext: BriefingSection;
  talkingPoints: TalkingPoint[];
  objections: Objection[];
  conversationStarters: ConversationStarter[];
  sources: SourceItem[];
  dataQuality: DataQuality;
  dataQualityNote: string | null;
}

export interface Briefing {
  id: string;
  user_id: string;
  person_name: string;
  company_name: string;
  meeting_context: string;
  cache_key: string;
  was_cached: boolean;
  cache_hit_at: string | null;
  background: string | null;
  background_confidence: ConfidenceLevel | null;
  company_context: string | null;
  company_confidence: ConfidenceLevel | null;
  talking_points: TalkingPoint[] | null;
  objections: Objection[] | null;
  conversation_starters: ConversationStarter[] | null;
  sources: SourceItem[] | null;
  status: BriefingStatus;
  search_1_done: boolean;
  search_2_done: boolean;
  search_3_done: boolean;
  synthesis_done: boolean;
  error_message: string | null;
  search_ms: number | null;
  synthesis_ms: number | null;
  data_quality: DataQuality | null;
  data_quality_note: string | null;
  booking_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BriefingSummary {
  id: string;
  person_name: string;
  company_name: string;
  meeting_context: string;
  created_at: string;
  was_cached: boolean;
  status: BriefingStatus;
}
