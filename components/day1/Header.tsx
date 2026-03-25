"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  userEmail?: string;
}

export function Header({ userEmail }: HeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed");
    } else {
      router.push("/login");
    }
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "JE";

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4">
      {/* Brand — visible only on mobile (sidebar handles desktop) */}
      <span className="md:hidden font-serif text-lg text-foreground">ClaudeJournal</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {userEmail && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate border-b border-border mb-1">
              {userEmail}
            </div>
          )}
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-sm cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
