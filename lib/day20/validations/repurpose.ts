import { z } from "zod";

const OutputTypeEnum = z.enum([
  "summaryCard",
  "xThread",
  "standaloneTweets",
  "youtubeDescription",
  "newsletterSection",
  "linkedinPost",
  "tiktokCaptions",
]);

export const VoiceCalibrationSchema = z.object({
  examplePost: z.string().max(2000).optional().default(""),
  tone: z.string().max(200).optional().default(""),
  vocabUse: z.string().max(200).optional().default(""),
  vocabAvoid: z.string().max(200).optional().default(""),
});

export const RepurposeInputSchema = z.object({
  sourceText: z
    .string()
    .min(100, "Source text must be at least 100 characters")
    .max(20000, "Source text must be under 20,000 characters"),
  calibration: VoiceCalibrationSchema.optional(),
  selectedOutputs: z
    .array(OutputTypeEnum)
    .min(1, "Select at least one output type")
    .default([
      "summaryCard",
      "xThread",
      "standaloneTweets",
      "youtubeDescription",
      "newsletterSection",
      "linkedinPost",
      "tiktokCaptions",
    ]),
});

// Gemini output validation
const SummaryCardSchema = z.object({
  title: z.string(),
  keyPoints: z.array(z.string()).min(1).max(5),
  quote: z.string(),
  platforms: z.array(z.string()),
});

const XThreadSchema = z.object({
  tweetCount: z.number().min(4).max(20),
  tweets: z.array(z.string()).min(4).max(20),
});

const YouTubeTimestampSchema = z.object({
  time: z.string(),
  label: z.string(),
});

const YouTubeDescriptionSchema = z.object({
  title: z.string(),
  body: z.string(),
  timestamps: z.array(YouTubeTimestampSchema),
  tags: z.array(z.string()),
});

const NewsletterSectionSchema = z.object({
  body: z.string(),
  cta: z.string(),
});

const TikTokCaptionsSchema = z.object({
  short: z.string(),
  medium: z.string(),
  long: z.string(),
});

export const PipelineOutputSchema = z.object({
  summaryCard: SummaryCardSchema,
  xThread: XThreadSchema,
  standaloneTweets: z.array(z.string()).min(1).max(8),
  youtubeDescription: YouTubeDescriptionSchema,
  newsletterSection: NewsletterSectionSchema,
  linkedinPost: z.string(),
  tiktokCaptions: TikTokCaptionsSchema,
});
