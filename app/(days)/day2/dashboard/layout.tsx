import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/day2/dashboard");
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "var(--background)" }}>
      {children}
    </div>
  );
}
