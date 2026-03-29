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

// imagen-4.0-generate-001 is the dedicated image generation model
// Uses generateImages API — purpose-built, cheapest at $0.02/image
const IMAGE_MODEL = "imagen-4.0-generate-001";

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

/**
 * Generate a thumbnail mockup image from composition instructions.
 * Returns base64-encoded image data with mime type.
 */
export async function generateThumbnailImage(
  conceptName: string,
  textOverlay: string[],
  compositionSteps: string[],
  paletteDescription: string,
  videoTitle: string,
): Promise<GeneratedImage> {
  const ai = getGenAI();

  const prompt = `Generate a YouTube thumbnail mockup image (1280x720 resolution feel).

Video: "${videoTitle}"
Concept: "${conceptName}"
Text on thumbnail: "${textOverlay.join(" ")}"

Colour palette: ${paletteDescription}

Composition instructions (follow these exactly):
${compositionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Style: Clean, professional YouTube thumbnail. Bold readable text overlay. High contrast. The text "${textOverlay.join(" ")}" must be prominently visible on the thumbnail.`;

  const response = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: "16:9",
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("No image generated");
  }

  const imageBytes = response.generatedImages[0].image?.imageBytes;
  if (!imageBytes) {
    throw new Error("No image data in response");
  }

  return {
    base64: imageBytes,
    mimeType: response.generatedImages[0].image?.mimeType ?? "image/png",
  };
}
