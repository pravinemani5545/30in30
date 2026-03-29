export const DRIVERS = {
  curiosity_gap: {
    label: "Curiosity Gap",
    description: "Creates an information asymmetry the viewer must click to close",
    colour: "var(--driver-curiosity)",
  },
  pattern_interrupt: {
    label: "Pattern Interrupt",
    description: "Breaks the visual convention of the niche feed",
    colour: "var(--driver-interrupt)",
  },
  emotion_signal: {
    label: "Emotion Signal",
    description: "Leads with a recognisable human facial expression",
    colour: "var(--driver-emotion)",
  },
} as const;

export type Driver = keyof typeof DRIVERS;

export const TONES = [
  "inspiring",
  "shocking",
  "educational",
  "entertaining",
  "controversial",
  "authentic",
] as const;

export type Tone = (typeof TONES)[number];

export const TONE_DRIVER_AFFINITY: Record<Tone, Driver> = {
  inspiring: "emotion_signal",
  shocking: "pattern_interrupt",
  educational: "curiosity_gap",
  entertaining: "pattern_interrupt",
  controversial: "pattern_interrupt",
  authentic: "emotion_signal",
};
