import Link from 'next/link';

interface SectionLabelProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionLabel({ title, actionLabel, actionHref }: SectionLabelProps) {
  return (
    <div className="flex w-full items-center justify-between mt-6 mb-3 px-4">
      <h3 className="text-[11px] uppercase tracking-[0.08em] text-fg2 font-medium">
        {title}
      </h3>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="text-[11px] text-orange hover:text-orange/80 uppercase tracking-wider font-medium">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
