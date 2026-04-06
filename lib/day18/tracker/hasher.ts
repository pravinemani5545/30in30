import { createHash } from "crypto";

/**
 * SHA-256 hash of text content.
 * Returns a 64-character hex string.
 */
export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
