export function isChromeCompatible(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isChromiumBased = /Chrome|Chromium/.test(ua) && !/Firefox/.test(ua)
  const hasMediaRecorder = typeof MediaRecorder !== 'undefined'
  return isChromiumBased && hasMediaRecorder
}

export function getUnsupportedBrowserMessage(): string | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Firefox/.test(ua)) {
    return "Firefox records audio in ogg format, which Whisper doesn't support. Please use Chrome, Edge, or upload a .webm file recorded in Chrome."
  }
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    return 'Safari audio compatibility with Whisper is inconsistent. Please use Chrome or Edge for reliable recording.'
  }
  return null
}
