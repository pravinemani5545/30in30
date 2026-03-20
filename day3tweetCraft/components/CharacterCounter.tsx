export function CharacterCounter({ count }: { count: number }) {
  const color =
    count <= 220
      ? "var(--success)"
      : count <= 260
      ? "var(--accent)"
      : "var(--error)";

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {count}/280
    </span>
  );
}
