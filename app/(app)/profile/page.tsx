export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-full px-6 pt-6 pb-12">
      <h1 className="text-[26px] font-heading font-semibold mb-8">Profile</h1>

      <div className="flex items-center gap-5 p-6 bg-bg1 rounded-[var(--r-lg)] mb-10 transition-all active:scale-[0.97]">
        <div className="w-20 h-20 rounded-full bg-bg3 flex items-center justify-center font-bold text-fg0 font-heading tracking-widest text-[22px] border-none">
          BS
        </div>
        <div>
          <h2 className="text-[22px] font-heading font-bold">Binit S.</h2>
          <p className="text-fg2 text-[14px] font-body mt-1">+91 98765 43210</p>
        </div>
      </div>

      <h3 className="mb-4 text-[12px] uppercase tracking-[0.08em] text-fg2 font-heading font-bold">
        Past Events
      </h3>

      <div className="flex flex-col gap-4">
        <div className="p-6 rounded-[var(--r-lg)] bg-bg2 transition-all active:scale-[0.97]">
          <h4 className="font-heading font-semibold text-[17px]">A.R. Rahman Live</h4>
          <p className="text-[14px] font-body text-fg2 mt-1.5">Brabourne Stadium • Jan 2024</p>
        </div>
        <div className="p-6 rounded-[var(--r-lg)] bg-bg2 transition-all active:scale-[0.97]">
          <h4 className="font-heading font-semibold text-[17px]">Pro Kabaddi League</h4>
          <p className="text-[14px] font-body text-fg2 mt-1.5">NSCI Dome • Dec 2023</p>
        </div>
      </div>
    </div>
  );
}
