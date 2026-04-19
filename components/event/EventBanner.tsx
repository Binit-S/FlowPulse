"use client";

import { MOCK_EVENT } from "@/lib/mock-data";

export function EventBanner() {
  return (
    <div className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      <div className="w-full shrink-0 flex flex-col items-center justify-center snap-center p-8 text-center transition-all active:scale-[0.97]">
        <div className="flex items-center gap-2 mb-4 bg-orange-dim text-orange px-4 py-1.5 rounded-pill text-[11px] font-heading font-bold tracking-widest animate-live-pulse border-none">
          <span className="text-[10px]">●</span> LIVE NOW
        </div>
        <h2 className="text-[30px] font-heading font-bold mb-3 tracking-tight">{MOCK_EVENT.name}</h2>
        <p className="text-fg1 flex items-center gap-2 text-[15px] font-body font-medium">
          {MOCK_EVENT.venue} <span className="text-fg3">•</span> <span className="text-fg0 font-bold">{MOCK_EVENT.currentPhase}</span>
        </p>
      </div>

      <div className="w-full shrink-0 flex flex-col items-center justify-center snap-center p-8 text-center opacity-40 transition-all active:scale-[0.97]">
        <div className="flex items-center gap-2 mb-4 bg-bg2 text-fg1 px-4 py-1.5 rounded-pill text-[11px] font-heading font-bold tracking-widest border-none">
          <span className="text-[10px]">●</span> NEXT UP
        </div>
        <h2 className="text-[30px] font-heading font-bold mb-3 text-fg1 tracking-tight">Coldplay — India Tour</h2>
        <p className="text-fg2 text-[15px] font-body font-medium">
          D.Y. Patil Stadium
        </p>
      </div>
    </div>
  );
}
