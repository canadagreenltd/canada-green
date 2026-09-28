import { StatCard } from "@/components/admin/stat-card";
import { UserStatusPill } from "@/components/admin/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserStatus } from "@/lib/dashboard-types";
import { formatAdminCad, formatAdminDate } from "@/lib/format-money";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";

function userStatusFromPayments(statuses: PaymentStatus[]): UserStatus {
  if (statuses.includes("active")) return "active";
  if (statuses.includes("pending")) return "pending";
  return "inactive";
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: payments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("payment_submissions").select("user_id, amount_cad, status"),
  ]);

  const paymentRows = payments ?? [];
  const investorCount = (profiles ?? []).filter((p) => p.role === "user").length;
  const totalInvestment = paymentRows
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + Number(p.amount_cad), 0);
  const pendingCount = paymentRows.filter((p) => p.status === "pending").length;
  const declinedCount = paymentRows.filter((p) => p.status === "declined").length;

  const statusesByUser = new Map<string, PaymentStatus[]>();
  for (const p of paymentRows) {
    const list = statusesByUser.get(p.user_id) ?? [];
    list.push(p.status);
    statusesByUser.set(p.user_id, list);
  }

  const users = profiles ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Control panel
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Platform snapshot and registered members.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Investors"
          value={investorCount.toLocaleString("en-CA")}
        />
        <StatCard
          index={1}
          label="Active investment"
          value={formatAdminCad(totalInvestment)}
        />
        <StatCard
          index={2}
          label="Pending review"
          value={String(pendingCount)}
        />
        <StatCard index={3} label="Declined" value={String(declinedCount)} />
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold text-brand-900">
          Users
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          All registered accounts from the database.
        </p>
      </div>

      <div className="surface-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-neutral-600"
                >
                  No users yet.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const status =
                  user.role === "admin"
                    ? ("active" as UserStatus)
                    : userStatusFromPayments(
                        statusesByUser.get(user.id) ?? []
                      );
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-brand-900">
                      {user.full_name || "—"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <UserStatusPill status={status} />
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {formatAdminDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
