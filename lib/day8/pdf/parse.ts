import type { PageContent } from "@/types/day8";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // If pdf-parse extracted text, use it
  if (result.text && result.text.trim().length > 50) {
    return buildResult(result.text, result.numpages, result.info?.Title);
  }

  // Fallback: use Gemini Vision OCR for image-based PDFs
  console.log("[parse] pdf-parse returned no text, falling back to Gemini OCR");
  const ocrText = await extractWithGeminiOcr(buffer, result.numpages);

  if (!ocrText || ocrText.trim().length === 0) {
    throw new Error(
      "Could not extract text from this PDF. It may be corrupted or contain only images that could not be processed."
    );
  }

  return buildResult(ocrText, result.numpages, null);
}

function buildResult(
  fullText: string,
  numPages: number,
  title: string | null | undefined
): ParseResult {
  const pages: PageContent[] = [];
  const rawPages = fullText.split(/\f/);
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
    pages.push({ pageNumber: 1, text: fullText.trim() });
  }

  const wordCount = fullText
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;

  return {
    pages,
    pageCount: numPages,
    wordCount,
    title: title && typeof title === "string" ? title : null,
  };
}

/**
 * Use Gemini 2.5 Flash to OCR an image-based PDF.
 * Sends the full PDF as inline data and asks for text extraction.
 */
async function extractWithGeminiOcr(
  buffer: Buffer,
  numPages: number
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const base64 = buffer.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64,
      },
    },
    `Extract ALL text from every page of this ${numPages}-page PDF document. ` +
      "For each page, output the page marker PAGE_BREAK followed by all text on that page. " +
      "Preserve paragraph structure and formatting. " +
      "Output ONLY the raw text — no commentary, no summaries, no markdown formatting.",
  ]);

  const text = result.response.text();

  // Convert PAGE_BREAK markers to form feed characters for consistent parsing
  return text.replace(/PAGE_BREAK/g, "\f");
}
