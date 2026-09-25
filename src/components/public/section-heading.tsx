import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:text-left",
        className
      )}
    >
      <div className={cn(align === "center" && !action && "max-w-2xl")}>
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-xs font-bold tracking-[0.2em] uppercase",
              light ? "text-brand-300" : "text-brand-500"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-heading text-3xl font-bold tracking-tight md:text-4xl",
            light ? "text-white" : "text-neutral-900"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 max-w-xl text-base leading-relaxed",
              light ? "text-white/70" : "text-neutral-600"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
