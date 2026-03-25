import { BackToHub } from "@/components/shared/BackToHub";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col" data-day="8">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <BackToHub label="Back to 30 in 30" />
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
