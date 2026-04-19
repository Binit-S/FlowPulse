"use client";

import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { useAppStore } from "@/lib/store";
import { DensityOverlay } from "./DensityOverlay";
import { RouteOverlay } from "./RouteOverlay";
import { DensityLevel } from "@/types";

export function VenueMap() {
  const { densities, selectedGate } = useAppStore();
  const targetStand = "S3"; // Assuming from MOCK_TICKET
  const userSeat = { cx: 170, cy: 75 }; // approximate position in S3 for demo
  
  return (
    <div className="w-full flex items-center justify-center -my-8 z-0 relative pointer-events-none">
      <div 
        className="w-[120%] max-w-[500px]"
        style={{
          transform: 'perspective(1000px) rotateX(45deg) rotateZ(-15deg) scale(1.1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease-out'
        }}
      >
        <svg 
          viewBox={WANKHEDE_CONFIG.svgViewBox} 
          className="w-full h-auto drop-shadow-2xl"
          role="img"
          aria-label="Stadium crowd density map. Gate C is least crowded."
        >
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--bg2)" stopOpacity="1" />
              <stop offset="70%" stopColor="var(--bg1)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--bg0)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="3dMarker" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="var(--orange)" />
               <stop offset="100%" stopColor="#cc5c00" />
            </linearGradient>
          </defs>

          {/* Layer 1: Structural SVG - Base Glow */}
          <ellipse cx="170" cy="150" rx="160" ry="160" fill="url(#stadiumGlow)" />
          
          <ellipse cx="170" cy="150" rx="140" ry="140" fill="none" stroke="var(--bg3)" strokeWidth="1" opacity="0.5" />
          <ellipse cx="170" cy="150" rx="80" ry="90" fill="var(--bg2)" opacity="0.3" stroke="var(--bg4)" strokeWidth="2" />
          <rect x="150" y="220" width="40" height="10" fill="var(--bg4)" rx="5" />
          <text x="170" y="227" fontSize="6" fill="var(--fg2)" textAnchor="middle" className="font-heading font-bold tracking-widest">SCREEN</text>

          {/* Static structural stands */}
          {WANKHEDE_CONFIG.zones.map(z => {
            if (z.svgShape.type === "ellipse") {
              return (
                <g key={z.id}>
                  <ellipse 
                    cx={z.svgShape.cx} cy={z.svgShape.cy} 
                    rx={z.svgShape.rx} ry={z.svgShape.ry} 
                    fill="var(--bg1)" opacity="0.5"
                    stroke="var(--bg3)" strokeWidth="1.5"
                  />
                  <text x={z.svgShape.cx} y={z.svgShape.cy} fontSize="12" fill="var(--fg2)" textAnchor="middle" className="font-heading font-bold opacity-60">{z.id}</text>
                </g>
              );
            }
            return null;
          })}

          {/* Layer 3: Density overlay */}
          {WANKHEDE_CONFIG.zones.map(z => (
            <DensityOverlay 
              key={`overlay-${z.id}`}
              zone={z}
              level={densities[z.id] || "low"}
            />
          ))}
          {WANKHEDE_CONFIG.gates.map(g => (
            <DensityOverlay 
              key={`overlay-gate-${g.id}`}
              zone={{ ...g, id: `gate-${g.id}`, type: 'gate', svgShape: { type: 'ellipse', cx: g.position.cx, cy: g.position.cy, rx: 20, ry: 20 } } as any}
              level={densities[`gate-${g.id}`] || "low"}
            />
          ))}

          {/* Layer 5: Route path */}
          <RouteOverlay targetStand={targetStand} selectedGate={selectedGate} />

          {/* Layer 2: Markers */}
          {WANKHEDE_CONFIG.gates.map(g => {
            const density = densities[`gate-${g.id}`] || "low";
            let stroke = "var(--green)";
            if (density === "medium") stroke = "var(--amber)";
            if (density === "high") stroke = "var(--red)";

            return (
              <g key={g.id}>
                <rect 
                  x={g.position.cx - 10} y={g.position.cy - 10} 
                  width="20" height="20" rx="10"
                  fill="var(--bg2)" stroke={stroke} strokeWidth="1.5"
                />
                <text x={g.position.cx} y={g.position.cy + 3.5} fontSize="10" fill={stroke} textAnchor="middle" className="font-heading font-bold">{g.id}</text>
              </g>
            );
          })}

          {/* Toilets */}
          {WANKHEDE_CONFIG.toilets.map(t => (
            <g key={t.id}>
              <circle cx={t.position.cx} cy={t.position.cy} r="8" fill="var(--bg3)" />
              <text x={t.position.cx} y={t.position.cy + 2.5} fontSize="7" fill="var(--fg1)" textAnchor="middle" className="font-heading font-medium tracking-tight">WC</text>
            </g>
          ))}

          {/* Food Stalls */}
          {WANKHEDE_CONFIG.foodStalls.map(f => (
            <g key={f.id}>
              <circle cx={f.position.cx} cy={f.position.cy} r="10" fill="var(--bg2)" stroke="var(--bg4)" strokeWidth="1.5" />
              <text x={f.position.cx} y={f.position.cy + 4} fontSize="12" textAnchor="middle">{f.emoji}</text>
            </g>
          ))}

          {/* Layer 4: Your seat marker */}
          <g>
            <ellipse cx={userSeat.cx} cy={userSeat.cy} rx="4.5" ry="2.5" fill="var(--bg0)" opacity="0.8" filter="blur(0.5px)" />
            <path 
              d={`M${userSeat.cx},${userSeat.cy} l-4,-8 a4,4 0 1,1 8,0 z`} 
              fill="url(#3dMarker)" 
            />
            <circle cx={userSeat.cx} cy={userSeat.cy - 8} r="1.5" fill="var(--bg0)" />
            <text x={userSeat.cx + 6} y={userSeat.cy - 4} fontSize="6" fill="var(--fg1)" className="font-body opacity-80 tracking-wide font-medium" style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}>you</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
