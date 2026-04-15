// ─── Day 28: ChangelogGen Types ─────────────────────────────────────

export interface ChangelogSection {
  emoji: string;
  title: string;
  items: string[];
}

export interface TweetHook {
  text: string;
  angle: string; // e.g. "achievement", "behind-the-scenes", "hot-take"
  charCount: number;
}

export interface ChangelogResult {
  narrative: string; // full narrative changelog (markdown)
  sections: ChangelogSection[]; // structured sections (Features, Fixes, etc.)
  tweetHooks: TweetHook[]; // 5 tweetable hooks
  commitCount: number;
  dateRange: string;
}
