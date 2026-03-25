import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transcribeAudio } from '@/lib/openai/transcribe'
import { ACCEPTED_AUDIO_TYPES, MAX_AUDIO_SIZE } from '@/lib/validations/audio'

export const maxDuration = 60

const DAILY_LIMIT = 5

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 5 posts/day/user
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('voice_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())

    if (count !== null && count >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `You've reached your daily limit of ${DAILY_LIMIT} posts. Try again tomorrow.` },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    if (!ACCEPTED_AUDIO_TYPES.includes(audioFile.type)) {
      return NextResponse.json(
        { error: 'Audio must be webm or mp4 format' },
        { status: 400 }
      )
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: 'Recording exceeds 25MB limit. Please keep recordings under approximately 25 minutes.' },
        { status: 413 }
      )
    }

    // Create initial record
    const { data: post, error: insertError } = await supabase
      .from('voice_posts')
      .insert({
        user_id: user.id,
        status: 'transcribing',
        audio_size_bytes: audioFile.size,
      })
      .select('id')
      .single()

    if (insertError || !post) {
      console.error('Failed to create voice_post:', insertError)
      return NextResponse.json({ error: 'Failed to create post record' }, { status: 500 })
    }

    const startMs = Date.now()
    const { text, duration } = await transcribeAudio(audioFile)
    const transcriptionMs = Date.now() - startMs

    const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length

    // Update record with transcript
    await supabase
      .from('voice_posts')
      .update({
        transcript_raw: text,
        transcript_edited: text,
        transcript_word_count: wordCount,
        audio_duration_s: duration ? Math.round(duration) : null,
        transcription_ms: transcriptionMs,
        status: 'editing',
      })
      .eq('id', post.id)

    // Fire-and-forget: upload audio to Supabase Storage
    const arrayBuffer = await audioFile.arrayBuffer()
    const filePath = `${user.id}/${post.id}/audio.webm`
    void supabase.storage
      .from('voice-audio')
      .upload(filePath, arrayBuffer, {
        contentType: audioFile.type,
        upsert: false,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Audio storage upload failed:', error)
        } else {
          // Update the storage path
          void supabase
            .from('voice_posts')
            .update({ audio_storage_path: filePath })
            .eq('id', post.id)
        }
      })

    return NextResponse.json({
      postId: post.id,
      transcript: text,
      duration_s: duration ? Math.round(duration) : 0,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    const message = error instanceof Error ? error.message : 'Transcription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
