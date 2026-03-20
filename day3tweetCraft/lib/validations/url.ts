import { z } from "zod";

const BLOCKED_DOMAINS = [
  "twitter.com",
  "x.com",
  "instagram.com",
  "facebook.com",
  "linkedin.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
];

const BLOCKED_EXTENSIONS = [".pdf", ".doc", ".docx", ".zip", ".xls", ".xlsx"];

export const UrlSchema = z
  .string()
  .url({ message: "Please enter a valid URL" })
  .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  })
  .refine(
    (url) => !BLOCKED_DOMAINS.some((d) => url.includes(d)),
    {
      message: "Please paste a blog post URL — social media links aren't supported yet",
    }
  )
  .refine(
    (url) => !BLOCKED_EXTENSIONS.some((e) => url.toLowerCase().endsWith(e)),
    {
      message: "Direct file links are not supported — please link to a webpage",
    }
  )
  .transform((url) => {
    try {
      const u = new URL(url);
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid",
        "ref",
        "source",
      ].forEach((p) => u.searchParams.delete(p));
      return u.toString();
    } catch {
      return url;
    }
  });

export type ValidatedUrl = z.infer<typeof UrlSchema>;
