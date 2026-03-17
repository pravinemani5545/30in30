"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, List } from "lucide-react";

const NAV_ITEMS = [
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/entries", label: "Entries", icon: List },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-stretch h-16 safe-area-pb">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <Icon className={["w-5 h-5", active ? "stroke-[2.5]" : ""].join(" ")} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
