/** Loading skeleton for venue page */
export default function VenueLoading() {
  return (
    <div className="w-full flex flex-col pb-6 animate-pulse" aria-busy="true" aria-label="Loading venue data">
      <div className="px-6 py-6">
        <div className="h-8 w-48 bg-bg2 rounded-pill mb-2" />
        <div className="h-5 w-32 bg-bg2 rounded-pill" />
      </div>
      <div className="h-64 mx-6 bg-bg1 rounded-[var(--r-lg)]" />
      <div className="px-6 mt-6 space-y-4">
        <div className="h-32 bg-bg2 rounded-[var(--r-lg)]" />
        <div className="h-24 bg-bg2 rounded-[var(--r-lg)]" />
      </div>
    </div>
  );
}
