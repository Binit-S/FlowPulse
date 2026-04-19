import { MatchTimeline } from "@/components/event/MatchTimeline";
import { BottomNav } from "@/components/ui/BottomNav";
import { ConciergeWidget } from "@/components/concierge/ConciergeWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg0 max-w-md mx-auto sm:border-x sm:border-bg2 relative">
      <MatchTimeline />
      
      <main className="flex-1 pb-24 overflow-x-hidden">
        {children}
      </main>

      <ConciergeWidget />
      <BottomNav />
    </div>
  );
}
