/** Loading skeleton for ticket page */
export default function TicketLoading() {
  return (
    <div className="flex flex-col min-h-full px-6 pt-6 pb-12 animate-pulse" aria-busy="true" aria-label="Loading ticket data">
      <div className="h-8 w-40 bg-bg2 rounded-pill mb-6" />
      <div className="h-48 bg-bg1 rounded-[var(--r-lg)] mb-6" />
      <div className="h-32 bg-bg2 rounded-[var(--r-lg)] mb-4" />
      <div className="h-12 bg-bg2 rounded-pill" />
    </div>
  );
}
