import type { ScriptSection } from "@/types/day14";
import { SCRIPT_MARKERS, SECTION_LABELS } from "./structure";

export function parseStreamingScript(completion: string): ScriptSection[] {
  const positions: Array<{ marker: string; index: number }> = [];

  for (const marker of SCRIPT_MARKERS) {
    const index = completion.indexOf(marker);
    if (index !== -1) {
      positions.push({ marker, index });
    }
  }

  positions.sort((a, b) => a.index - b.index);

  const sections: ScriptSection[] = [];

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    const contentStart = current.index + current.marker.length;
    const contentEnd =
      i + 1 < positions.length ? positions[i + 1].index : completion.length;
    const content = completion.slice(contentStart, contentEnd).trim();
    if (content) {
      sections.push({
        marker: current.marker,
        label: SECTION_LABELS[current.marker] ?? current.marker,
        content,
      });
    }
  }

  return sections;
}

const MARKER_PATTERN = /\[(HOOK|PROOF_POINT|SECTION:\d|RETENTION:\d|CTA)\]/g;

export function countWords(text: string): number {
  const stripped = text.replace(MARKER_PATTERN, "");
  return stripped
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function extractHookText(sections: ScriptSection[]): string | null {
  const hook = sections.find((s) => s.marker === "[HOOK]");
  return hook?.content ?? null;
}

export function assembleFullText(sections: ScriptSection[]): string {
  return sections
    .map((s) => `[${s.label.toUpperCase()}]\n${s.content}`)
    .join("\n\n");
}
