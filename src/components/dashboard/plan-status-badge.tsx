import { Badge } from "@/components/ui/badge";
import type { PlanStatus } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

const styles: Record<PlanStatus, string> = {
  inactive: "border-neutral-200 bg-neutral-100 text-neutral-600",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  active: "border-brand-300 bg-brand-50 text-brand-800",
  declined: "border-red-200 bg-red-50 text-red-800",
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", styles[status])}>
      {status}
    </Badge>
  );
}
