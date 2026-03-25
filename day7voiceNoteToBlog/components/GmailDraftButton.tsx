'use client'

import { useState } from 'react'
import { Mail, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface GmailDraftButtonProps {
  headline: string
  fullText: string
}

export function GmailDraftButton({ headline, fullText }: GmailDraftButtonProps) {
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  async function handleCreate() {
    setCreating(true)
    try {
      // Copy to clipboard as fallback
      await navigator.clipboard.writeText(fullText)
      toast.success('Post copied to clipboard — paste into your email client')
      setCreated(true)
    } catch {
      toast.error('Failed to copy post')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCreate}
      disabled={creating || created}
      className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
    >
      {creating ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : created ? (
        <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--success)]" />
      ) : (
        <Mail className="mr-1.5 h-3.5 w-3.5" />
      )}
      {created ? 'Copied for email' : 'Draft as newsletter'}
    </Button>
  )
}
