import { BillingPanel } from "@/components/dashboard/billing-panel";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardBillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: payments }, { data: tickets }] = await Promise.all([
    user
      ? supabase
          .from("payment_submissions")
          .select("id, amount_cad, status, created_at, decline_reason")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("support_tickets")
          .select("id, message, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  return (
    <BillingPanel
      initialPayments={(payments ?? []).map((p) => ({
        id: p.id,
        amountCad: Number(p.amount_cad),
        status: p.status,
        createdAt: p.created_at,
        declineReason: p.decline_reason,
      }))}
      initialTickets={(tickets ?? []).map((t) => ({
        id: t.id,
        message: t.message,
        status: t.status,
        createdAt: t.created_at,
      }))}
    />
  );
}
