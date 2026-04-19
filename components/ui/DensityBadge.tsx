import { DensityLevel } from "@/types";

interface DensityBadgeProps {
  level: DensityLevel;
  className?: string;
  showText?: boolean;
}

export function DensityBadge({ level, className = "", showText = true }: DensityBadgeProps) {
  const getStyles = () => {
    switch (level) {
      case "low":
        return "bg-green-dim text-green border border-green/20";
      case "medium":
        return "bg-amber/10 text-amber border border-amber/20";
      case "high":
        return "bg-red-dim text-red border border-red/20";
      default:
        return "bg-bg3 text-fg2";
    }
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-mono font-medium ${getStyles()} ${className}`}>
      {showText && <span className="capitalize">{level}</span>}
    </div>
  );
}
