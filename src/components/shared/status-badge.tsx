import { cn } from "@/lib/utils";
import type { Sector } from "@/lib/constants";
import type { ProjectStatus } from "@/lib/mock-data/projects";

type StatusBadgeProps = {
  status: ProjectStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const labels: Record<ProjectStatus, string> = {
    open: "OPEN",
    funded: "FUNDED",
    closed: "CLOSED",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase",
        status === "open" && "bg-brand-700 text-white",
        status === "funded" && "bg-ev-700 text-white",
        status === "closed" && "bg-neutral-600 text-white",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-white" />
      {labels[status]}
    </span>
  );
}

type SectorBadgeProps = {
  sector: Sector;
  className?: string;
};

export function SectorBadge({ sector, className }: SectorBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase",
        sector === "ev" && "bg-ev-100 text-ev-700",
        sector === "agriculture" && "bg-agri-100 text-agri-700",
        className
      )}
    >
      {sector === "ev" ? "EV Charging" : "Agriculture"}
    </span>
  );
}
