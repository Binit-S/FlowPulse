"use client";

import { useMemo, useState } from "react";
import { MOCK_STALLS } from "@/lib/mock-data";
import { FoodStall } from "@/types";
import { OrderModal } from "@/components/food/OrderModal";

export default function OrderPage() {
  const [selectedStall, setSelectedStall] = useState<FoodStall | null>(null);
  const [filter, setFilter] = useState<"All" | "Near Seat" | "Under 10 min">("All");

  const filteredStalls = useMemo(() => {
    let list = [...MOCK_STALLS].sort((a, b) => a.waitMinutes - b.waitMinutes);
    if (filter === "Under 10 min") {
      list = list.filter(s => s.waitMinutes < 10);
    }
    // S3 is mock near seat
    if (filter === "Near Seat") {
      list = list.filter(s => s.standZone === "S3");
    }
    return list;
  }, [filter]);

  return (
    <div className="flex flex-col min-h-full px-6 pt-6 pb-12">
      <h1 className="text-[26px] font-heading font-semibold mb-6">Food & Drinks</h1>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 mb-6">
        {(["All", "Near Seat", "Under 10 min"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-pill text-[13px] font-body font-bold shrink-0 transition-all active:scale-[0.97] ${
              filter === f ? "bg-orange text-bg0" : "bg-bg2 text-fg1"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredStalls.map(stall => {
          let badgeColor = "bg-green-dim text-green";
          if (stall.waitMinutes >= 10 && stall.waitMinutes <= 20) {
            badgeColor = "bg-amber/10 text-amber";
          } else if (stall.waitMinutes > 20) {
            badgeColor = "bg-red-dim text-red";
          }

          return (
            <div key={stall.id} className="flex items-center justify-between p-4 bg-bg2 rounded-[var(--r-lg)] transition-all active:scale-[0.97]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-bg1 rounded-full text-3xl">
                  <span aria-hidden>{stall.emoji}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[15px]">{stall.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[13px] font-body text-fg2">Zone {stall.standZone}</span>
                    <span className={`text-[11px] font-body font-bold px-2 py-1 rounded-pill ${badgeColor}`}>
                      ~{stall.waitMinutes} m
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedStall(stall)}
                className="px-4 py-2 text-[13px] font-heading font-bold text-orange bg-orange-dim rounded-pill transition-colors"
                aria-label={`Order from ${stall.name}`}
              >
                ORDER
              </button>
            </div>
          );
        })}
      </div>

      <OrderModal stall={selectedStall} onClose={() => setSelectedStall(null)} />
    </div>
  );
}
