import { BackToHub } from "@/components/shared/BackToHub";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full" data-day="3">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <BackToHub label="Back to 30 in 30" />
      </div>
      {children}
    </div>
  );
}
