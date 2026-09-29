import Link from "next/link";
import { CopyReferralCode } from "@/components/dashboard/copy-referral-code";
import { PlanStatusBadge } from "@/components/dashboard/plan-status-badge";
import { TeamRankCard } from "@/components/dashboard/team-rank-card";
import { StatCard } from "@/components/admin/stat-card";
import { PLAN_RENEWAL_NOTICE_DAYS } from "@/lib/constants";
import { formatUserCad } from "@/lib/format-money";
import type { PlanStatus } from "@/lib/dashboard-types";
import { todaysProfit, totalProfit } from "@/lib/profit";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";

function planStatusFromPayments(statuses: PaymentStatus[]): PlanStatus {
  if (statuses.includes("active")) return "active";
  if (statuses.includes("pending")) return "pending";
  if (statuses.includes("declined") && statuses.every((s) => s === "declined")) {
    return "inactive";
  }
  if (statuses.length === 0) return "inactive";
  return "inactive";
}

function needsRenewalBanner(
  rows: Array<{ status: PaymentStatus; ends_at: string | null }>
): boolean {
  const now = Date.now();
  const windowMs = PLAN_RENEWAL_NOTICE_DAYS * 24 * 60 * 60 * 1000;

  return rows.some((p) => {
    if (p.status !== "active" || !p.ends_at) return false;
    const ends = new Date(p.ends_at).getTime();
    return ends - now <= windowMs;
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("referral_code, referred_by, full_name, email")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  let referredByName: string | null = null;
  if (profile?.referred_by) {
    const { data: referrer } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", profile.referred_by)
      .maybeSingle();
    referredByName = referrer?.full_name || null;
  }

  const { data: payments } = user
    ? await supabase
        .from("payment_submissions")
        .select("amount_cad, status, starts_at, ends_at")
        .eq("user_id", user.id)
    : { data: null };

  const { data: teamRows } = user
    ? await supabase.rpc("get_my_team_profiles")
    : { data: null };

  const teamSize = (teamRows ?? []).length;

  const paymentRows = payments ?? [];
  const activePlans = paymentRows
    .filter((p) => p.status === "active")
    .map((p) => ({
      amount: Number(p.amount_cad),
      startsAt: p.starts_at,
      endsAt: p.ends_at,
    }));

  const activeInvestment = activePlans.reduce((sum, p) => sum + p.amount, 0);
  const now = new Date();
  const todays = todaysProfit(activePlans, now);
  const total = totalProfit(activePlans, now);

  const planStatus = planStatusFromPayments(
    paymentRows.map((p) => p.status)
  );
  const showRenewal = needsRenewalBanner(paymentRows);

  const fullName = profile?.full_name || "Member";
  const email = profile?.email || user?.email || "—";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Investor
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          My Account
        </h1>
        <p className="mt-1 text-sm text-neutral-600">Welcome, {fullName}</p>
      </div>

      {showRenewal ? (
        <div className="rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">Plan renewal reminder</p>
          <p className="mt-1">
            One or more of your investment plans expire within{" "}
            {PLAN_RENEWAL_NOTICE_DAYS} days (or have already ended). Submit a
            new payment on{" "}
            <Link
              href="/dashboard/billing"
              className="font-semibold underline underline-offset-2"
            >
              Billing &amp; Help
            </Link>{" "}
            to renew.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          index={0}
          label="Active investment"
          value={formatUserCad(activeInvestment)}
        />
        <StatCard
          index={1}
          label="Today's profit"
          value={formatUserCad(todays)}
        />
        <StatCard
          index={2}
          label="Total profit"
          value={formatUserCad(total)}
        />
      </div>

      <div className="rounded-2xl border border-brand-300/25 bg-moss-100/60 px-4 py-3 text-sm text-brand-900">
        Withdrawal of profit will be on the 1st day of every month.
      </div>

      <TeamRankCard teamSize={teamSize} />

      <div className="surface-card p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold text-brand-900">
          Profile
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-neutral-600">Full name</dt>
            <dd className="font-medium text-brand-900">{fullName}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-600">Email</dt>
            <dd className="font-medium text-brand-900">{email}</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-neutral-600">Plan status</dt>
            <dd>
              <PlanStatusBadge status={planStatus} />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-600">Role</dt>
            <dd className="font-medium text-brand-900">Investor</dd>
          </div>
        </dl>

        {profile?.referral_code ? (
          <div className="mt-6 border-t border-neutral-200 pt-5">
            <h3 className="font-heading font-semibold text-brand-900">
              Your referral code
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Share{" "}
              <code className="text-xs">?ref={profile.referral_code}</code> so
              others join your team and help you climb ranks.
            </p>
            <div className="mt-3">
              <CopyReferralCode code={profile.referral_code} />
            </div>
            {referredByName ? (
              <p className="mt-3 text-sm text-neutral-600">
                Referred by:{" "}
                <span className="font-semibold text-brand-900">
                  {referredByName}
                </span>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-neutral-600">
            Profile not ready yet — refresh in a moment after signup.
          </p>
        )}
      </div>
    </div>
  );
}
