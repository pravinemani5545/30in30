'use client'

import { useState, useEffect, useCallback } from 'react'
import type { VoicePostSummary, VoicePost } from '@/types/day7'

interface UseHistoryReturn {
  posts: VoicePostSummary[]
  isLoading: boolean
  refresh: () => Promise<void>
  loadPost: (id: string) => Promise<VoicePost | null>
  deletePost: (id: string) => Promise<boolean>
}

export function useHistory(): UseHistoryReturn {
  const [posts, setPosts] = useState<VoicePostSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/day7/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts ?? [])
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const loadPost = useCallback(async (id: string): Promise<VoicePost | null> => {
    try {
      const res = await fetch(`/api/day7/posts/${id}`)
      if (res.ok) {
        const data = await res.json()
        return data.post
      }
      return null
    } catch {
      return null
    }
  }, [])

  const deletePost = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/day7/posts/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setPosts((prev) => prev.filter((p) => p.id !== id))
          return true
        }
        return false
      } catch {
        return false
      }
    },
    []
  )

  return { posts, isLoading, refresh, loadPost, deletePost }
}
