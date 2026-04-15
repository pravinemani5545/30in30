import { generateIdeation } from "@/lib/day30/modules/ideation";
import { generateScript } from "@/lib/day30/modules/script";
import { generateBRollBrief } from "@/lib/day30/modules/broll";
import { generateThumbnails } from "@/lib/day30/modules/thumbnails";
import type { YouTubePackage } from "@/types/day30";

export async function generateYouTubePackage(
  topic: string,
): Promise<YouTubePackage> {
  const start = Date.now();

  // Step 1: Ideation first (other modules depend on it)
  const ideation = await generateIdeation(topic);

  // Step 2: Script, B-Roll, and Thumbnails in parallel
  const [scriptResult, bRollResult, thumbnailsResult] =
    await Promise.allSettled([
      generateScript(ideation),
      generateBRollBrief(ideation),
      generateThumbnails(ideation),
    ]);

  const totalDurationMs = Date.now() - start;

  return {
    ideation,
    script:
      scriptResult.status === "fulfilled" ? scriptResult.value : null,
    bRollBrief:
      bRollResult.status === "fulfilled" ? bRollResult.value : null,
    thumbnails:
      thumbnailsResult.status === "fulfilled"
        ? thumbnailsResult.value
        : null,
    totalDurationMs,
  };
}
