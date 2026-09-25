import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/shared/icon-badge";
import { cn } from "@/lib/utils";

type SectorPanelProps = {
  href: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  sector: "ev" | "agriculture";
};

export function SectorPanel({
  href,
  image,
  imageAlt,
  icon: Icon,
  title,
  description,
  cta,
  sector,
}: SectorPanelProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[420px] overflow-hidden rounded-3xl md:h-[560px]"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          sector === "ev"
            ? "bg-gradient-to-t from-ev-700/90 via-ev-700/45 to-ev-700/10 group-hover:from-ev-700/95"
            : "bg-gradient-to-t from-agri-700/90 via-agri-700/45 to-agri-700/10 group-hover:from-agri-700/95"
        )}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <IconBadge>
          <Icon className="size-5" />
        </IconBadge>
        <div>
          <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
            {title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            {cta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
