'use client'

import { Copy, Download, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { toast } from 'sonner'

interface PostActionsProps {
  fullText: string
  headline: string
}

export function PostActions({ fullText, headline }: PostActionsProps) {
  const { copied, copy } = useCopyToClipboard()

  function handleCopy() {
    void copy(fullText)
    toast.success('Post copied to clipboard')
  }

  function handleDownload() {
    const blob = new Blob([fullText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${headline.slice(0, 50).replace(/[^a-zA-Z0-9 ]/g, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Post downloaded')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
      >
        {copied ? (
          <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--success)]" />
        ) : (
          <Copy className="mr-1.5 h-3.5 w-3.5" />
        )}
        {copied ? 'Copied' : 'Copy post'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
      >
        <Download className="mr-1.5 h-3.5 w-3.5" />
        Download .txt
      </Button>
    </div>
  )
}
