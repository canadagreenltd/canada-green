import { cn } from "@/lib/utils";

type IconBadgeProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function IconBadge({
  children,
  className,
  size = "md",
}: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm",
        size === "sm" && "size-9",
        size === "md" && "size-12",
        size === "lg" && "size-14",
        className
      )}
    >
      {children}
    </span>
  );
}
