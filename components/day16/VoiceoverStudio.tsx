"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CharacterCountBar } from "./CharacterCountBar";
import { CostEstimate } from "./CostEstimate";
import { VoiceSettingsSliders } from "./VoiceSettingsSliders";
import { ScriptBanner } from "./ScriptBanner";
import { GenerateButton } from "./GenerateButton";
import { AudioPlayer } from "./AudioPlayer";
import { VoiceLibrary } from "./VoiceLibrary";
import { VoiceoverHistory } from "./VoiceoverHistory";
import { useVoiceoverGeneration } from "@/hooks/day16/useVoiceoverGeneration";
import { useAudioPlayer } from "@/hooks/day16/useAudioPlayer";
import { useVoiceLibrary } from "@/hooks/day16/useVoiceLibrary";
import { useScriptPrefill } from "@/hooks/day16/useScriptPrefill";
import { useSaveVoiceover } from "@/hooks/day16/useSaveVoiceover";
import { useVoiceovers } from "@/hooks/day16/useVoiceovers";
import { estimateCost, MAX_CHARACTERS } from "@/lib/day16/voiceover/cost";

export function VoiceoverStudio() {
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [stability, setStability] = useState(0.75);

  // Core hooks
  const generation = useVoiceoverGeneration();
  const player = useAudioPlayer(generation.audioRef);
  const voiceLib = useVoiceLibrary();
  const scriptPrefill = useScriptPrefill();
  const saveHook = useSaveVoiceover();
  const history = useVoiceovers();

  // Apply speed via playbackRate (client-side — ElevenLabs v1 has no speed param)
  useEffect(() => {
    player.setPlaybackRate(speed);
  }, [speed, player]);

  // Pre-fill from ScriptEngine
  useEffect(() => {
    if (scriptPrefill.prefillText && text === "") {
      setText(scriptPrefill.prefillText);
    }
  }, [scriptPrefill.prefillText, text]);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Enter some text first.");
      return;
    }
    if (!voiceLib.selectedVoice) {
      toast.error("Select a voice first.");
      return;
    }
    if (text.length > MAX_CHARACTERS) {
      toast.error(`Text exceeds ${MAX_CHARACTERS} character limit.`);
      return;
    }

    await generation.generate(text, voiceLib.selectedVoice.voice_id, {
      stability,
      speed,
    });
  }, [text, voiceLib.selectedVoice, stability, speed, generation]);

  const handleDownload = useCallback(() => {
    if (!generation.blob) return;
    const url = URL.createObjectURL(generation.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voiceover-${Date.now()}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generation.blob]);

  const handleSave = useCallback(async () => {
    if (!generation.blob || !voiceLib.selectedVoice) return;

    const { rawCost } = estimateCost(text.length);

    const result = await saveHook.save({
      blob: generation.blob,
      textContent: text,
      voiceId: voiceLib.selectedVoice.voice_id,
      voiceName: voiceLib.selectedVoice.name,
      speed,
      stability,
      durationSeconds: player.duration > 0 ? player.duration : null,
      estimatedCost: rawCost,
      scriptId: scriptPrefill.scriptId,
      generationMs: generation.generationMs,
    });

    if (result) {
      toast.success("Voiceover saved to library.");
      history.refresh();
    } else if (saveHook.error) {
      toast.error(saveHook.error);
    }
  }, [
    generation.blob,
    generation.generationMs,
    voiceLib.selectedVoice,
    text,
    speed,
    stability,
    player.duration,
    scriptPrefill.scriptId,
    saveHook,
    history,
  ]);

  const charCount = text.length;
  const isGenerating =
    generation.state === "generating" || generation.state === "buffering";

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col gap-6 lg:flex-row">
      {/* Left Panel — Input + Settings */}
      <div className="w-full shrink-0 space-y-5 lg:w-[380px]">
        {/* Script banner */}
        {scriptPrefill.isFromScript && scriptPrefill.scriptTitle && (
          <ScriptBanner
            scriptTitle={scriptPrefill.scriptTitle}
            onDismiss={scriptPrefill.clearScript}
          />
        )}

        {/* Text input */}
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to voice over..."
            className="min-h-[200px] resize-y border-[var(--border)] bg-[var(--surface)] text-sm leading-relaxed"
            maxLength={MAX_CHARACTERS}
          />
          <div className="flex items-center justify-between">
            <CharacterCountBar count={charCount} />
          </div>
          <CostEstimate charCount={charCount} />
        </div>

        {/* Selected voice badge */}
        {voiceLib.selectedVoice && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Voice
            </span>
            <Badge
              variant="outline"
              className="border-[var(--accent)] text-[var(--accent)]"
            >
              {voiceLib.selectedVoice.name}
            </Badge>
          </div>
        )}

        {/* Voice settings */}
        <VoiceSettingsSliders
          speed={speed}
          stability={stability}
          onSpeedChange={setSpeed}
          onStabilityChange={setStability}
        />

        {/* Generate button */}
        <GenerateButton
          state={generation.state}
          onClick={handleGenerate}
          disabled={
            !text.trim() || !voiceLib.selectedVoice || isGenerating
          }
        />

        {/* Error message */}
        {generation.errorMessage && (
          <p className="text-xs text-[var(--error)]">
            {generation.errorMessage}
          </p>
        )}
      </div>

      {/* Right Panel — Audio Player + Voice Library + History */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Hidden audio element */}
        <audio ref={generation.audioRef} preload="none" />

        {/* Audio Player */}
        <AudioPlayer
          state={generation.state}
          currentTime={player.currentTime}
          duration={player.duration}
          isPlaying={player.isPlaying}
          volume={player.volume}
          bytesReceived={generation.bytesReceived}
          onPlay={player.play}
          onPause={player.pause}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onDownload={handleDownload}
          onSave={handleSave}
          isSaving={saveHook.isSaving}
          hasSaved={saveHook.savedVoiceover !== null}
        />

        {/* Voice Library */}
        <VoiceLibrary
          voices={voiceLib.voices}
          filteredVoices={voiceLib.filteredVoices}
          isLoading={voiceLib.isLoading}
          error={voiceLib.error}
          searchQuery={voiceLib.searchQuery}
          onSearchChange={voiceLib.setSearchQuery}
          selectedVoice={voiceLib.selectedVoice}
          onSelectVoice={voiceLib.selectVoice}
          onLoadVoices={voiceLib.loadVoices}
        />

        {/* History */}
        <VoiceoverHistory
          voiceovers={history.voiceovers}
          isLoading={history.isLoading}
        />
      </div>
    </div>
  );
}
