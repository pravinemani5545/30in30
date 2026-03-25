"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, List } from "lucide-react";

const NAV_ITEMS = [
  { href: "/day1/journal", label: "Journal", icon: BookOpen },
  { href: "/day1/entries", label: "Entries", icon: List },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-card/50 min-h-screen px-3 py-6 gap-1">
      {/* Brand */}
      <div className="px-3 mb-6">
        <span className="font-serif text-xl text-foreground">ClaudeJournal</span>
      </div>

      {/* Nav */}
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            ].join(" ")}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
