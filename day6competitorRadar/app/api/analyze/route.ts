export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { urlSchema, validateUrlServerSide } from '@/lib/validations/url'
import { scrapeUrl } from '@/lib/scraper'
import { analyzeCompetitor } from '@/lib/claude/analyzeCompetitor'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate URL
    const body = await request.json()
    const parseResult = urlSchema.safeParse(body.url)
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]
      return NextResponse.json(
        { error: issue?.message || "Invalid URL" },
        { status: 400 }
      )
    }
    const url = parseResult.data

    // Authenticate
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to analyse competitor sites.' },
        { status: 401 }
      )
    }

    // Rate limit: 10/day/user
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('competitor_analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())

    if (count !== null && count >= 10) {
      return NextResponse.json(
        { error: "You've analysed 10 competitors today. Come back tomorrow." },
        { status: 429 }
      )
    }

    // SSRF check
    const serverCheck = await validateUrlServerSide(url)
    if (!serverCheck.valid) {
      return NextResponse.json({ error: serverCheck.error }, { status: 422 })
    }

    // Check URL cache
    const serviceClient = createServiceClient()
    const normalizedUrl = new URL(url).toString()
    const { data: cached } = await serviceClient
      .from('url_cache')
      .select('*')
      .eq('normalized_url', normalizedUrl)
      .gt('expires_at', new Date().toISOString())
      .single()

    // Create analysis record
    const { data: analysis, error: insertError } = await supabase
      .from('competitor_analyses')
      .insert({
        user_id: user.id,
        url,
        domain: new URL(url).hostname.replace(/^www\./, ''),
        status: 'scraping',
      })
      .select('id')
      .single()

    if (insertError || !analysis) {
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    let scrapedContent
    if (cached?.cleaned_text) {
      // Use cached content
      scrapedContent = {
        url: cached.url,
        domain: cached.domain,
        faviconUrl: `https://${cached.domain}/favicon.ico`,
        ogTitle: cached.og_title,
        ogDescription: cached.og_description,
        ogImage: null,
        cleanedText: cached.cleaned_text,
        wordCount: cached.word_count || 0,
        extractionQuality: cached.extraction_quality as 'rich' | 'partial' | 'minimal',
        renderMethod: cached.render_method as 'js_rendered' | 'static_only',
      }
    } else {
      // Scrape fresh
      scrapedContent = await scrapeUrl(url)

      // Cache the result
      await serviceClient
        .from('url_cache')
        .upsert({
          url,
          normalized_url: normalizedUrl,
          domain: scrapedContent.domain,
          og_title: scrapedContent.ogTitle,
          og_description: scrapedContent.ogDescription,
          cleaned_text: scrapedContent.cleanedText,
          word_count: scrapedContent.wordCount,
          extraction_quality: scrapedContent.extractionQuality,
          render_method: scrapedContent.renderMethod,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'url' })
    }

    // Update status to analysing
    await supabase
      .from('competitor_analyses')
      .update({
        status: 'analysing',
        favicon_url: scrapedContent.faviconUrl,
        og_title: scrapedContent.ogTitle,
        extraction_quality: scrapedContent.extractionQuality,
        render_method: scrapedContent.renderMethod,
        word_count: scrapedContent.wordCount,
      })
      .eq('id', analysis.id)

    // Claude analysis
    const start = Date.now()
    let claudeResult
    try {
      claudeResult = await analyzeCompetitor(scrapedContent)
    } catch (err) {
      await supabase
        .from('competitor_analyses')
        .update({ status: 'failed', error_message: 'Analysis timed out. Please try again.' })
        .eq('id', analysis.id)
      return NextResponse.json(
        { error: 'Analysis timed out. Please try again.' },
        { status: 504 }
      )
    }
    const generationMs = Date.now() - start

    // Update with Claude results
    const { data: finalAnalysis, error: updateError } = await supabase
      .from('competitor_analyses')
      .update({
        status: 'complete',
        value_proposition: claudeResult.valueProp.statement,
        vp_confidence: claudeResult.valueProp.confidence,
        vp_evidence: claudeResult.valueProp.evidence,
        target_icp: claudeResult.targetICP.description,
        icp_confidence: claudeResult.targetICP.confidence,
        icp_signals: claudeResult.targetICP.signals,
        pricing_model: claudeResult.pricingModel.description,
        pricing_confidence: claudeResult.pricingModel.confidence,
        pricing_signals: claudeResult.pricingModel.signals,
        gtm_motion: claudeResult.gtmMotion.description,
        gtm_confidence: claudeResult.gtmMotion.confidence,
        gtm_signals: claudeResult.gtmMotion.signals,
        weaknesses: claudeResult.weaknesses,
        analysis_notes: claudeResult.analysisNotes,
        generation_ms: generationMs,
      })
      .eq('id', analysis.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(finalAnalysis)
  } catch (err) {
    console.error('[analyze] Unexpected error:', err instanceof Error ? err.message : 'Unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
