import { z } from "zod";

export const GenerateScriptInputSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters").max(500).trim(),
  targetDuration: z.number().int().min(1).max(30),
});

export const SaveScriptInputSchema = z.object({
  topic: z.string().min(1).max(500).trim(),
  targetDuration: z.number().int().min(1).max(30),
  targetWordCount: z.number().int().min(1),
  actualWordCount: z.number().int().min(0),
  scriptContent: z.string().min(1),
  sections: z.array(
    z.object({
      marker: z.string(),
      label: z.string(),
      content: z.string(),
    }),
  ),
  generationMs: z.number().int().optional(),
});

export const HookValidationResultSchema = z.object({
  quality: z.enum(["strong", "weak"]),
  reasoning: z.string(),
  hookText: z.string(),
});
