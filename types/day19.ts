// Day 19 — ContentCalendar types

export type Platform = "youtube" | "x" | "newsletter" | "linkedin";
export type ContentFormat = "video" | "thread" | "essay" | "short" | "newsletter";
export type EffortLevel = "high" | "medium" | "low";
export type Frequency = "daily" | "3x_week" | "weekly" | "2x_month";

export interface PlatformFrequency {
  platform: Platform;
  frequency: Frequency;
}

export interface DerivedPost {
  dayNumber: number;
  platform: Platform;
  derivationType: string;
}

export interface RepurposingMap {
  parentDayNumber: number | null;
  derivedPosts: DerivedPost[];
}

export interface PostItem {
  dayNumber: number;
  dayOfWeek: string;
  platform: Platform;
  format: ContentFormat;
  effortLevel: EffortLevel;
  topic: string;
  postingTime: string;
  rationale: string;
  windowViolation: boolean;
  repurposingMap: RepurposingMap | null;
}

export interface CalendarOutput {
  calendarSummary: string;
  highEffortDays: number[];
  posts: PostItem[];
}

export interface ContentCalendar {
  id: string;
  user_id: string;
  pillars: string[];
  platforms: PlatformFrequency[];
  audience_persona: string;
  unique_perspective: string;
  style_example: string | null;
  month_label: string;
  posts: PostItem[];
  constraint_violations: number;
  generic_output_warning: boolean;
  ai_model_used: string;
  generation_ms: number | null;
  created_at: string;
  // Computed client-side
  calendar_summary?: string;
}

export interface CalendarListItem {
  id: string;
  month_label: string;
  pillars: string[];
  constraint_violations: number;
  generic_output_warning: boolean;
  created_at: string;
  post_count: number;
}

export interface CalendarInput {
  pillars: string[];
  platforms: PlatformFrequency[];
  audiencePersona: string;
  uniquePerspective: string;
  styleExample?: string;
  monthLabel: string;
  includeWeekends?: boolean;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  x: "X (Twitter)",
  newsletter: "Newsletter",
  linkedin: "LinkedIn",
};

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  video: "Video",
  thread: "Thread",
  essay: "Essay",
  short: "Short",
  newsletter: "Newsletter",
};

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: "Daily",
  "3x_week": "3x / week",
  weekly: "Weekly",
  "2x_month": "2x / month",
};
