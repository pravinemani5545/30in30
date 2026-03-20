import type { ParsedArticle } from "@/types";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/utils";
import { fetchHtml, isFetchError } from "./fetch";
import { extractArticleData } from "./extract";
import { cleanText, truncateToLimit, countWords } from "./clean";

export interface ParseError {
  error: string;
}

export function isParseError(result: ParsedArticle | ParseError): result is ParseError {
  return "error" in result;
}

export async function parseUrl(url: string): Promise<ParsedArticle | ParseError> {
  const fetchResult = await fetchHtml(url);

  if (isFetchError(fetchResult)) {
    return { error: fetchResult.error };
  }

  const { html, finalUrl } = fetchResult;
  const extracted = extractArticleData(html, finalUrl);

  // Clean and truncate main content
  const cleanedContent = extracted.mainContent
    ? truncateToLimit(cleanText(extracted.mainContent))
    : "";

  const wordCount =
    cleanedContent ? countWords(cleanedContent) : countWords(extracted.description);
  const estimatedReadMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    url: finalUrl,
    domain: getDomainFromUrl(finalUrl),
    faviconUrl: getFaviconUrl(finalUrl),
    title: extracted.title,
    description: extracted.description,
    author: extracted.author,
    publishedAt: extracted.publishedAt,
    ogImageUrl: extracted.ogImageUrl,
    mainContent: cleanedContent,
    wordCount,
    estimatedReadMinutes,
    contentQuality: extracted.contentQuality,
  };
}
