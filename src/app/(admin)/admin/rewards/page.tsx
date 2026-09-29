import { StatCard } from "@/components/admin/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUserCad } from "@/lib/format-money";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCommissionsPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: commissions }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("role", "user")
      .order("full_name", { ascending: true }),
    supabase.from("referral_commissions").select("beneficiary_id, amount_cad"),
  ]);

  const commissionByUser = new Map<string, number>();
  let totalCommission = 0;
  for (const row of commissions ?? []) {
    const amount = Number(row.amount_cad);
    totalCommission += amount;
    commissionByUser.set(
      row.beneficiary_id,
      (commissionByUser.get(row.beneficiary_id) ?? 0) + amount
    );
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name || "",
    email: p.email,
    commissionCad: commissionByUser.get(p.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Incentives
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Commissions
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          One-time referral commissions earned by investors from approved
          downline investments.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          index={0}
          label="Total referral commissions"
          value={formatUserCad(totalCommission)}
          hint="Sum of all one-time team bonuses paid to users"
        />
        <StatCard
          index={1}
          label="Investors with commissions"
          value={String(users.filter((u) => u.commissionCad > 0).length)}
        />
      </div>

      <div className="surface-card overflow-x-auto">
        <div className="border-b border-brand-300/20 px-5 py-4 sm:px-6">
          <h2 className="font-heading text-lg font-semibold text-brand-900">
            Investors &amp; commissions
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Referral commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-neutral-600"
                >
                  No investors yet.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-brand-900">
                    {u.fullName || "—"}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatUserCad(u.commissionCad)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
