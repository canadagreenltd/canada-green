import { TeamTree } from "@/components/dashboard/team-tree";
import { StatCard } from "@/components/admin/stat-card";
import {
  REFERRAL_DEFAULT_MAX_DEPTH,
  REFERRAL_DIRECTS_TO_UNLOCK,
  REFERRAL_UNLOCKED_MAX_DEPTH,
} from "@/lib/constants";
import type { TeamNode } from "@/lib/dashboard-types";
import { formatUserCad } from "@/lib/format-money";
import { createClient } from "@/lib/supabase/server";

type ProfileLite = {
  id: string;
  full_name: string;
  referred_by: string | null;
  depth: number;
};

function buildTree(
  rootId: string,
  rootName: string,
  members: ProfileLite[]
): TeamNode {
  const byParent = new Map<string, ProfileLite[]>();
  for (const m of members) {
    if (!m.referred_by) continue;
    const list = byParent.get(m.referred_by) ?? [];
    list.push(m);
    byParent.set(m.referred_by, list);
  }

  const walk = (id: string, name: string, depth: number): TeamNode => {
    const children = (byParent.get(id) ?? []).map((c) =>
      walk(c.id, c.full_name || "Member", depth + 1)
    );
    return { id, name, depth, children };
  };

  return walk(rootId, rootName, 0);
}

export default async function DashboardTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = user
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: teamRows } = user
    ? await supabase.rpc("get_my_team_profiles")
    : { data: null };

  const members = (teamRows ?? []) as ProfileLite[];
  const tree = me
    ? buildTree(me.id, me.full_name || "You", members)
    : { id: "you", name: "You", depth: 0, children: [] };

  const directCount = members.filter((m) => m.depth === 1).length;
  const unlocked = directCount >= REFERRAL_DIRECTS_TO_UNLOCK;
  const maxDepth = unlocked
    ? REFERRAL_UNLOCKED_MAX_DEPTH
    : REFERRAL_DEFAULT_MAX_DEPTH;

  const { data: commissionRows } = user
    ? await supabase
        .from("referral_commissions")
        .select("amount_cad")
        .eq("beneficiary_id", user.id)
    : { data: null };

  const totalTeamBonus = (commissionRows ?? []).reduce(
    (sum, row) => sum + Number(row.amount_cad),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          Network
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Team
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Your referral tree and one-time team bonuses from approved downline
          investments (5% direct, 1% indirect).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Direct members"
          value={`${directCount}`}
          hint={`${directCount}/${REFERRAL_DIRECTS_TO_UNLOCK} to unlock depth ${REFERRAL_UNLOCKED_MAX_DEPTH}`}
        />
        <StatCard
          label="Commission depth"
          value={`Level ${maxDepth}`}
          hint={
            unlocked
              ? `Unlocked to level ${REFERRAL_UNLOCKED_MAX_DEPTH}`
              : "Create 5 direct referrals and unlock the next level"
          }
        />
        <StatCard
          label="Total team bonus"
          value={formatUserCad(totalTeamBonus)}
          hint="One-time commissions earned so far"
        />
      </div>

      <div className="rounded-2xl border border-brand-300/25 bg-moss-100/60 px-4 py-3 text-sm text-brand-900">
        Referral bonus is instant and will be processed in 24 hrs.
      </div>

      <div className="surface-card p-5 sm:p-6">
        {tree.children.length === 0 ? (
          <p className="text-sm text-neutral-600">
            No referrals yet. Share your invite link from My Account.
          </p>
        ) : (
          <TeamTree tree={tree} />
        )}
      </div>
    </div>
  );
}
