"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/venue", label: "VENUE", icon: "🗺" },
  { href: "/ticket", label: "TICKET", icon: "🎫" },
  { href: "/order", label: "ORDER", icon: "🍔" },
  { href: "/profile", label: "ME", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg0/80 backdrop-blur-md pb-safe">
      <div className="flex items-center justify-between h-20 max-w-md mx-auto px-6 gap-2">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-14 rounded-full transition-all active:scale-[0.97] ${
                isActive ? "opacity-100 bg-bg2" : "opacity-50 hover:opacity-80"
              }`}
            >
              <span className="text-xl leading-none mb-1" aria-hidden="true">{tab.icon}</span>
              <span
                className={`text-[10px] font-heading font-bold tracking-widest ${
                  isActive ? "text-orange" : "text-fg2"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
