import { TeamTree } from "@/components/dashboard/team-tree";
import { createClient } from "@/lib/supabase/server";
import type { TeamNode } from "@/lib/dashboard-types";

type ProfileLite = {
  id: string;
  full_name: string;
  referred_by: string | null;
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
    const children =
      depth >= 3
        ? []
        : (byParent.get(id) ?? []).map((c) =>
            walk(c.id, c.full_name || "Member", depth + 1)
          );
    return { id, name, children };
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
    : { id: "you", name: "You", children: [] };

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
          Referral network. Direct members used your code; deeper levels are
          indirect when visible.
        </p>
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
