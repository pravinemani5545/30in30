import type { ReactNode } from "react";
import { BackToHub } from "@/components/shared/BackToHub";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "var(--background)" }}
      data-day="2"
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <BackToHub label="Back to 30 in 30" />
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    </div>
  );
}
