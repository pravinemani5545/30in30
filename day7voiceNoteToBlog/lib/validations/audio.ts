import { z } from 'zod'

export const ACCEPTED_AUDIO_TYPES = ['audio/webm', 'audio/mp4']
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25MB

export const transcribeRequestSchema = z.object({
  audio: z.instanceof(File).refine(
    (file) => ACCEPTED_AUDIO_TYPES.includes(file.type),
    { error: 'Audio must be webm or mp4 format' }
  ).refine(
    (file) => file.size <= MAX_AUDIO_SIZE,
    { error: 'Recording exceeds 25MB limit. Please keep recordings under approximately 25 minutes.' }
  ),
})
