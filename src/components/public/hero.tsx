import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlay?: "brand" | "ev" | "agri";
  children?: React.ReactNode;
  compact?: boolean;
  className?: string;
};

export function Hero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  overlay = "brand",
  children,
  compact = false,
  className,
}: HeroProps) {
  const overlayClass =
    overlay === "ev"
      ? "from-ev-700/85 via-ev-700/50 to-transparent"
      : overlay === "agri"
        ? "from-agri-700/85 via-agri-700/50 to-transparent"
        : "from-brand-950/85 via-brand-950/55 to-transparent";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        compact ? "min-h-[420px]" : "min-h-[640px] md:min-h-[85vh]",
        className
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-r", overlayClass)} />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-brand-950/20" />

      <div
        className={cn(
          "relative mx-auto flex max-w-7xl flex-col justify-center px-4 lg:px-6",
          compact ? "py-24 md:py-28" : "py-28 md:min-h-[85vh] md:py-36"
        )}
      >
        <p className="mb-4 text-xs font-bold tracking-[0.22em] text-brand-300 uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-[4rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {description}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={buttonVariants({
                  variant: "outline-light",
                  size: "lg",
                })}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
