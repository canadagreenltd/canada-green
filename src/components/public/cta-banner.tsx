import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaBannerProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  className?: string;
};

export function CtaBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  className,
}: CtaBannerProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-950/80" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">{description}</p>
        <Link
          href={ctaHref}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
