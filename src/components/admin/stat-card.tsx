import { cn } from "@/lib/utils";

const accents = [
  "from-brand-500/15 to-brand-300/5",
  "from-ev-500/15 to-ev-100/40",
  "from-agri-500/15 to-agri-100/50",
  "from-brand-700/10 to-moss-100",
];

export function StatCard({
  label,
  value,
  hint,
  className,
  index = 0,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
  index?: number;
}) {
  const accent = accents[index % accents.length];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-300/20 bg-white/90 p-5 shadow-[0_8px_30px_rgba(20,50,31,0.05)] backdrop-blur-sm",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          accent
        )}
        aria-hidden
      />
      <div className="relative">
        <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase sm:text-sm sm:normal-case sm:tracking-normal sm:font-medium">
          {label}
        </p>
        <p className="mt-2 font-heading text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
          {value}
        </p>
        {hint ? (
          <p className="mt-1.5 text-xs leading-snug text-neutral-500">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
