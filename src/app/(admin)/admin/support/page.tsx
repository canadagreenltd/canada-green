import {
  SupportPanel,
  type SupportTicketRow,
} from "@/components/admin/support-panel";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      "id, message, status, created_at, user:profiles!user_id ( full_name, email )"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("support load:", error.message);
  }

  const initialTickets: SupportTicketRow[] = (data ?? []).map((row) => {
    const profile = Array.isArray(row.user) ? row.user[0] : row.user;
    return {
      id: row.id,
      userName: profile?.full_name || "Member",
      userEmail: profile?.email || "—",
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    };
  });

  return <SupportPanel initialTickets={initialTickets} />;
}
