"use client";

import { useState } from "react";
import { toast } from "sonner";
import { closeSupportTicket } from "@/actions/payments";
import { TicketStatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAdminDate } from "@/lib/format-money";
import type { TicketStatus } from "@/types/database";

export type SupportTicketRow = {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
};

export function SupportPanel({
  initialTickets,
}: {
  initialTickets: SupportTicketRow[];
}) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState<SupportTicketRow | null>(null);
  const [busy, setBusy] = useState(false);

  const markClosed = async (id: string) => {
    setBusy(true);
    const result = await closeSupportTicket(id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "closed" } : t))
    );
    setSelected((cur) =>
      cur?.id === id ? { ...cur, status: "closed" } : cur
    );
    toast.success("Ticket closed");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Help desk
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Support tickets
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          User questions and help requests.
        </p>
      </div>

      <div className="surface-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-neutral-600"
                >
                  No support messages yet.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="font-medium text-brand-900">
                      {ticket.userName}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {ticket.userEmail}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    {ticket.message}
                  </TableCell>
                  <TableCell>
                    <TicketStatusPill status={ticket.status} />
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {formatAdminDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelected(ticket)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>Support message</DialogTitle>
                <DialogDescription>
                  {selected.userName} · {selected.userEmail}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <TicketStatusPill status={selected.status} />
                  <span className="text-neutral-600">
                    {formatAdminDate(selected.createdAt)}
                  </span>
                </div>
                <p className="rounded-xl border border-neutral-200 bg-neutral-cream p-4 leading-relaxed text-neutral-900">
                  {selected.message}
                </p>
              </div>
              <DialogFooter className="gap-2">
                {selected.status === "open" ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => void markClosed(selected.id)}
                  >
                    Mark closed
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
