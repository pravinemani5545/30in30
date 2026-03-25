import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadSchema = z.object({
  file: z.instanceof(File).refine(
    (f) => f.type === "application/pdf",
    { message: "Only PDF files are accepted" }
  ).refine(
    (f) => f.size <= MAX_FILE_SIZE,
    { message: "File must be under 10MB" }
  ),
});

export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  if (file.type !== "application/pdf") {
    return { valid: false, error: "Only PDF files are accepted" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File must be under 10MB" };
  }
  return { valid: true };
}
