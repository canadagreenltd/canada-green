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
import { formatAdminCad, formatAdminDate, formatUserCad } from "@/lib/format-money";
import { todaysProfit, totalProfit } from "@/lib/profit";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";

function userStatusFromPayments(statuses: PaymentStatus[]): UserStatus {
  if (statuses.includes("active")) return "active";
  if (statuses.includes("pending")) return "pending";
  return "inactive";
}

type PaymentRow = {
  user_id: string;
  amount_cad: number;
  status: PaymentStatus;
  starts_at: string | null;
  ends_at: string | null;
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const now = new Date();

  const [{ data: profiles }, { data: payments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("payment_submissions")
      .select("user_id, amount_cad, status, starts_at, ends_at"),
  ]);

  const paymentRows = (payments ?? []) as PaymentRow[];
  const investorCount = (profiles ?? []).filter((p) => p.role === "user").length;
  const totalInvestment = paymentRows
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + Number(p.amount_cad), 0);
  const pendingCount = paymentRows.filter((p) => p.status === "pending").length;
  const declinedCount = paymentRows.filter((p) => p.status === "declined").length;

  const statusesByUser = new Map<string, PaymentStatus[]>();
  const plansByUser = new Map<
    string,
    Array<{ amount: number; startsAt: string | null; endsAt: string | null }>
  >();

  for (const p of paymentRows) {
    const list = statusesByUser.get(p.user_id) ?? [];
    list.push(p.status);
    statusesByUser.set(p.user_id, list);

    if (p.status === "active") {
      const plans = plansByUser.get(p.user_id) ?? [];
      plans.push({
        amount: Number(p.amount_cad),
        startsAt: p.starts_at,
        endsAt: p.ends_at,
      });
      plansByUser.set(p.user_id, plans);
    }
  }

  const users = profiles ?? [];

  let platformDailyProfit = 0;
  let platformTotalProfit = 0;
  const profitByUser = new Map<string, { daily: number; total: number }>();

  for (const user of users) {
    const plans = plansByUser.get(user.id) ?? [];
    const daily = todaysProfit(plans, now);
    const total = totalProfit(plans, now);
    profitByUser.set(user.id, { daily, total });
    if (user.role !== "admin") {
      platformDailyProfit += daily;
      platformTotalProfit += total;
    }
  }

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

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
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
        <StatCard
          index={4}
          label="All users — today's profit"
          value={formatUserCad(platformDailyProfit)}
          hint="Sum of every investor's weekday profit today"
        />
        <StatCard
          index={5}
          label="All users — total profit"
          value={formatUserCad(platformTotalProfit)}
          hint="Sum of all-time accrued profit across investors"
        />
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
              <TableHead>Daily profit</TableHead>
              <TableHead>Total profit</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                const profit = profitByUser.get(user.id) ?? {
                  daily: 0,
                  total: 0,
                };
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
                    <TableCell className="tabular-nums text-brand-900">
                      {formatUserCad(profit.daily)}
                    </TableCell>
                    <TableCell className="tabular-nums text-brand-900">
                      {formatUserCad(profit.total)}
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
