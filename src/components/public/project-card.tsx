import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Target, TrendingUp } from "lucide-react";
import { SectorBadge, StatusBadge } from "@/components/shared/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import {
  formatCad,
  getFundedPercent,
  type Project,
} from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const funded = getFundedPercent(project);
  const hoverFill =
    project.sector === "ev"
      ? "hover:bg-ev-700 hover:border-ev-700"
      : "hover:bg-agri-700 hover:border-agri-700";

  return (
    <article
      className={cn(
        "group card-elevated flex flex-col overflow-hidden",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <SectorBadge
            sector={project.sector}
            className="bg-white/95 shadow-sm"
          />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-neutral-900">
          {project.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-600">
          <MapPin className="size-3.5 shrink-0" />
          {project.location}
        </p>

        <ul className="mt-4 space-y-2 text-sm text-neutral-600">
          <li className="flex items-center gap-2">
            <Target className="size-3.5 text-brand-500" />
            Target: {formatCad(project.targetCad)}
          </li>
          <li className="flex items-center gap-2">
            <TrendingUp className="size-3.5 text-brand-500" />
            Expected: {project.expectedReturnMin}–{project.expectedReturnMax}%
            p.a.
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-3.5 text-brand-500" />
            Term: {project.termYears} years
          </li>
        </ul>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-end text-xs font-bold text-neutral-900">
            {funded}% Funded
          </div>
          <ProgressBar percent={funded} sector={project.sector} />
        </div>

        <Link
          href={`/projects/${project.id}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-5 w-full border",
            hoverFill
          )}
        >
          View Details
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
