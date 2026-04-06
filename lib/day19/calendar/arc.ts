// Day 19 — ContentCalendar arc constants
// Month 6 YouTube AI SaaS scheduler imports these. Do NOT rename.

import type { Platform, ContentFormat, EffortLevel, Frequency } from "@/types/day19";

export const PLATFORMS: readonly Platform[] = ["youtube", "x", "newsletter", "linkedin"] as const;
export const FORMATS: readonly ContentFormat[] = ["video", "thread", "essay", "short", "newsletter"] as const;
export const EFFORT_LEVELS: readonly EffortLevel[] = ["high", "medium", "low"] as const;
export const FREQUENCIES: readonly Frequency[] = ["daily", "3x_week", "weekly", "2x_month"] as const;

export const HIGH_EFFORT_FORMATS: ContentFormat[] = ["video", "thread", "essay"];
export const MAX_HIGH_EFFORT_PER_WINDOW = 2;
export const WINDOW_SIZE_DAYS = 7;

export const REPURPOSING_TYPES = [
  "thread_from_video",
  "newsletter_from_video",
  "short_from_thread",
  "short_from_video",
] as const;

export const GENERIC_PATTERNS = [
  /^5 /i,
  /^10 /i,
  /^how to /i,
  /^tips for /i,
  /^guide to /i,
  /^best practices/i,
  /^the ultimate /i,
  /^everything you need/i,
];

export function isGenericTopic(topic: string): boolean {
  return GENERIC_PATTERNS.some((p) => p.test(topic.trim()));
}
