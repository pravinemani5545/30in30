import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { existsSync } from 'fs'

export async function getExecutablePath(): Promise<string> {
  if (process.env.NODE_ENV === 'development') {
    const localPaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
    ].filter(Boolean) as string[]

    for (const p of localPaths) {
      if (existsSync(p)) return p
    }
    throw new Error(
      'No local Chromium found. Set PUPPETEER_EXECUTABLE_PATH in .env.local.\n' +
      'macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome\n' +
      'Linux: /usr/bin/chromium-browser'
    )
  }
  return chromium.executablePath()
}

export async function launchBrowser() {
  const executablePath = await getExecutablePath()
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1280, height: 720 },
    executablePath,
    headless: true,
  })
}
