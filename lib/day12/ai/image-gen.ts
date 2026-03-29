import { GoogleGenAI } from "@google/genai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for image generation");
  }
  genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return genAI;
}

const IMAGE_MODEL = "gemini-2.5-flash-image";

/**
 * Generate a thumbnail mockup image from composition instructions.
 * Returns base64-encoded PNG data.
 */
export async function generateThumbnailImage(
  conceptName: string,
  textOverlay: string[],
  compositionSteps: string[],
  paletteDescription: string,
  videoTitle: string,
): Promise<string> {
  const ai = getGenAI();

  const prompt = `Generate a YouTube thumbnail mockup image (1280x720 resolution feel).

Video: "${videoTitle}"
Concept: "${conceptName}"
Text on thumbnail: "${textOverlay.join(" ")}"

Colour palette: ${paletteDescription}

Composition instructions (follow these exactly):
${compositionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Style: Clean, professional YouTube thumbnail. Bold readable text overlay. High contrast. The text "${textOverlay.join(" ")}" must be prominently visible on the thumbnail.`;

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No image generated");
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    throw new Error("No content parts in response");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }

  throw new Error("No image data in response");
}
