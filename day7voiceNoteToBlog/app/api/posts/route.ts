import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { savePostSchema } from '@/lib/validations/post'
import { z } from 'zod'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: posts, error } = await supabase
      .from('voice_posts')
      .select('id, post_headline, audio_duration_s, post_word_count, created_at')
      .eq('user_id', user.id)
      .eq('status', 'complete')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = savePostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { postId, sections, fullText, wordCount, generationMs } = parsed.data

    // Verify ownership
    const { data: post } = await supabase
      .from('voice_posts')
      .select('id, user_id')
      .eq('id', postId)
      .single()

    if (!post || post.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('voice_posts')
      .update({
        post_headline: sections.headline,
        post_intro: sections.intro,
        post_section_1: sections.section1,
        post_section_2: sections.section2,
        post_section_3: sections.section3,
        post_conclusion: sections.conclusion,
        post_pullquote_1: sections.pullquote1,
        post_pullquote_2: sections.pullquote2,
        post_pullquote_3: sections.pullquote3,
        post_full_text: fullText,
        post_word_count: wordCount,
        generation_ms: generationMs ?? null,
        generation_quality: 'good',
        status: 'complete',
      })
      .eq('id', postId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
