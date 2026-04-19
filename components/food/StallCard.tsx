import { FoodStall } from "@/types";

interface StallCardProps {
  stall: FoodStall;
  onClick: (stall: FoodStall) => void;
}

export function StallCard({ stall, onClick }: StallCardProps) {
  let badgeColor = "bg-green-dim text-green";
  if (stall.waitMinutes >= 10 && stall.waitMinutes <= 20) {
    badgeColor = "bg-amber/10 text-amber";
  } else if (stall.waitMinutes > 20) {
    badgeColor = "bg-red-dim text-red";
  }

  return (
    <button 
      onClick={() => onClick(stall)}
      className="flex flex-col w-[160px] shrink-0 bg-bg2 rounded-[var(--r-lg)] overflow-hidden text-left transition-all active:scale-[0.97] outline-none"
    >
      <div className="h-28 bg-bg1 relative flex items-center justify-center text-5xl pb-2">
        <span aria-hidden="true">{stall.emoji}</span>
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-[11px] font-body font-bold ${badgeColor}`}>
          ~{stall.waitMinutes} m
        </div>
      </div>
      <div className="p-4 bg-bg2">
        <h4 className="font-heading font-semibold text-[15px] truncate">{stall.name}</h4>
        <p className="text-[13px] text-fg2 font-body mt-1">
          Zone {stall.standZone} • #{stall.stallNumber}
        </p>
      </div>
    </button>
  );
}
