import {
  ApprovalsPanel,
  type ApprovalRow,
} from "@/components/admin/approvals-panel";
import { createClient } from "@/lib/supabase/server";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_submissions")
    .select(
      "id, amount_cad, receipt_path, status, decline_reason, created_at, user:profiles!user_id ( full_name, email )"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("approvals load:", error.message);
  }

  const initialItems: ApprovalRow[] = (data ?? []).map((row) => {
    const profile = Array.isArray(row.user) ? row.user[0] : row.user;
    return {
      id: row.id,
      userName: profile?.full_name || "Member",
      userEmail: profile?.email || "—",
      amountCad: Number(row.amount_cad),
      receiptPath: row.receipt_path,
      status: row.status,
      declineReason: row.decline_reason,
      createdAt: row.created_at,
    };
  });

  return <ApprovalsPanel initialItems={initialItems} />;
}
