"use client";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function TranscriptDisplay({
  transcript,
  interimTranscript,
  isListening,
}: TranscriptDisplayProps) {
  const isEmpty = !transcript && !interimTranscript;

  return (
    <div className="w-full max-w-xl mx-auto min-h-32 rounded-lg bg-muted/30 border border-border p-4 overflow-y-auto max-h-56">
      {isEmpty ? (
        <p className="text-muted-foreground/60 italic text-sm text-center mt-6">
          &ldquo;What happened today?&rdquo;
        </p>
      ) : (
        <p className="text-sm leading-relaxed">
          {transcript && (
            <span className="text-foreground">{transcript} </span>
          )}
          {isListening && interimTranscript && (
            <span className="text-muted-foreground/70 italic">{interimTranscript}</span>
          )}
        </p>
      )}
    </div>
  );
}
