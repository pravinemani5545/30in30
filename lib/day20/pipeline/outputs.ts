import type { OutputType } from "@/types/day20";

export interface OutputTypeConfig {
  key: OutputType;
  label: string;
  tag: string;
  description: string;
}

export const OUTPUT_TYPES: OutputTypeConfig[] = [
  {
    key: "summaryCard",
    label: "Content Summary",
    tag: "SUMMARY",
    description: "Title, 3 key points, best quote, platform tags",
  },
  {
    key: "xThread",
    label: "X Thread",
    tag: "X_THREAD",
    description: "8-15 tweets with hook opener and CTA closer",
  },
  {
    key: "standaloneTweets",
    label: "Standalone Tweets",
    tag: "TWEETS",
    description: "3-5 independently shareable atomic insights",
  },
  {
    key: "youtubeDescription",
    label: "YouTube Description",
    tag: "YOUTUBE",
    description: "Title, description, timestamps, and tags",
  },
  {
    key: "newsletterSection",
    label: "Newsletter Section",
    tag: "NEWSLETTER",
    description: "200-300 word section with CTA",
  },
  {
    key: "linkedinPost",
    label: "LinkedIn Post",
    tag: "LINKEDIN",
    description: "150-250 word professional post with hook",
  },
  {
    key: "tiktokCaptions",
    label: "TikTok / Reels",
    tag: "TIKTOK",
    description: "Short, medium, and long caption variants",
  },
];

export const ALL_OUTPUT_KEYS: OutputType[] = OUTPUT_TYPES.map((o) => o.key);
