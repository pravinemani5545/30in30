/**
 * Collects a ReadableStream of Uint8Array chunks into a single Blob.
 *
 * THE AUDIO BUFFERING SOLUTION:
 * The HTML5 audio element cannot play a live ReadableStream — it needs a
 * complete file (URL or Blob). We must collect ALL chunks before creating
 * the Blob and object URL.
 */
export async function collectStreamToBlob(
  stream: ReadableStream<Uint8Array>,
): Promise<Blob> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([combined], { type: "audio/mpeg" });
}

export function blobToObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}
