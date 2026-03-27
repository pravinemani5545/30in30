import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { createSupabaseServer } from '@/lib/supabase/server'
import { BLOG_SYSTEM_PROMPT, buildBlogPrompt } from '@/lib/day7/claude/prompts'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { transcript, postId, durationSeconds } = body

    if (!transcript || transcript.length < 50) {
      return new Response('Transcript must be at least 50 characters', { status: 400 })
    }

    if (!postId) {
      return new Response('postId is required', { status: 400 })
    }

    // Verify ownership
    const { data: post } = await supabase
      .from('voice_posts')
      .select('id, user_id')
      .eq('id', postId)
      .single()

    if (!post || post.user_id !== user.id) {
      return new Response('Not found', { status: 404 })
    }

    // Update status to generating
    await supabase
      .from('voice_posts')
      .update({ status: 'generating', transcript_edited: transcript })
      .eq('id', postId)

    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      system: BLOG_SYSTEM_PROMPT,
      prompt: buildBlogPrompt(transcript, durationSeconds ?? 180),
      maxOutputTokens: 2500,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Generation error:', error)
    return new Response('Generation failed', { status: 500 })
  }
}
