import { getModelJson } from "@/lib/day20/ai/gemini";
import { buildSystemPrompt } from "@/lib/day20/gemini/prompts";
import { PipelineOutputSchema } from "@/lib/day20/validations/repurpose";
import type { VoiceCalibration, PipelineOutputs } from "@/types/day20";

const MAX_SOURCE_WORDS = 3000;

function trimSource(text: string): { trimmed: string; wasTrimmed: boolean } {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= MAX_SOURCE_WORDS) {
    return { trimmed: text, wasTrimmed: false };
  }
  return {
    trimmed: words.slice(0, MAX_SOURCE_WORDS).join(" "),
    wasTrimmed: true,
  };
}

export async function repurposeContent(
  sourceText: string,
  calibration?: VoiceCalibration,
): Promise<{ outputs: PipelineOutputs; wasTrimmed: boolean }> {
  const systemPrompt = buildSystemPrompt(calibration);
  const model = getModelJson(systemPrompt);

  const { trimmed, wasTrimmed } = trimSource(sourceText);

  const userPrompt = `Repurpose the following long-form content into all seven platform-optimised formats. Follow every specification in your instructions precisely.

SOURCE CONTENT:
${trimmed}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Fence strip
  const cleaned = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  const validated = PipelineOutputSchema.parse(parsed);

  return { outputs: validated, wasTrimmed };
}
