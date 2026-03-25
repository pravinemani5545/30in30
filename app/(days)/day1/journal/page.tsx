"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useJournalEntry } from "@/hooks/day1/useJournalEntry";
import { MicButton } from "@/components/day1/MicButton";
import { TranscriptDisplay } from "@/components/day1/TranscriptDisplay";
import { BrowserWarning } from "@/components/day1/BrowserWarning";
import { EntryResult } from "@/components/day1/EntryResult";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const PRIVACY_KEY = "speech_privacy_ack";

export default function JournalPage() {
  const {
    state,
    transcript,
    interimTranscript,
    result,
    error,
    speechError,
    isSupported,
    startRecording,
    stopRecording,
    reset,
  } = useJournalEntry();

  const [privacyAcked, setPrivacyAcked] = useState(true);

  useEffect(() => {
    const acked = localStorage.getItem(PRIVACY_KEY);
    if (!acked) setPrivacyAcked(false);
  }, []);

  function ackPrivacy() {
    localStorage.setItem(PRIVACY_KEY, "1");
    setPrivacyAcked(true);
  }

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (speechError === "not-allowed") {
      toast.error("Microphone access denied — allow it in browser/System Settings → Privacy → Microphone.");
    } else if (speechError === "network") {
      toast.error("Speech service network error — check your connection.");
    } else if (speechError === "audio-capture") {
      toast.error("No microphone found — connect one and try again.");
    } else if (speechError === "no-speech") {
      toast.error("No speech detected — make sure your microphone is selected and unmuted.");
    } else if (speechError === "unknown") {
      toast.error("Speech recognition error — try reloading the page.");
    }
  }, [speechError]);

  useEffect(() => {
    if (state === "result") {
      toast.success("Entry saved to your journal.");
    }
  }, [state]);

  async function handleFallbackSubmit(text: string) {
    // Manually trigger analysis for non-speech browsers
    if (!text.trim()) return;
    try {
      const response = await fetch("/api/day1/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        toast.error(data.error ?? "Analysis failed");
        return;
      }
      const data = (await response.json()) as { id: string | null };
      if (data.id) {
        toast.success("Entry saved to your journal.");
      } else {
        toast.warning("Entry analyzed but couldn't be saved — please try again.");
      }
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  const micState =
    state === "recording" ? "recording" : state === "processing" ? "processing" : "idle";

  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 py-8 md:py-12 px-4 min-h-full">
      {/* Privacy notice */}
      {!privacyAcked && (
        <div className="w-full max-w-xl rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between gap-4">
          <p>
            Your voice is processed by your browser&apos;s speech service.{" "}
            <strong className="text-foreground">Only the text transcript</strong> is sent to our server.
          </p>
          <Button size="sm" variant="outline" onClick={ackPrivacy} className="shrink-0 text-xs">
            Got it
          </Button>
        </div>
      )}

      {/* Heading */}
      {state === "idle" && (
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Today&apos;s Entry</h1>
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Recording / processing UI */}
      {state !== "result" && (
        <>
          {!isSupported ? (
            <BrowserWarning
              onFallbackSubmit={handleFallbackSubmit}
              isProcessing={state === "processing"}
            />
          ) : (
            <>
              <MicButton
                state={micState}
                onStart={startRecording}
                onStop={stopRecording}
              />

              {(state === "recording" || state === "idle") && transcript.trim() && (
                <TranscriptDisplay
                  transcript={transcript}
                  interimTranscript={interimTranscript}
                  isListening={state === "recording"}
                />
              )}

              {state === "recording" && !transcript && !interimTranscript && (
                <TranscriptDisplay
                  transcript=""
                  interimTranscript={interimTranscript}
                  isListening={true}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Result view */}
      {state === "result" && result && (
        <div className="w-full max-w-2xl space-y-6">
          <EntryResult entry={result} />
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={reset}
              className="gap-2 text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4" />
              New entry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
