import type { PageContent } from "@/types/day8";

interface ParseResult {
  pages: PageContent[];
  pageCount: number;
  wordCount: number;
  title: string | null;
}

export async function parsePdf(buffer: Buffer): Promise<ParseResult> {
  // Dynamic require to avoid Turbopack ESM issues with pdf-parse v1
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");

  const result = await pdfParse(buffer);

  if (!result.text || result.text.trim().length === 0) {
    throw new Error(
      "This PDF has no selectable text. It may be a scanned document. " +
        "Please upload a PDF with selectable text, or use OCR software first."
    );
  }

  // pdf-parse v1 returns full text. Split by form feed character for per-page text.
  const pages: PageContent[] = [];
  const rawPages = result.text.split(/\f/);
  let pageNumber = 1;

  for (const text of rawPages) {
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      pages.push({ pageNumber, text: trimmed });
    }
    pageNumber++;
  }

  // If no form feeds found, use full text as single page
  if (pages.length === 0) {
    pages.push({ pageNumber: 1, text: result.text.trim() });
  }

  const wordCount = result.text
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;

  const title =
    result.info?.Title && typeof result.info.Title === "string"
      ? result.info.Title
      : null;

  return {
    pages,
    pageCount: result.numpages,
    wordCount,
    title,
  };
}
