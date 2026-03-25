"use client";

import { useState } from "react";
import { History, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import type { GenerationListItem, GenerateResponse } from "@/types/day3";
import { HistoryItem } from "./HistoryItem";
import { useGenerations } from "@/hooks/day3/useGenerations";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HistorySidebarProps {
  activeGenerationId: string | null;
  onSelectGeneration: (id: string) => void;
}

export function HistorySidebar({ activeGenerationId, onSelectGeneration }: HistorySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { generations, isLoading, removeGeneration } = useGenerations();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className="flex flex-col border-r h-full transition-all duration-300"
      style={{
        width: collapsed ? "48px" : "240px",
        background: "var(--surface)",
        borderColor: "var(--border)",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: "var(--border)" }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <History size={14} style={{ color: "var(--text-secondary)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              History
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1 rounded transition-colors ml-auto"
          style={{ color: "var(--text-tertiary)" }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg animate-pulse"
                  style={{ background: "var(--surface-raised)" }}
                />
              ))}
            </div>
          ) : generations.length === 0 ? (
            <p className="text-xs p-2" style={{ color: "var(--text-tertiary)" }}>
              No generations yet
            </p>
          ) : (
            generations.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                isActive={item.id === activeGenerationId}
                onClick={() => onSelectGeneration(item.id)}
                onDelete={async () => {
                  await removeGeneration(item.id);
                  toast.success("Deleted");
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Sign out */}
      {!collapsed && (
        <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
