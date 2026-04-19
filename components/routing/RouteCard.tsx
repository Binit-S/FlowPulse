"use client";

import { useAppStore } from "@/lib/store";
import { MOCK_TICKET } from "@/lib/mock-data";
import { rankGates } from "@/lib/route-scorer";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";

export const RouteCard = memo(function RouteCard() {
  const { densities, selectedGate } = useAppStore();
  const targetStand = MOCK_TICKET.stand;

  const routes = useMemo(() => rankGates(targetStand, densities), [densities, targetStand]);
  const activeRoute = routes.find(r => r.gate === selectedGate) || routes[0];
  const suggestedRoute = routes.find(r => r.isSuggested) || routes[0];
  
  const isOptimal = selectedGate === suggestedRoute.gate;
  const timeDiff = activeRoute.walkMinutes - suggestedRoute.walkMinutes;

  if (!activeRoute) return null;

  return (
    <div className="bg-bg2 rounded-[var(--r-lg)] p-6 flex flex-col mt-4" aria-live="polite" aria-atomic="true">
      <div className="flex items-center space-x-2 text-[15px] overflow-x-auto scrollbar-hide pb-3">
        {activeRoute.steps.map((step, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="mr-2 text-lg">{step.icon}</span>
            <span className="font-heading font-medium">{step.label}</span>
            {idx < activeRoute.steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-3 text-fg3" />
            )}
          </div>
        ))}
      </div>
      
      {/* spacing instead of borders */}
      <div className="mt-4 pt-1 flex justify-between items-center text-[14px]">
        <span className="text-fg2 font-body">Est. walk time:</span>
        <span className="font-body font-bold text-fg0">~{activeRoute.walkMinutes} min</span>
      </div>
      
      {!isOptimal && timeDiff > 0 && (
        <div className="mt-4 text-[13px] text-orange bg-orange-dim px-4 py-3 rounded-[var(--r-md)] font-body font-medium">
          Gate {suggestedRoute.gate} saves ~{timeDiff} min waiting
        </div>
      )}
    </div>
  );
});
