"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function UniquePerspectiveField({ value, onChange, error }: Props) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-sans)",
        }}
      >
        YOUR UNIQUE ANGLE
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="One sentence only. What makes your perspective impossible to copy? e.g. 'I'm building two SaaS products simultaneously while shipping one app per day and documenting every mistake publicly.'"
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
          border: error
            ? "2px solid var(--error)"
            : "2px solid var(--accent)",
          fontFamily: "var(--font-sans)",
        }}
      />
      <div className="flex items-center justify-between mt-1.5">
        <p
          className="text-xs"
          style={{
            color: error ? "var(--error)" : "var(--text-secondary)",
          }}
        >
          {error
            ? error
            : "This single field prevents generic output more than all other inputs combined."}
        </p>
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--text-tertiary)" }}
        >
          {value.length} / 300
        </span>
      </div>
    </div>
  );
}
