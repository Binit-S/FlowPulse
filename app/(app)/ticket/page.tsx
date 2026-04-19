"use client";

import { MOCK_TICKET, MOCK_EVENT } from "@/lib/mock-data";
import { GateSelector } from "@/components/routing/GateSelector";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { DensityBadge } from "@/components/ui/DensityBadge";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { rankGates } from "@/lib/route-scorer";
import { useMemo } from "react";

export default function TicketPage() {
  const { densities, selectedGate } = useAppStore();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportDensity, setReportDensity] = useState<"low"|"medium"|"high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routes = useMemo(() => rankGates(MOCK_TICKET.stand, densities), [densities]);

  const handleReport = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/report-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gate: selectedGate,
          density: reportDensity,
          sessionId: 'anon-mock-user-123'
        })
      });
      setReportModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-6 pb-12">
      <h1 className="text-[26px] font-heading font-semibold mb-6">Your Ticket</h1>
      
      <div className="bg-bg1 rounded-[var(--r-lg)] p-6 relative overflow-hidden">
        {/* Ticket styling top circle cuts */}
        <div className="absolute top-[160px] -left-4 w-8 h-8 rounded-full bg-bg0" />
        <div className="absolute top-[160px] -right-4 w-8 h-8 rounded-full bg-bg0" />
        
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[22px] font-heading font-bold tracking-tight">{MOCK_EVENT.name}</h2>
            <p className="text-[15px] text-fg2 font-body mt-1">{MOCK_EVENT.venue}</p>
          </div>
          <div className="bg-orange-dim px-3 py-1.5 rounded-pill text-orange font-heading font-bold text-[11px] tracking-widest">
            LIVE
          </div>
        </div>
        
        <div className="w-full flex justify-center py-8">
          <div className="w-56 h-56 bg-bg0 rounded-[var(--r-lg)] flex items-center justify-center">
            <span className="text-fg3 font-body font-bold tracking-widest">QR CODE SCAN</span>
          </div>
        </div>

        <div className="py-4 mt-2 -mx-6 px-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-body text-fg2 uppercase tracking-wide">Stand</p>
              <p className="font-body text-[20px] font-bold">{MOCK_TICKET.stand}</p>
            </div>
            <div>
              <p className="text-[11px] font-body text-fg2 uppercase tracking-wide">Row</p>
              <p className="font-body text-[20px] font-bold">{MOCK_TICKET.row}</p>
            </div>
            <div>
              <p className="text-[11px] font-body text-fg2 uppercase tracking-wide">Seat</p>
              <p className="font-body text-[20px] font-bold">{MOCK_TICKET.seat}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-bg2 -mx-6 px-6 flex justify-between items-center text-[13px] font-body">
          <span className="text-fg2">Booking Ref:</span>
          <span className="font-body font-bold text-fg1">{MOCK_TICKET.id}</span>
        </div>
      </div>
      
      <h3 className="mt-10 mb-4 text-[12px] uppercase tracking-[0.08em] text-fg2 font-heading font-bold">
        Entry Gate Status
      </h3>
      
      <div className="bg-bg2 rounded-[var(--r-lg)] p-6 flex flex-col gap-5">
        {WANKHEDE_CONFIG.gates.map((g) => {
          const route = routes.find(r => r.gate === g.id);
          const density = densities[`gate-${g.id}`] || 'low';
          const suggested = g.id === MOCK_TICKET.suggestedGate;

          return (
            <div key={g.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-[15px]">Gate {g.id}</span>
                {suggested && <span className="text-[10px] bg-blue-dim text-blue px-2 py-1 rounded-pill uppercase font-bold">Best</span>}
              </div>
              <div className="flex items-center gap-5">
                <span className="text-[13px] font-body font-medium text-fg2">{route?.walkMinutes}m walk</span>
                <DensityBadge level={density} className="w-16" />
              </div>
            </div>
          );
        })}
        
        <div className="mt-4 pt-5 border-t border-bg1 flex justify-between items-center">
          <p className="text-[14px] text-fg2 font-body font-medium">Which gate are you heading to?</p>
          <GateSelector />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
         <button 
           onClick={() => setReportModalOpen(true)}
           className="text-xs text-fg2 underline hover:text-fg0"
         >
           Report gate congestion
         </button>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg0/80 px-6 backdrop-blur-sm">
          <div className="bg-bg1 rounded-[var(--r-lg)] p-8 w-full max-w-sm">
            <h3 className="font-heading text-[20px] font-bold mb-2">Report congestion</h3>
            <p className="text-[14px] text-fg2 font-body mb-6">How crowded is Gate {selectedGate} right now?</p>
            
            <div className="flex flex-col gap-3 mb-6">
              {(['low', 'medium', 'high'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setReportDensity(d)}
                  className={`py-4 rounded-pill border border-transparent outline-none ring-0 text-[15px] font-medium transition-all active:scale-[0.97] ${
                    reportDensity === d 
                      ? d === 'low' ? 'bg-green-dim text-green' 
                        : d === 'medium' ? 'bg-amber/10 text-amber'
                        : 'bg-red-dim text-red'
                      : 'bg-bg2 text-fg1'
                  }`}
                >
                  <span className="capitalize">{d}</span>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-4 text-[15px] font-heading font-bold text-fg2 bg-bg2 rounded-pill transition-all active:scale-[0.97]"
              >
                Cancel
              </button>
              <button 
                onClick={handleReport}
                disabled={isSubmitting}
                className="flex-1 py-4 text-[15px] font-heading font-bold bg-orange text-bg0 rounded-pill transition-all active:scale-[0.97]"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
