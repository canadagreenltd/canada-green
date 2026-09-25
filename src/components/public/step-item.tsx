import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StepItemProps = {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  showConnector?: boolean;
};

export function StepItem({
  step,
  title,
  description,
  icon: Icon,
  className,
  showConnector = false,
}: StepItemProps) {
  return (
    <div className={cn("relative flex flex-col items-center text-center", className)}>
      {showConnector && (
        <div
          className="absolute top-5 left-[calc(50%+1.75rem)] hidden h-px w-[calc(100%-2rem)] border-t border-dashed border-brand-300 md:block"
          aria-hidden
        />
      )}
      <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-brand-700 font-heading text-sm font-bold text-white">
        {step}
      </div>
      <div className="mt-4 flex size-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-neutral-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-[200px] text-sm text-neutral-600">
        {description}
      </p>
    </div>
  );
}
