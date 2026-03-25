export function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "12px",
          background: "var(--accent-subtle)",
          border: "1px solid rgba(232, 160, 32, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          fontSize: "24px",
        }}
      >
        ◆
      </div>

      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "22px",
          fontWeight: 400,
          color: "var(--foreground)",
          margin: "0 0 8px",
        }}
      >
        Your pipeline starts here
      </h2>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          lineHeight: "1.6",
          maxWidth: "320px",
          margin: 0,
        }}
      >
        Paste a LinkedIn URL above to enrich your first contact. Apollo finds
        them. Claude thinks about them. You close them.
      </p>
    </div>
  );
}
