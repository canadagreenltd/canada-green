"use server";

import { revalidatePath } from "next/cache";
import {
  MIN_INVESTMENT_CAD,
  PAYMENT_STATUSES,
  PLAN_TENURE_MONTHS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

async function writeAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  action: string,
  detail: string,
  actorId?: string
) {
  await supabase.rpc("write_audit_log", {
    p_action: action,
    p_detail: detail,
    p_actor_id: actorId ?? undefined,
  });
}

export async function submitPaymentSubmission(input: {
  amountCad: number;
  receiptPath: string;
}): Promise<ActionResult> {
  const amount = Number(input.amountCad);
  if (
    !Number.isFinite(amount) ||
    !Number.isInteger(amount) ||
    amount < MIN_INVESTMENT_CAD
  ) {
    return {
      ok: false,
      error: `Enter a whole number of at least $${MIN_INVESTMENT_CAD}`,
    };
  }
  if (!input.receiptPath?.trim()) {
    return { ok: false, error: "Receipt upload is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in" };
  }

  const expectedPrefix = `${user.id}/`;
  if (!input.receiptPath.startsWith(expectedPrefix)) {
    return { ok: false, error: "Invalid receipt path" };
  }

  const { error } = await supabase.from("payment_submissions").insert({
    user_id: user.id,
    amount_cad: amount,
    receipt_path: input.receiptPath,
    status: PAYMENT_STATUSES.PENDING,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAudit(
    supabase,
    "Payment submitted",
    `Submitted receipt for $${amount}`,
    user.id
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  revalidatePath("/admin/approvals");
  revalidatePath("/admin/audit-logs");
  revalidatePath("/admin");
  return { ok: true };
}

export async function submitSupportTicket(message: string): Promise<ActionResult> {
  const trimmed = message.trim();
  if (trimmed.length < 5) {
    return { ok: false, error: "Please write a short message" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in" };
  }

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    message: trimmed,
    status: "open",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAudit(
    supabase,
    "Support ticket",
    trimmed.slice(0, 120),
    user.id
  );

  revalidatePath("/dashboard/billing");
  revalidatePath("/admin/support");
  revalidatePath("/admin/audit-logs");
  return { ok: true };
}

export async function reviewPaymentSubmission(input: {
  id: string;
  status: Extract<PaymentStatus, "active" | "declined">;
  declineReason?: string;
}): Promise<ActionResult> {
  if (input.status !== "active" && input.status !== "declined") {
    return { ok: false, error: "Invalid status" };
  }

  if (input.status === "declined" && !input.declineReason?.trim()) {
    return { ok: false, error: "Please enter a decline reason" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Admin access required" };
  }

  const { data: payment } = await supabase
    .from("payment_submissions")
    .select("amount_cad, user_id")
    .eq("id", input.id)
    .maybeSingle();

  const now = new Date();
  const startsAt = now.toISOString();
  const endsAt = new Date(now);
  endsAt.setMonth(endsAt.getMonth() + PLAN_TENURE_MONTHS);

  const { error } = await supabase
    .from("payment_submissions")
    .update(
      input.status === "active"
        ? {
            status: "active" as const,
            decline_reason: null,
            reviewed_at: startsAt,
            reviewed_by: user.id,
            starts_at: startsAt,
            ends_at: endsAt.toISOString(),
          }
        : {
            status: "declined" as const,
            decline_reason: input.declineReason!.trim(),
            reviewed_at: startsAt,
            reviewed_by: user.id,
            starts_at: null,
            ends_at: null,
          }
    )
    .eq("id", input.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  const amount = payment ? Number(payment.amount_cad) : 0;
  await writeAudit(
    supabase,
    input.status === "active" ? "Payment approved" : "Payment declined",
    input.status === "active"
      ? `Activated investment of $${amount}`
      : `Declined $${amount}: ${input.declineReason!.trim()}`,
    user.id
  );

  revalidatePath("/admin/approvals");
  revalidatePath("/admin/audit-logs");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  return { ok: true };
}

export async function closeSupportTicket(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Admin access required" };
  }

  const { error } = await supabase
    .from("support_tickets")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAudit(supabase, "Support closed", `Closed ticket ${id}`, user.id);

  revalidatePath("/admin/support");
  revalidatePath("/admin/audit-logs");
  return { ok: true };
}
