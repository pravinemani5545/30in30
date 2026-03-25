'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadInputProps {
  onFileSelect: (file: File) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadInput({ onFileSelect }: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['audio/webm', 'audio/mp4'].includes(file.type)) {
      toast.error('Please upload a .webm or .mp4 audio file')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File exceeds 25MB limit')
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
      >
        <Upload className="h-4 w-4" />
        or upload an audio file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/webm,audio/mp4"
        onChange={handleChange}
        className="hidden"
      />
      {selectedFile && (
        <p className="text-xs text-[var(--text-secondary)]">
          {selectedFile.name} · {formatBytes(selectedFile.size)}
        </p>
      )}
    </div>
  )
}
