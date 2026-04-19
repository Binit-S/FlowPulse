"use client";

import { useAppStore } from "@/lib/store";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";

/**
 * Gate selection radio group.
 * Allows the user to pick their preferred entry gate.
 * Uses aria-pressed for accessibility.
 */
export function GateSelector() {
  const { selectedGate, setSelectedGate } = useAppStore();

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Select entry gate">
      {WANKHEDE_CONFIG.gates.map((g) => {
        const isSelected = selectedGate === g.id;
        return (
          <button
            key={g.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Gate ${g.id}`}
            onClick={() => setSelectedGate(g.id)}
            className={`w-12 h-10 flex flex-col items-center justify-center rounded-full font-heading font-bold text-sm transition-all active:scale-[0.97] ${
              isSelected 
                ? "bg-bg3 text-fg0" 
                : "bg-transparent text-fg2 hover:bg-bg1"
            }`}
          >
            {g.id}
          </button>
        );
      })}
    </div>
  );
}
