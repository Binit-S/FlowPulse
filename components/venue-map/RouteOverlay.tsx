import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";

interface RouteOverlayProps {
  targetStand: string;
  selectedGate: string;
}

export function RouteOverlay({ targetStand, selectedGate }: RouteOverlayProps) {
  const pathKey = `${selectedGate}-${targetStand}`;
  const pathD = WANKHEDE_CONFIG.routePaths[pathKey];

  if (!pathD) return null;

  return (
    <g>
      {/* Route background for contrast */}
      <path 
        d={pathD} 
        fill="none" 
        stroke="var(--bg0)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        opacity="0.5" 
      />
      {/* Animated route dashed line */}
      <path 
        d={pathD} 
        fill="none" 
        stroke="var(--green)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeDasharray="8 8"
        className="animate-[dash-flow_1s_linear_infinite]"
      />
      
      {/* Arrowhead marker definition is complex, for MVP we can use a small circle at the end, 
          or assume the line leads directly to YOU marker. */}
    </g>
  );
}
