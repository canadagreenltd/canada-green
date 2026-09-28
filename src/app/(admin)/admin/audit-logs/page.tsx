import {
  AuditLogsPanel,
  type AuditLogRow,
} from "@/components/admin/audit-logs-panel";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      "id, action, detail, created_at, actor:profiles!actor_id ( full_name, email )"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("audit logs load:", error.message);
  }

  const initialLogs: AuditLogRow[] = (data ?? []).map((row) => {
    const actor = Array.isArray(row.actor) ? row.actor[0] : row.actor;
    return {
      id: row.id,
      userName: actor?.full_name || actor?.email || "System",
      action: row.action,
      detail: row.detail,
      createdAt: row.created_at,
    };
  });

  return <AuditLogsPanel initialLogs={initialLogs} />;
}
