import { DensityBadge } from "../ui/DensityBadge";

export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-2">
      <DensityBadge level="low" />
      <DensityBadge level="medium" />
      <DensityBadge level="high" />
      <div className="flex items-center gap-1.5 ml-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue inline-block"></span>
        <span className="text-xs text-fg2 font-medium">Your seat</span>
      </div>
    </div>
  );
}
