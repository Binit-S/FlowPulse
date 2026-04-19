import { DensityLevel } from "@/types";

interface DensityOverlayProps {
  zone: any; // Simplified for MVP
  level: DensityLevel;
}

export function DensityOverlay({ zone, level }: DensityOverlayProps) {
  let color = "var(--green)";
  let opacity = 0.4;

  if (level === "medium") {
    color = "var(--amber)";
    opacity = 0.6;
  }
  if (level === "high") {
    color = "var(--red)";
    opacity = 0.8;
  }

  // Generate radial gradient IDs to avoid collisions
  const gradientId = `gradient-${zone.id}`;

  if (zone.svgShape?.type === "ellipse") {
    return (
      <g className="transition-opacity duration-600">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse 
          cx={zone.svgShape.cx} 
          cy={zone.svgShape.cy} 
          rx={zone.svgShape.rx} 
          ry={zone.svgShape.ry} 
          fill={`url(#${gradientId})`} 
        />
      </g>
    );
  }

  return null;
}
