import { getServerEnv } from "@/lib/env";
import type {
  ElevenLabsVoiceResponse,
  ElevenLabsGenerateRequest,
} from "./types";

const BASE_URL = "https://api.elevenlabs.io/v1";

function getHeaders(): Record<string, string> {
  const env = getServerEnv();
  return {
    "xi-api-key": env.ELEVENLABS_API_KEY!,
    "Content-Type": "application/json",
  };
}

export async function fetchVoices(): Promise<
  ElevenLabsVoiceResponse["voices"]
> {
  const response = await fetch(`${BASE_URL}/voices`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs voices request failed: ${response.status}`);
  }

  const data: ElevenLabsVoiceResponse = await response.json();
  return data.voices;
}

export async function streamVoiceover(
  text: string,
  voiceId: string,
  stability: number,
): Promise<Response> {
  const body: ElevenLabsGenerateRequest = {
    text,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability,
      similarity_boost: 0.75,
      style: 0,
      use_speaker_boost: true,
    },
  };

  const response = await fetch(
    `${BASE_URL}/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `ElevenLabs generation failed (${response.status}): ${errorText}`,
    );
  }

  return response;
}
