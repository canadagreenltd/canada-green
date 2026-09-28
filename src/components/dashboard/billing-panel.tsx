"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  submitPaymentSubmission,
  submitSupportTicket,
} from "@/actions/payments";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MIN_INVESTMENT_CAD,
  PAYMENT_INSTRUCTIONS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { uploadReceipt } from "@/lib/supabase/storage";
import { formatUserCad } from "@/lib/format-money";
import type { PaymentStatus, TicketStatus } from "@/types/database";

export type BillingTicket = {
  id: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
};

export type BillingPayment = {
  id: string;
  amountCad: number;
  status: PaymentStatus;
  createdAt: string;
  declineReason: string | null;
};

function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="max-w-full break-all rounded-xl border border-brand-300/30 bg-moss-100/50 px-3 py-2 font-mono text-xs font-semibold text-brand-900 sm:text-sm">
        {value}
      </code>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void onCopy()}
        className="shrink-0"
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function BillingPanel({
  initialTickets,
  initialPayments,
}: {
  initialTickets: BillingTicket[];
  initialPayments: BillingPayment[];
}) {
  const [fileKey, setFileKey] = useState(0);
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [supportMessage, setSupportMessage] = useState("");
  const [supportError, setSupportError] = useState<string | null>(null);
  const [tickets, setTickets] = useState(initialTickets);
  const [payments, setPayments] = useState(initialPayments);
  const [sendingSupport, setSendingSupport] = useState(false);

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    setAmount(digits);
    setAmountError(null);
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError(null);
    setReceiptError(null);

    if (!amount) {
      setAmountError("Enter the amount you transferred");
      return;
    }
    if (!/^\d+$/.test(amount)) {
      setAmountError("Amount must be a whole number (no decimals)");
      return;
    }
    const value = Number(amount);
    if (!Number.isInteger(value) || value < MIN_INVESTMENT_CAD) {
      setAmountError(`Minimum investment is $${MIN_INVESTMENT_CAD}`);
      return;
    }
    if (!receiptFile) {
      setReceiptError("Please upload a receipt screenshot");
      return;
    }

    setSubmittingPayment(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in again");
        return;
      }

      const uploaded = await uploadReceipt(receiptFile, user.id);
      const result = await submitPaymentSubmission({
        amountCad: value,
        receiptPath: uploaded.path,
      });

      if (!result.ok) {
        toast.error("Submission failed", { description: result.error });
        setReceiptError(result.error);
        return;
      }

      setPayments((prev) => [
        {
          id: crypto.randomUUID(),
          amountCad: value,
          status: "pending",
          createdAt: new Date().toISOString(),
          declineReason: null,
        },
        ...prev,
      ]);
      toast.success("Payment submitted", {
        description: "Status is pending until an admin reviews your receipt.",
      });
      setAmount("");
      setReceiptFile(null);
      setFileKey((k) => k + 1);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not upload receipt";
      toast.error("Submission failed", { description: message });
      setReceiptError(message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const submitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportError(null);
    const msg = supportMessage.trim();
    if (msg.length < 5) {
      setSupportError("Please write a short message");
      return;
    }

    setSendingSupport(true);
    const result = await submitSupportTicket(msg);
    setSendingSupport(false);

    if (!result.ok) {
      toast.error("Message not sent", { description: result.error });
      setSupportError(result.error);
      return;
    }

    setTickets((prev) => [
      {
        id: crypto.randomUUID(),
        message: msg,
        status: "open",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSupportMessage("");
    toast.success("Message sent", {
      description: "The admin team can see this under Support tickets.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Payments
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Billing &amp; Help
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Transfer using one of the methods below, then submit your amount and
          receipt.
        </p>
      </div>

      <div className="surface-card space-y-6 p-5 sm:p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold text-brand-900">
            Payment instructions
          </h2>
          <p className="mt-2 rounded-xl border border-soil-600/15 bg-soil-100 px-3 py-2.5 text-sm text-soil-600">
            Investment plan starts from{" "}
            <strong className="text-brand-900">${MIN_INVESTMENT_CAD}</strong>{" "}
            (whole numbers only). Plans run for 18 months after approval.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brand-900">
            {PAYMENT_INSTRUCTIONS.usdt.label}
          </h3>
          <p className="text-xs text-neutral-600">
            Network: {PAYMENT_INSTRUCTIONS.usdt.network}
          </p>
          <CopyValue
            value={PAYMENT_INSTRUCTIONS.usdt.address}
            label="Wallet address"
          />
        </div>

        <div className="space-y-3 border-t border-brand-300/20 pt-5">
          <h3 className="text-sm font-semibold text-brand-900">
            {PAYMENT_INSTRUCTIONS.bank.label}
          </h3>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-neutral-600">Bank</dt>
              <dd className="font-medium text-brand-900">
                {PAYMENT_INSTRUCTIONS.bank.bankName}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-600">IBAN</dt>
              <dd className="mt-1">
                <CopyValue
                  value={PAYMENT_INSTRUCTIONS.bank.iban}
                  label="IBAN"
                />
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-xs text-neutral-600">
          {PAYMENT_INSTRUCTIONS.referenceNote}
        </p>
      </div>

      <form
        onSubmit={submitPayment}
        className="space-y-5 surface-card p-5 sm:p-6"
        noValidate
      >
        <h2 className="font-heading text-lg font-semibold text-brand-900">
          Submit payment
        </h2>
        <FieldGroup>
          <Field data-invalid={!!amountError || undefined}>
            <FieldLabel htmlFor="amount">Amount transferred</FieldLabel>
            <Input
              id="amount"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={`e.g. ${MIN_INVESTMENT_CAD}`}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              aria-invalid={!!amountError}
              required
            />
            {amountError ? <FieldError>{amountError}</FieldError> : null}
          </Field>

          <Field data-invalid={!!receiptError || undefined}>
            <FieldLabel htmlFor="receipt">Receipt screenshot</FieldLabel>
            <Input
              key={fileKey}
              id="receipt"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              aria-invalid={!!receiptError}
              required
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setReceiptFile(file);
                setReceiptError(null);
              }}
            />
            <p className="text-xs text-neutral-600">
              JPEG, PNG, WebP, or PDF · max 5 MB · required
            </p>
            {receiptFile ? (
              <p className="text-xs text-brand-700">
                Selected: {receiptFile.name}
              </p>
            ) : null}
            {receiptError ? <FieldError>{receiptError}</FieldError> : null}
          </Field>
        </FieldGroup>

        <Button type="submit" variant="secondary" disabled={submittingPayment}>
          {submittingPayment ? "Uploading…" : "Submit"}
        </Button>
      </form>

      {payments.length > 0 ? (
        <div className="surface-card overflow-x-auto p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-900">
            Your submissions
          </h2>
          <ul className="mt-4 space-y-2">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-300/20 bg-moss-100/40 px-3 py-2.5 text-sm"
              >
                <span className="font-medium text-brand-900">
                  {formatUserCad(p.amountCad)}
                </span>
                <span className="capitalize text-neutral-600">{p.status}</span>
                {p.status === "declined" && p.declineReason ? (
                  <span className="w-full text-xs text-red-700">
                    {p.declineReason}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-4 surface-card p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold text-brand-900">
          Support
        </h2>
        <p className="text-sm text-neutral-600">
          Send a message to the admin team.
        </p>
        <form onSubmit={submitSupport} className="space-y-4" noValidate>
          <Field data-invalid={!!supportError || undefined}>
            <FieldLabel htmlFor="support-message">Your message</FieldLabel>
            <textarea
              id="support-message"
              rows={4}
              value={supportMessage}
              onChange={(e) => {
                setSupportMessage(e.target.value);
                setSupportError(null);
              }}
              placeholder="How can we help?"
              aria-invalid={!!supportError}
              className="flex min-h-[110px] w-full rounded-xl border border-brand-300/35 bg-white/80 px-3.5 py-2.5 text-sm shadow-sm outline-none focus-visible:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/25"
            />
            {supportError ? <FieldError>{supportError}</FieldError> : null}
          </Field>
          <Button type="submit" variant="secondary" disabled={sendingSupport}>
            {sendingSupport ? "Sending…" : "Send message"}
          </Button>
        </form>

        {tickets.length > 0 ? (
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <p className="text-sm font-medium text-brand-900">Your messages</p>
            <ul className="space-y-2">
              {tickets.map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-brand-300/20 bg-moss-100/60 px-3 py-2.5 text-sm text-neutral-800"
                >
                  <span className="mb-1 block text-[10px] font-semibold tracking-wide text-brand-500 uppercase">
                    {m.status}
                  </span>
                  {m.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
