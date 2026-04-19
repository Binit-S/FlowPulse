export function SkeletonCard() {
  return (
    <div className="bg-bg2 border border-bg3 rounded-[var(--r-lg)] p-4 animate-pulse">
      <div className="h-4 bg-bg3 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-bg3 rounded mb-2"></div>
      <div className="h-4 bg-bg3 rounded w-1/2"></div>
    </div>
  );
}
