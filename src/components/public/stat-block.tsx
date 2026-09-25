import { cn } from "@/lib/utils";

type StatBlockProps = {
  value: React.ReactNode;
  label: string;
  light?: boolean;
  className?: string;
};

export function StatBlock({
  value,
  label,
  light = false,
  className,
}: StatBlockProps) {
  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "font-heading text-3xl font-bold tracking-tight md:text-4xl",
          light ? "text-brand-300" : "text-neutral-900"
        )}
      >
        {value}
      </div>
      <p
        className={cn(
          "mt-1.5 text-sm",
          light ? "text-white/70" : "text-neutral-600"
        )}
      >
        {label}
      </p>
    </div>
  );
}
