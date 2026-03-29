import { NextResponse } from 'next/server'
import { getOptionalUser } from '@/lib/auth/guest'

export async function GET() {
  const { user, supabase, isGuest } = await getOptionalUser()

  if (isGuest || !supabase) {
    return NextResponse.json([])
  }

  const { data, error } = await supabase
    .from('competitor_analyses')
    .select('id, domain, favicon_url, og_title, extraction_quality, render_method, status, weaknesses, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
  }

  return NextResponse.json(data)
}
