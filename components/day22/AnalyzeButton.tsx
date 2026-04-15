"use client";

interface AnalyzeButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function AnalyzeButton({ loading, disabled, onClick }: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full transition-all duration-250"
      style={{
        fontFamily: "var(--font-day22-mono)",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        padding: "16px 32px",
        background: disabled || loading ? "#2a2a2a" : "#00FF41",
        color: disabled || loading ? "#555" : "#000000",
        border: "none",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        borderRadius: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = "#33ff66";
          e.currentTarget.style.boxShadow =
            "0 0 30px rgba(0,255,65,0.3)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = "#00FF41";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {loading ? "[ ANALYZING... ]" : "[ ANALYZE SCRIPT -> ]"}
    </button>
  );
}
