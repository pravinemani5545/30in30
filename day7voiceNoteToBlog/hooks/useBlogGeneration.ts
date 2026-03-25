'use client'

import { useCompletion } from '@ai-sdk/react'
import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import {
  parseStreamingBlogPost,
  hasInsufficientContent,
  countWords,
  assembleFullText,
} from '@/lib/parser/blogPost'
import type { BlogPostSections } from '@/types'

interface UseBlogGenerationReturn {
  sections: Partial<BlogPostSections>
  isStreaming: boolean
  error: string | null
  wordCount: number
  fabricationWarning: boolean
  insufficientContent: boolean
  generate: (transcript: string, postId: string, durationSeconds?: number) => Promise<void>
  completion: string
}

export function useBlogGeneration(): UseBlogGenerationReturn {
  const startTimeRef = useRef<number>(0)
  const [savedGenerationMs, setSavedGenerationMs] = useState<number>(0)

  const {
    completion,
    complete,
    isLoading: isStreaming,
    error: sdkError,
  } = useCompletion({
    api: '/api/generate-post',
    streamProtocol: 'text',
  })

  const sections = useMemo(
    () => parseStreamingBlogPost(completion),
    [completion]
  )

  const wordCount = useMemo(() => countWords(completion), [completion])

  const insufficientContent = useMemo(
    () => hasInsufficientContent(completion),
    [completion]
  )

  const [transcriptWordCount, setTranscriptWordCount] = useState(0)

  const fabricationWarning = useMemo(() => {
    if (transcriptWordCount === 0) return false
    return wordCount > transcriptWordCount * 2
  }, [wordCount, transcriptWordCount])

  // Track generation time
  useEffect(() => {
    if (!isStreaming && startTimeRef.current > 0) {
      setSavedGenerationMs(Date.now() - startTimeRef.current)
      startTimeRef.current = 0
    }
  }, [isStreaming])

  const generate = useCallback(
    async (transcript: string, postId: string, durationSeconds?: number) => {
      setTranscriptWordCount(countWords(transcript))
      startTimeRef.current = Date.now()
      await complete('', {
        body: { transcript, postId, durationSeconds },
      })
    },
    [complete]
  )

  const error = sdkError ? sdkError.message : null

  return {
    sections,
    isStreaming,
    error,
    wordCount,
    fabricationWarning,
    insufficientContent,
    generate,
    completion,
  }
}
