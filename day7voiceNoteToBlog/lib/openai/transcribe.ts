import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openai
}

export async function transcribeAudio(
  audioFile: File
): Promise<{ text: string; duration: number | undefined }> {
  const client = getOpenAI()

  const transcription = await client.audio.transcriptions.create({
    file: audioFile,
    model: 'gpt-4o-mini-transcribe',
    response_format: 'verbose_json',
    language: 'en',
  })

  return {
    text: transcription.text,
    duration: transcription.duration,
  }
}
