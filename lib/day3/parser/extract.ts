import * as cheerio from "cheerio";
import type { ContentQuality } from "@/types/day3";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/day3/utils";

export interface ExtractedData {
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

export function extractArticleData(html: string, url: string): ExtractedData {
  const $ = cheerio.load(html);

  // ─── Title ────────────────────────────────────────────────────
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    getDomainFromUrl(url);

  // ─── Description ──────────────────────────────────────────────
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    $("p").first().text().trim().slice(0, 300) ||
    "";

  // ─── Author ───────────────────────────────────────────────────
  let author: string | null =
    $('meta[name="article:author"]').attr("content") ||
    $('meta[property="article:author"]').attr("content") ||
    $('[rel="author"]').first().text().trim() ||
    $(".author").first().text().trim() ||
    $(".byline").first().text().trim() ||
    null;

  // Try JSON-LD
  if (!author) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() ?? "{}") as Record<string, unknown>;
        const authorField = data.author;
        if (typeof authorField === "string") {
          author = authorField;
        } else if (
          typeof authorField === "object" &&
          authorField !== null &&
          "name" in authorField &&
          typeof (authorField as Record<string, unknown>).name === "string"
        ) {
          author = (authorField as Record<string, unknown>).name as string;
        }
      } catch {
        // Ignore invalid JSON-LD
      }
    });
  }

  if (author) author = author.trim() || null;

  // ─── Published Date ───────────────────────────────────────────
  const publishedAt =
    $('meta[property="article:published_time"]').attr("content") ||
    $("time[datetime]").first().attr("datetime") ||
    null;

  // ─── OG Image ─────────────────────────────────────────────────
  const ogImageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    null;

  // ─── Main Content ─────────────────────────────────────────────
  // Remove noise elements
  $("script, style, nav, footer, header, aside, .nav, .footer, .header, .sidebar, .menu, .cookie-banner, .ad, .advertisement, noscript").remove();

  let mainContent = "";

  const selectors = [
    'article[role="main"]',
    "main article",
    ".post-content",
    ".article-body",
    ".entry-content",
    ".article-content",
    ".post-body",
    ".content-body",
    '[class*="article"]',
    "article",
    "main",
  ];

  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length) {
      const text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 200) {
        mainContent = text;
        break;
      }
    }
  }

  // Fallback: join all paragraphs
  if (!mainContent || mainContent.length < 200) {
    mainContent = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 30)
      .join(" ");
  }

  // Determine content quality
  let contentQuality: ContentQuality = "full";
  if (mainContent.length < 200) {
    contentQuality = "og_only";
    mainContent = "";
  } else if (mainContent.length < 800) {
    contentQuality = "limited";
  }

  const wordCount = mainContent
    ? mainContent.split(/\s+/).filter((w) => w.length > 0).length
    : (description + " " + title).split(/\s+/).length;

  const estimatedReadMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    title: title.trim(),
    description: description.trim(),
    author,
    publishedAt,
    ogImageUrl: ogImageUrl || null,
    mainContent: mainContent.trim(),
    wordCount,
    estimatedReadMinutes,
    contentQuality,
  };
}
