"use client";

import { EventBanner } from "@/components/event/EventBanner";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VenueMap } from "@/components/venue-map/VenueMap";
import { MapLegend } from "@/components/venue-map/MapLegend";
import { GateSelector } from "@/components/routing/GateSelector";
import { RouteCard } from "@/components/routing/RouteCard";
import { StallCard } from "@/components/food/StallCard";
import { OrderModal } from "@/components/food/OrderModal";
import { MOCK_TICKET, MOCK_STALLS } from "@/lib/mock-data";
import { useState } from "react";
import { FoodStall } from "@/types";

export default function VenuePage() {
  const [selectedStall, setSelectedStall] = useState<FoodStall | null>(null);

  // For the user avatar initial header
  const initials = "BS";
  const name = "Binit S.";

  return (
    <div className="w-full flex flex-col pb-6">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-6 bg-gradient-to-b from-bg0 to-transparent backdrop-blur-[2px]">
        <div>
          <h1 className="text-[26px] font-heading font-semibold tracking-tight">Good evening,</h1>
          <p className="text-fg2 font-body text-[15px] mt-1">{name} 👋</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-bg3 flex items-center justify-center font-bold text-fg0 font-mono tracking-widest border border-bg4">
          {initials}
        </div>
      </header>

      {/* Event Banner */}
      <EventBanner />

      {/* Map Section */}
      <SectionLabel title="Venue density map" actionLabel="Expand ↗" actionHref="/venue" />
      <div className="px-0 relative mb-8">
        <VenueMap />
        <div className="px-6 relative -mt-4">
          <MapLegend />
        </div>
      </div>

      {/* Ticket Context inside map section conceptually, but displayed below map */}
      <div className="px-6 mt-6">
        <div className="bg-bg2 border-none rounded-[var(--r-lg)] p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-semibold text-[15px] text-fg1">Seat</h3>
            <span className="font-body text-fg0 font-medium bg-bg1 px-3 py-1.5 rounded-pill w-fit">
              {MOCK_TICKET.stand} · Row {MOCK_TICKET.row} · {MOCK_TICKET.seat}
            </span>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
              <span className="font-heading font-medium text-[15px] text-fg1">Suggested entry</span>
              <span className="font-body text-[14px] text-green bg-green-dim px-3 py-1.5 rounded-pill font-bold">
                Gate {MOCK_TICKET.suggestedGate} — least crowded ✓
              </span>
            </div>
            
            <div className="flex justify-between items-center w-full mt-2">
              <span className="font-heading font-medium text-[15px] text-fg1 w-1/3">Your gate</span>
              <div className="w-2/3 flex justify-end">
                <GateSelector />
              </div>
            </div>
          </div>
        </div>
        <RouteCard />
      </div>
      
      {/* Food Selection */}
      <div className="mt-8">
        <SectionLabel title="Food & drinks" actionLabel="Order →" actionHref="/order" />
        <div className="w-full overflow-x-auto scrollbar-hide px-6">
          <div className="flex gap-5 w-max pb-4">
            {MOCK_STALLS.map(stall => (
              <StallCard 
                key={stall.id} 
                stall={stall} 
                onClick={(s) => setSelectedStall(s)} 
              />
            ))}
          </div>
        </div>
      </div>

      <OrderModal 
        stall={selectedStall} 
        onClose={() => setSelectedStall(null)} 
      />
    </div>
  );
}
