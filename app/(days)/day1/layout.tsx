import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Sidebar } from "@/components/day1/Sidebar";
import { Header } from "@/components/day1/Header";
import { BottomNav } from "@/components/day1/BottomNav";

export default async function Day1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/day1/journal");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userEmail={user.email} />
        {/* pb-16 on mobile reserves space above the bottom nav */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
