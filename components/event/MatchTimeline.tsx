"use client";

import { MOCK_EVENT } from "@/lib/mock-data";

export function MatchTimeline() {
  const phases = MOCK_EVENT.timelinePhases;

  return (
    <div className="w-full overflow-x-auto bg-bg0 border-b border-bg2 sticky top-0 z-40 py-3 scrollbar-hide px-4">
      <div 
        role="list" 
        className="flex items-center w-max min-w-full"
      >
        {phases.map((phase, index) => {
          const isDone = phase.status === 'done';
          const isActive = phase.status === 'active';
          
          return (
            <div 
              key={phase.id} 
              role="listitem" 
              aria-current={isActive ? "step" : undefined}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                <div 
                  className={`flex items-center justify-center rounded-pill h-7 px-4 text-[12px] font-heading font-bold tracking-wide whitespace-nowrap transition-colors border-none
                    ${isDone ? 'bg-bg2 text-fg2' : ''}
                    ${isActive ? 'bg-orange-dim text-orange' : ''}
                    ${!isDone && !isActive ? 'bg-bg1 text-fg2 opacity-50' : ''}
                  `}
                >
                  <span className="mr-2 text-[10px]">{isDone ? '✓' : isActive ? '●' : '○'}</span>
                  {phase.label}
                </div>
              </div>
              
              {/* Connector */}
              {index < phases.length - 1 && (
                <div 
                  className={`h-px w-8 mx-2
                    ${isDone || isActive ? 'bg-bg4' : 'bg-bg2'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
