"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

/**
 * Dynamically load ConciergeChat only when the FAB is clicked.
 * This keeps the chat UI out of the initial JS bundle (efficiency / <10MB).
 */
const ConciergeChat = dynamic(
  () => import("@/components/concierge/ConciergeChat"),
  { ssr: false, loading: () => null }
);

/**
 * Floating Action Button (FAB) that toggles the concierge chat panel.
 * Placed in the app layout so it's available on every page.
 */
export function ConciergeWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* The chat panel — only loaded when `open` is true */}
      {open && <ConciergeChat onClose={() => setOpen(false)} />}

      {/* FAB button — always visible above the bottom nav */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-[88px] right-4 z-[101] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg0 focus:ring-orange active:scale-95 ${
          open
            ? "bg-bg2 text-fg1 rotate-45"
            : "bg-orange text-bg0"
        }`}
        aria-label={open ? "Close Concierge" : "Open Concierge"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
