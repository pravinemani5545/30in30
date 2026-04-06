import { z } from "zod";

export const addCompanySchema = z.object({
  url: z
    .string()
    .min(1, { error: "URL is required" })
    .url({ error: "Must be a valid URL" })
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      error: "URL must start with http:// or https://",
    }),
});

export const changesQuerySchema = z.object({
  type: z.enum(["pricing", "feature", "hiring", "messaging", "other"]).optional(),
  days: z.coerce.number().min(1).max(90).default(7),
  limit: z.coerce.number().min(1).max(100).default(50),
});

/**
 * Extract domain from URL for display.
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Normalize URL: ensure https, strip trailing slash.
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }
  // Remove trailing slash
  normalized = normalized.replace(/\/+$/, "");
  return normalized;
}

/**
 * Build favicon URL from domain.
 */
export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
