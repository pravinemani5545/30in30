"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TONES } from "@/lib/day12/framework/galloway";

interface ToneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TONE_LABELS: Record<string, string> = {
  inspiring: "Inspiring",
  shocking: "Shocking",
  educational: "Educational",
  entertaining: "Entertaining",
  controversial: "Controversial",
  authentic: "Authentic",
};

export function ToneSelect({ value, onChange }: ToneSelectProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-[13px] font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        Tone
      </label>
      <Select
        value={value || null}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
      >
        <SelectTrigger
          className="w-full h-10 border rounded-md px-3 text-[13px]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          {TONES.map((tone) => (
            <SelectItem key={tone} value={tone}>
              {TONE_LABELS[tone]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
