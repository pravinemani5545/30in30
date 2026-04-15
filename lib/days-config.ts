export type DayStatus = "live" | "coming-soon";

export interface DayConfig {
  day: number;
  slug: string;
  name: string;
  tagline: string;
  status: DayStatus;
  tags: string[];
}

export const DAYS: DayConfig[] = [
  { day: 1, slug: "day1", name: "ClaudeJournal", tagline: "Voice-to-structured journal with AI analysis", status: "live", tags: ["Gemini", "Speech API"] },
  { day: 2, slug: "day2", name: "FounderCRM", tagline: "AI-powered CRM for solo founders", status: "live", tags: ["Claude", "Apollo.io"] },
  { day: 3, slug: "day3", name: "TweetCraft", tagline: "Blog article to tweet thread generator", status: "live", tags: ["Claude", "Cheerio"] },
  { day: 4, slug: "day4", name: "HackerNewsDigest", tagline: "Daily HN digest with AI summaries", status: "live", tags: ["Claude", "Resend", "Cron"] },
  { day: 5, slug: "day5", name: "PitchDoctor", tagline: "AI pitch deck critique and rewriting", status: "live", tags: ["Claude", "Structured Outputs"] },
  { day: 6, slug: "day6", name: "CompetitorRadar", tagline: "Competitor intelligence from any URL", status: "live", tags: ["Claude", "Puppeteer"] },
  { day: 7, slug: "day7", name: "VoiceNoteToBlog", tagline: "Voice memo to structured blog post", status: "live", tags: ["Whisper", "AI SDK"] },
  { day: 8, slug: "day8", name: "PDFQueryEngine", tagline: "Ask questions about any PDF with RAG", status: "live", tags: ["pgvector", "Embeddings"] },
  { day: 9, slug: "day9", name: "MeetingPrep", tagline: "AI-powered pre-meeting intelligence briefings", status: "live", tags: ["Claude", "Serper", "Realtime"] },
  { day: 10, slug: "day10", name: "AICodeReviewer", tagline: "Adversarial code review powered by Gemini", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 11, slug: "day11", name: "OutreachGrader", tagline: "Score and improve outreach messages", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 12, slug: "day12", name: "ThumbnailForge", tagline: "YouTube thumbnail concepts via Galloway's framework", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 13, slug: "day13", name: "ICPBuilder", tagline: "Build ideal customer profiles with AI", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 14, slug: "day14", name: "ScriptEngine", tagline: "YouTube video script generator with hook validation", status: "live", tags: ["Gemini 2.5 Flash", "AI SDK", "Streaming"] },
  { day: 15, slug: "day15", name: "EmailSequenceWriter", tagline: "5-email outbound sequence with psychological arc", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 16, slug: "day16", name: "VoiceoverStudio", tagline: "ElevenLabs voiceover generator with audio buffering", status: "live", tags: ["ElevenLabs", "Audio API"] },
  { day: 17, slug: "day17", name: "DeliverabilityTester", tagline: "DNS-based cold email deliverability grade", status: "live", tags: ["Gemini 2.5 Flash", "DNS", "Node.js"] },
  { day: 18, slug: "day18", name: "CompanyTracker", tagline: "Daily website change monitoring with AI classification", status: "live", tags: ["Gemini 2.5 Flash", "Resend", "Cron"] },
  { day: 19, slug: "day19", name: "ContentCalendar", tagline: "30-day AI content calendar with repurposing map", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 20, slug: "day20", name: "ContentRepurpose", tagline: "One source, seven formats, zero rewrites", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 21, slug: "day21", name: "ReplyClassifier", tagline: "AI email reply classification and routing", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 22, slug: "day22", name: "B-RollFinder", tagline: "Script-to-visual B-roll concept generator", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 23, slug: "day23", name: "CampaignDashboard", tagline: "Campaign analytics with funnel charts and A/B tests", status: "live", tags: ["Recharts", "Z-Test"] },
  { day: 24, slug: "day24", name: "VideoIdeaEngine", tagline: "AI-powered video idea generation from niche keywords", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 25, slug: "day25", name: "CheckoutKit", tagline: "Pricing page with mock checkout and subscription flow", status: "live", tags: ["Supabase", "Mock Stripe"] },
  { day: 26, slug: "day26", name: "AgentOrchestrator", tagline: "Multi-agent workflow builder with sequential execution", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 27, slug: "day27", name: "OnboardingWizard", tagline: "4-step onboarding wizard with Zod validation", status: "live", tags: ["Framer Motion", "Zod"] },
  { day: 28, slug: "day28", name: "ChangelogGen", tagline: "Git log to narrative changelog and tweet hooks", status: "live", tags: ["Gemini 2.5 Flash", "JSON Mode"] },
  { day: 29, slug: "day29", name: "PipelineDemo", tagline: "4-stage AI sales pipeline from company URL to campaign", status: "live", tags: ["Gemini 2.5 Flash", "Pipeline"] },
  { day: 30, slug: "day30", name: "YouTubeAIKit", tagline: "Full YouTube content package from a single topic", status: "live", tags: ["Gemini 2.5 Flash", "Pipeline"] },
  { day: 31, slug: "day31", name: "PriceTracker", tagline: "Dead-simple price monitoring with AI extraction", status: "live", tags: ["Gemini", "Resend", "Cron", "recharts"] },
];
