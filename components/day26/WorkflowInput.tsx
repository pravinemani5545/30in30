"use client";

interface WorkflowInputProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  executing: boolean;
  disabled?: boolean;
}

export function WorkflowInput({
  value,
  onChange,
  onExecute,
  executing,
  disabled,
}: WorkflowInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.metaKey && !executing && !disabled) {
      onExecute();
    }
  }

  const isDisabled = executing || disabled || value.trim().length < 5;

  return (
    <div className="space-y-3">
      <label
        className="block"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        INPUT PROMPT
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter the initial prompt for Agent 1..."
        maxLength={2000}
        rows={3}
        disabled={executing}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "#060606",
          border: "1px solid #2a2a2a",
          color: "#eeeeee",
          fontFamily: "var(--font-day26-body)",
          fontSize: "15px",
          lineHeight: 1.6,
          outline: "none",
          borderRadius: 0,
          resize: "vertical",
          height: "100px",
        }}
        className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
      />

      <div
        className="flex justify-between"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "11px",
          color: "#555",
        }}
      >
        <span>{value.length} / 2000</span>
        <span>&#8984;+enter to execute</span>
      </div>

      <button
        onClick={onExecute}
        disabled={isDisabled}
        className="w-full py-3 px-4 transition-all"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: isDisabled ? "#555" : "#0a0a0a",
          background: isDisabled ? "#1a1a1a" : "#00FF41",
          border: `1px solid ${isDisabled ? "#2a2a2a" : "#00FF41"}`,
          borderRadius: 0,
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        {executing ? "EXECUTING PIPELINE..." : "EXECUTE WORKFLOW"}
      </button>
    </div>
  );
}
