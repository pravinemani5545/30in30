import { z } from "zod";

export const VoiceSettingsSchema = z.object({
  stability: z.number().min(0).max(1),
  speed: z.number().min(0.7).max(1.3).optional().default(1.0),
});

export const VoiceoverGenerateSchema = z.object({
  text: z.string().min(1, { error: "Text is required" }).max(5000, {
    error: "Text must be 5,000 characters or less",
  }),
  voiceId: z.string().min(1, { error: "Voice is required" }),
  settings: VoiceSettingsSchema,
});

export const VoiceoverSaveSchema = z.object({
  textContent: z.string().min(1),
  characterCount: z.number().int().positive(),
  voiceId: z.string().min(1),
  voiceName: z.string().nullable().optional(),
  speed: z.number(),
  stability: z.number(),
  fileSizeBytes: z.number().int().nullable().optional(),
  durationSeconds: z.number().nullable().optional(),
  estimatedCost: z.number().nullable().optional(),
  storagePath: z.string().nullable().optional(),
  scriptId: z.string().uuid().nullable().optional(),
  generationMs: z.number().int().nullable().optional(),
});

export type VoiceoverGenerateInput = z.infer<typeof VoiceoverGenerateSchema>;
export type VoiceoverSaveInput = z.infer<typeof VoiceoverSaveSchema>;
