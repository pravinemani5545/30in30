'use client'

import { useState, useEffect, useRef } from 'react'
import { VoiceRecorder } from '@/components/day7/VoiceRecorder'
import { BlogPostRenderer } from '@/components/day7/BlogPostRenderer'
import { PostActions } from '@/components/day7/PostActions'
import { GmailDraftButton } from '@/components/day7/GmailDraftButton'
import { HistorySidebar } from '@/components/day7/HistorySidebar'
import { EmptyState } from '@/components/day7/EmptyState'
import { ProcessingStatus } from '@/components/day7/ProcessingStatus'
import { useBlogGeneration } from '@/hooks/day7/useBlogGeneration'
import { useSavePost } from '@/hooks/day7/useSavePost'
import { useHistory } from '@/hooks/day7/useHistory'
import { assembleFullText } from '@/lib/day7/parser/blogPost'
import { toast } from 'sonner'
import type { BlogPostSections, VoicePost } from '@/types/day7'

export default function DashboardPage() {
  const [transcript, setTranscript] = useState('')
  const [postId, setPostId] = useState<string | null>(null)
  const [durationS, setDurationS] = useState(0)
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [restoredPost, setRestoredPost] = useState<VoicePost | null>(null)

  const {
    sections,
    isStreaming,
    error: genError,
    wordCount,
    fabricationWarning,
    insufficientContent,
    generate,
    completion,
  } = useBlogGeneration()

  const { savePost, isSaving } = useSavePost()
  const { posts, isLoading: historyLoading, refresh, loadPost, deletePost } = useHistory()

  const hasSavedRef = useRef(false)

  // Save post after streaming completes
  useEffect(() => {
    if (
      !isStreaming &&
      completion &&
      !insufficientContent &&
      postId &&
      !hasSavedRef.current &&
      sections.headline
    ) {
      hasSavedRef.current = true
      const fullSections: BlogPostSections = {
        headline: sections.headline ?? null,
        intro: sections.intro ?? null,
        section1: sections.section1 ?? null,
        section2: sections.section2 ?? null,
        section3: sections.section3 ?? null,
        conclusion: sections.conclusion ?? null,
        pullquote1: sections.pullquote1 ?? null,
        pullquote2: sections.pullquote2 ?? null,
        pullquote3: sections.pullquote3 ?? null,
      }
      void savePost(postId, fullSections).then((ok) => {
        if (ok) {
          toast.success('Post saved')
          void refresh()
        }
      })
    }
  }, [isStreaming, completion, insufficientContent, postId, sections, savePost, refresh])

  useEffect(() => {
    if (genError) {
      toast.error(genError)
    }
  }, [genError])

  function handleTranscribeComplete(id: string, text: string, dur: number) {
    setPostId(id)
    setTranscript(text)
    setDurationS(dur)
    setRestoredPost(null)
    setSelectedHistoryId(null)
    hasSavedRef.current = false
  }

  async function handleGenerate() {
    if (!postId || transcript.length < 50) return
    hasSavedRef.current = false
    await generate(transcript, postId, durationS)
  }

  async function handleHistorySelect(id: string) {
    setSelectedHistoryId(id)
    const post = await loadPost(id)
    if (post) {
      setRestoredPost(post)
      setTranscript('')
      setPostId(null)
    }
  }

  async function handleHistoryDelete(id: string) {
    const ok = await deletePost(id)
    if (ok) {
      toast.success('Post deleted')
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null)
        setRestoredPost(null)
      }
    }
  }

  function handleNewPost() {
    setTranscript('')
    setPostId(null)
    setRestoredPost(null)
    setSelectedHistoryId(null)
    hasSavedRef.current = false
  }

  // Determine what to show in the right panel
  const showRestoredPost = restoredPost && restoredPost.status === 'complete'
  const showStreamingPost = completion.length > 0
  const hasPost = showRestoredPost || (!isStreaming && showStreamingPost && !insufficientContent)

  const displayFullText = showRestoredPost
    ? restoredPost.post_full_text ?? ''
    : assembleFullText({
        headline: sections.headline ?? null,
        intro: sections.intro ?? null,
        section1: sections.section1 ?? null,
        section2: sections.section2 ?? null,
        section3: sections.section3 ?? null,
        conclusion: sections.conclusion ?? null,
        pullquote1: sections.pullquote1 ?? null,
        pullquote2: sections.pullquote2 ?? null,
        pullquote3: sections.pullquote3 ?? null,
      })

  const displayHeadline = showRestoredPost
    ? restoredPost.post_headline ?? 'Untitled'
    : sections.headline ?? 'Untitled'

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* History sidebar - desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] overflow-y-auto lg:block">
        <div className="p-2 border-b border-[var(--border)]">
          <button
            onClick={handleNewPost}
            className="w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)] transition-colors"
          >
            + New Post
          </button>
        </div>
        <HistorySidebar
          posts={posts}
          isLoading={historyLoading}
          onSelect={handleHistorySelect}
          onDelete={handleHistoryDelete}
          selectedId={selectedHistoryId}
        />
      </aside>

      {/* Main content: two panels */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left panel: recorder */}
        <div className="w-full shrink-0 overflow-y-auto border-b border-[var(--border)] p-6 lg:w-2/5 lg:border-b-0 lg:border-r">
          {!showRestoredPost ? (
            <VoiceRecorder
              transcript={transcript}
              onTranscriptChange={setTranscript}
              onTranscribeComplete={handleTranscribeComplete}
              onGenerate={handleGenerate}
              isGenerating={isStreaming}
              hasPost={hasPost ?? false}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Transcript
              </p>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {restoredPost.transcript_edited || restoredPost.transcript_raw || 'No transcript available'}
              </div>
              <button
                onClick={handleNewPost}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                ← Record new post
              </button>
            </div>
          )}

          {isStreaming && (
            <div className="mt-4">
              <ProcessingStatus step="generating" wordCount={wordCount} />
            </div>
          )}
        </div>

        {/* Right panel: blog post output */}
        <div className="flex-1 overflow-y-auto p-6">
          {showRestoredPost ? (
            <div className="mx-auto max-w-2xl space-y-4">
              <BlogPostRenderer
                sections={{
                  headline: restoredPost.post_headline,
                  intro: restoredPost.post_intro,
                  section1: restoredPost.post_section_1,
                  section2: restoredPost.post_section_2,
                  section3: restoredPost.post_section_3,
                  conclusion: restoredPost.post_conclusion,
                  pullquote1: restoredPost.post_pullquote_1,
                  pullquote2: restoredPost.post_pullquote_2,
                  pullquote3: restoredPost.post_pullquote_3,
                }}
                isStreaming={false}
                completion={restoredPost.post_full_text ?? ''}
                fabricationWarning={false}
                insufficientContent={false}
              />
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                <PostActions fullText={displayFullText} headline={displayHeadline} />
                <GmailDraftButton headline={displayHeadline} fullText={displayFullText} />
              </div>
            </div>
          ) : showStreamingPost ? (
            <div className="mx-auto max-w-2xl space-y-4">
              <BlogPostRenderer
                sections={sections}
                isStreaming={isStreaming}
                completion={completion}
                fabricationWarning={fabricationWarning}
                insufficientContent={insufficientContent}
              />
              {!isStreaming && !insufficientContent && sections.headline && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                  <PostActions fullText={displayFullText} headline={displayHeadline} />
                  <GmailDraftButton headline={displayHeadline} fullText={displayFullText} />
                </div>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
