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
  const hasText = result.text && result.text.trim().length > 50;

  console.log(
    `[parse] pdf-parse: pages=${result.numpages} textLen=${result.text?.length ?? 0} ` +
      `trimmedLen=${result.text?.trim().length ?? 0} hasText=${hasText}`
  );

  if (hasText) {
    return buildResult(result.text, result.numpages, result.info?.Title);
  }

  // Fallback: Gemini Vision OCR for image-based / scanned PDFs
  console.log("[parse] Falling back to Gemini OCR...");
  const ocrText = await extractWithGeminiOcr(buffer, result.numpages);

  if (!ocrText || ocrText.trim().length === 0) {
    throw new Error(
      "Could not extract text from this PDF. It may be corrupted or empty."
    );
  }

  console.log(`[parse] Gemini OCR extracted ${ocrText.trim().length} chars`);
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

  if (pages.length === 0) {
    pages.push({ pageNumber: 1, text: fullText.trim() });
  }

  const wordCount = fullText
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;

  console.log(`[parse] Result: ${pages.length} pages, ${wordCount} words`);

  return {
    pages,
    pageCount: numPages,
    wordCount,
    title: title && typeof title === "string" ? title : null,
  };
}

/**
 * Use Gemini 2.5 Flash to OCR an image-based PDF.
 * Sends the entire PDF and extracts all text with page separators.
 */
async function extractWithGeminiOcr(
  buffer: Buffer,
  numPages: number
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 65536,
    },
  });

  const base64 = buffer.toString("base64");

  const prompt =
    `This is a ${numPages}-page PDF document. ` +
    "Your task is to extract ALL text from EVERY page — do not skip or summarize any content. " +
    "Between each page's content, insert the exact string \\f (form feed). " +
    "Rules:\n" +
    "- Extract the COMPLETE text of every page\n" +
    "- Preserve headings, paragraphs, lists, code blocks\n" +
    "- Do NOT add markdown formatting, commentary, or summaries\n" +
    "- Do NOT skip pages — extract all " + numPages + " pages\n" +
    "- Output ONLY the extracted text separated by \\f between pages";

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      prompt,
    ]);

    const text = result.response.text();
    // Replace literal \f strings with actual form feed characters
    return text.replace(/\\f/g, "\f");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown OCR error";
    console.error("[parse] Gemini OCR failed:", message);
    throw new Error(`PDF text extraction failed: ${message}`);
  }
}
