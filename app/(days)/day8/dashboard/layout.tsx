export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col">{children}</div>
  );
}
