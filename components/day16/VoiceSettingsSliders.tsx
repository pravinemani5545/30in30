"use client";

import { Slider } from "@/components/ui/slider";

interface VoiceSettingsSlidersProps {
  speed: number;
  stability: number;
  onSpeedChange: (speed: number) => void;
  onStabilityChange: (stability: number) => void;
}

export function VoiceSettingsSliders({
  speed,
  stability,
  onSpeedChange,
  onStabilityChange,
}: VoiceSettingsSlidersProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            Speed
          </span>
          <span className="font-mono text-xs font-bold text-[var(--foreground)]">
            {speed.toFixed(2)}×
          </span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={(v) => onSpeedChange(Array.isArray(v) ? v[0] : v)}
          min={0.7}
          max={1.3}
          step={0.05}
          className="w-full"
        />
        <p className="text-[11px] text-[var(--text-tertiary)]">
          How fast the voice reads the text.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            Stability
          </span>
          <span className="font-mono text-xs font-bold text-[var(--foreground)]">
            {stability.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[stability]}
          onValueChange={(v) => onStabilityChange(Array.isArray(v) ? v[0] : v)}
          min={0}
          max={1}
          step={0.05}
          className="w-full"
        />
        <p className="text-[11px] text-[var(--text-tertiary)]">
          Higher = more consistent. Lower = more expressive.
        </p>
      </div>
    </div>
  );
}
