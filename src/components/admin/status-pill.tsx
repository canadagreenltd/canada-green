import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";
import type { PaymentStatus, TicketStatus } from "@/types/database";

const approvalStyles: Record<PaymentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  active: "border-brand-300 bg-brand-50 text-brand-800",
  declined: "border-red-200 bg-red-50 text-red-800",
};

const userStyles: Record<UserStatus, string> = {
  active: "border-brand-300 bg-brand-50 text-brand-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  inactive: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

const ticketStyles: Record<TicketStatus, string> = {
  open: "border-sky-200 bg-sky-50 text-sky-800",
  closed: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

export function ApprovalStatusPill({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", approvalStyles[status])}
    >
      {status}
    </Badge>
  );
}

export function UserStatusPill({ status }: { status: UserStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", userStyles[status])}>
      {status}
    </Badge>
  );
}

export function TicketStatusPill({ status }: { status: TicketStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", ticketStyles[status])}
    >
      {status}
    </Badge>
  );
}
