"use client";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        style={{
          fontFamily: "var(--font-day31-mono)",
          fontSize: "16px",
          color: "#555",
          marginBottom: "8px",
        }}
      >
        {">"} no products tracked yet
        <span
          style={{ animation: "cursor-blink 1s infinite" }}
          className="inline-block w-2 h-4 ml-1"
        >
          _
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-day31-body)",
          fontSize: "14px",
          color: "#555",
          marginBottom: "24px",
        }}
      >
        Add your first product to start monitoring prices.
      </div>
      <button
        onClick={onAdd}
        style={{
          fontFamily: "var(--font-day31-mono)",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          backgroundColor: "#00FF41",
          color: "#000",
          border: "none",
          padding: "16px 32px",
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#33ff66";
          e.currentTarget.style.boxShadow =
            "0 0 30px rgba(0,255,65,0.3)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#00FF41";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        [ ADD PRODUCT ]
      </button>
    </div>
  );
}
