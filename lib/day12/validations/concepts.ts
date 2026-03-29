import { z } from "zod";

export const ConceptInputSchema = z.object({
  videoTitle: z
    .string()
    .min(5, { message: "Add a bit more detail to the title." })
    .max(200, {
      message:
        "Title is too long — YouTube titles max out at 100 characters.",
    })
    .trim(),
  niche: z
    .string()
    .min(2, { message: "Enter your niche (e.g. Personal Finance, Gaming)." })
    .max(100)
    .trim(),
  tone: z.enum(
    [
      "inspiring",
      "shocking",
      "educational",
      "entertaining",
      "controversial",
      "authentic",
    ],
    { message: "Please select a tone." },
  ),
});

export type ConceptInput = z.infer<typeof ConceptInputSchema>;

export const ColourSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  role: z.string(),
});

export const ConceptSchema = z.object({
  driver: z.enum(["curiosity_gap", "pattern_interrupt", "emotion_signal"]),
  conceptName: z.string().min(1),
  isPredictedWinner: z.boolean(),
  textOverlay: z.array(z.string()).min(1).max(4),
  colourPalette: z.array(ColourSchema).min(3).max(4),
  paletteRationale: z.string().min(1),
  compositionSteps: z.array(z.string()).min(4).max(7),
  abNote: z.string().min(1),
});

export const ThumbnailOutputSchema = z.object({
  predictedWinner: z.enum([
    "curiosity_gap",
    "pattern_interrupt",
    "emotion_signal",
  ]),
  abHypothesis: z.string().min(1),
  concepts: z.array(ConceptSchema).length(3),
});

export type ThumbnailOutput = z.infer<typeof ThumbnailOutputSchema>;
