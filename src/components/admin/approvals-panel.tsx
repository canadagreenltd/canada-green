"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { reviewPaymentSubmission } from "@/actions/payments";
import { ApprovalStatusPill } from "@/components/admin/status-pill";
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
import { formatAdminCad, formatAdminDate } from "@/lib/format-money";
import { getSignedReceiptUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/database";

export type ApprovalRow = {
  id: string;
  userName: string;
  userEmail: string;
  amountCad: number;
  receiptPath: string;
  status: PaymentStatus;
  declineReason: string | null;
  createdAt: string;
};

const filters: Array<PaymentStatus | "all"> = [
  "all",
  "pending",
  "active",
  "declined",
];

export function ApprovalsPanel({ initialItems }: { initialItems: ApprovalRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all"
  );
  const [selected, setSelected] = useState<ApprovalRow | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [declineMode, setDeclineMode] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((i) => i.status === statusFilter);
  }, [items, statusFilter]);

  const openItem = async (item: ApprovalRow) => {
    setSelected(item);
    setDeclineMode(false);
    setDeclineReason(item.declineReason ?? "");
    setReceiptUrl(null);
    setLoadingReceipt(true);
    try {
      const url = await getSignedReceiptUrl(item.receiptPath, 600);
      setReceiptUrl(url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not load receipt"
      );
    } finally {
      setLoadingReceipt(false);
    }
  };

  const closeDialog = () => {
    setSelected(null);
    setDeclineMode(false);
    setDeclineReason("");
    setReceiptUrl(null);
  };

  const approve = async () => {
    if (!selected) return;
    setBusy(true);
    const result = await reviewPaymentSubmission({
      id: selected.id,
      status: "active",
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selected.id
          ? { ...i, status: "active", declineReason: null }
          : i
      )
    );
    toast.success("Payment approved");
    closeDialog();
  };

  const decline = async () => {
    if (!selected) return;
    const reason = declineReason.trim();
    if (!reason) {
      toast.error("Please enter a decline reason");
      return;
    }
    setBusy(true);
    const result = await reviewPaymentSubmission({
      id: selected.id,
      status: "declined",
      declineReason: reason,
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selected.id
          ? { ...i, status: "declined", declineReason: reason }
          : i
      )
    );
    toast.success("Payment declined");
    closeDialog();
  };

  const isPdf = selected?.receiptPath.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Review
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Approvals
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Review bank-transfer receipts. Approve to activate or decline with a
          reason.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
              statusFilter === f
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-moss-100 text-brand-700 ring-1 ring-brand-300/30 hover:bg-moss-200"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="surface-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-neutral-600"
                >
                  No payments in this filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-brand-900">
                      {item.userName}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {item.userEmail}
                    </div>
                  </TableCell>
                  <TableCell>{formatAdminCad(item.amountCad)}</TableCell>
                  <TableCell>
                    <ApprovalStatusPill status={item.status} />
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {formatAdminDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void openItem(item)}
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
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-lg" showCloseButton>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>Payment receipt</DialogTitle>
                <DialogDescription>
                  {selected.userName} · {selected.userEmail}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-600">
                  <span>
                    Amount:{" "}
                    <strong className="text-brand-900">
                      {formatAdminCad(selected.amountCad)}
                    </strong>
                  </span>
                  <ApprovalStatusPill status={selected.status} />
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  {loadingReceipt ? (
                    <p className="flex h-full items-center justify-center text-neutral-600">
                      Loading receipt…
                    </p>
                  ) : receiptUrl ? (
                    isPdf ? (
                      <iframe
                        title="Receipt PDF"
                        src={receiptUrl}
                        className="h-full w-full"
                      />
                    ) : (
                      // Signed URLs change often — native img avoids next/image domain issues
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={receiptUrl}
                        alt={`Receipt from ${selected.userName}`}
                        className="h-full w-full object-contain"
                      />
                    )
                  ) : (
                    <p className="flex h-full items-center justify-center text-neutral-600">
                      Receipt unavailable
                    </p>
                  )}
                </div>

                {selected.status === "declined" && selected.declineReason ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-red-800">
                    <strong>Decline reason:</strong> {selected.declineReason}
                  </p>
                ) : null}

                {declineMode ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="decline-reason"
                      className="text-sm font-medium text-brand-900"
                    >
                      Decline reason
                    </label>
                    <textarea
                      id="decline-reason"
                      rows={3}
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Explain why this payment is declined…"
                      className="flex w-full rounded-xl border border-brand-300/35 bg-white/80 px-3 py-2 text-sm outline-none focus-visible:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/25"
                    />
                  </div>
                ) : null}
              </div>

              {selected.status === "pending" ? (
                <DialogFooter className="gap-2 sm:justify-between">
                  {declineMode ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeclineMode(false)}
                        disabled={busy}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => void decline()}
                        disabled={busy}
                      >
                        Confirm decline
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeclineMode(true)}
                        disabled={busy}
                      >
                        Decline
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void approve()}
                        disabled={busy}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </DialogFooter>
              ) : (
                <DialogFooter showCloseButton />
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
