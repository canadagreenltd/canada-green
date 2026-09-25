import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  href?: string;
};

export function Logo({ className, variant = "dark", href = "/" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-brand-900";
  const greenColor = variant === "light" ? "text-brand-300" : "text-brand-500";

  const mark = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight",
        textColor,
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn("size-6 shrink-0", greenColor)}
        aria-hidden
      >
        <path
          d="M12 2C12 2 7 7.5 7 12.5C7 16.09 9.91 19 13.5 19C14.5 19 15.4 18.7 16.15 18.2C15.1 20.4 12.8 22 10 22C5.58 22 2 18.42 2 14C2 8 8 3 12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M14 4C14 4 18 8 18 12C18 14.76 16.24 17 13.5 17C12.12 17 10.9 16.36 10.15 15.4C11.35 14.55 12.1 13.15 12.1 11.55C12.1 8.5 14 4 14 4Z"
          fill="currentColor"
        />
      </svg>
      <span>
        CANADA
        <span className={greenColor}> GREEN</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex" aria-label="Canada Green home">
        {mark}
      </Link>
    );
  }

  return mark;
}
