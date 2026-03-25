export type RecordingState =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'stopping'
  | 'stopped'

export type ProcessingStep =
  | 'transcribing'
  | 'editing'
  | 'generating'
  | 'complete'
  | 'error'

export interface BlogPostSections {
  headline: string | null
  intro: string | null
  section1: string | null
  section2: string | null
  section3: string | null
  conclusion: string | null
  pullquote1: string | null
  pullquote2: string | null
  pullquote3: string | null
}

export interface VoicePost {
  id: string
  user_id: string
  audio_storage_path: string | null
  audio_duration_s: number | null
  audio_size_bytes: number | null
  transcript_raw: string | null
  transcript_edited: string | null
  transcript_word_count: number | null
  post_headline: string | null
  post_intro: string | null
  post_section_1: string | null
  post_section_2: string | null
  post_section_3: string | null
  post_conclusion: string | null
  post_pullquote_1: string | null
  post_pullquote_2: string | null
  post_pullquote_3: string | null
  post_word_count: number | null
  post_full_text: string | null
  status: 'recording' | 'transcribing' | 'editing' | 'generating' | 'complete' | 'failed'
  generation_quality: 'good' | 'degraded' | 'failed' | null
  transcription_ms: number | null
  generation_ms: number | null
  created_at: string
  updated_at: string
}

export interface VoicePostSummary {
  id: string
  post_headline: string | null
  audio_duration_s: number | null
  post_word_count: number | null
  created_at: string
}

export interface TranscribeResponse {
  postId: string
  transcript: string
  duration_s: number
}
