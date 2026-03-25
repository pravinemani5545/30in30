'use client'

import { useState, useCallback } from 'react'
import type { BlogPostSections } from '@/types/day7'
import { assembleFullText, countWords } from '@/lib/day7/parser/blogPost'

interface UseSavePostReturn {
  savePost: (postId: string, sections: BlogPostSections, generationMs?: number) => Promise<boolean>
  isSaving: boolean
  error: string | null
}

export function useSavePost(): UseSavePostReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const savePost = useCallback(
    async (postId: string, sections: BlogPostSections, generationMs?: number): Promise<boolean> => {
      setIsSaving(true)
      setError(null)

      try {
        const fullText = assembleFullText(sections)
        const wordCount = countWords(fullText)

        const response = await fetch('/api/day7/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            sections,
            fullText,
            wordCount,
            generationMs,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to save post')
        }

        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save post'
        setError(message)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    []
  )

  return { savePost, isSaving, error }
}
