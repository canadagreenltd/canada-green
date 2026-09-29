/**
 * Gamified team ranks from combined direct + indirect team size.
 * Director unlocks at 500+ members.
 */

export const TEAM_RANKS = [
  {
    id: "bronze",
    label: "Bronze",
    minTeam: 0,
    accent: "from-amber-800/90 to-amber-600/80",
    badge: "border-amber-700/40 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950",
    ring: "ring-amber-400/40",
  },
  {
    id: "silver",
    label: "Silver",
    minTeam: 5,
    accent: "from-slate-500/90 to-slate-400/80",
    badge: "border-slate-400/50 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900",
    ring: "ring-slate-300/50",
  },
  {
    id: "gold",
    label: "Gold",
    minTeam: 15,
    accent: "from-yellow-500/90 to-amber-400/80",
    badge: "border-yellow-500/50 bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-950",
    ring: "ring-yellow-400/50",
  },
  {
    id: "platinum",
    label: "Platinum",
    minTeam: 50,
    accent: "from-violet-500/90 to-fuchsia-400/70",
    badge: "border-violet-400/50 bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-950",
    ring: "ring-violet-300/50",
  },
  {
    id: "diamond",
    label: "Diamond",
    minTeam: 100,
    accent: "from-sky-500/90 to-cyan-400/80",
    badge: "border-sky-400/50 bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-950",
    ring: "ring-sky-300/50",
  },
  {
    id: "black_diamond",
    label: "Black Diamond",
    minTeam: 250,
    accent: "from-neutral-900 to-neutral-700",
    badge: "border-neutral-700/60 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white",
    ring: "ring-neutral-500/40",
  },
  {
    id: "director",
    label: "Director",
    minTeam: 500,
    accent: "from-brand-700 to-brand-500",
    badge: "border-brand-500/50 bg-gradient-to-br from-brand-700 to-brand-500 text-white",
    ring: "ring-brand-400/50",
  },
] as const;

export type TeamRankId = (typeof TEAM_RANKS)[number]["id"];

export type TeamRankInfo = (typeof TEAM_RANKS)[number];

export function getTeamRank(teamSize: number): {
  current: TeamRankInfo;
  next: TeamRankInfo | null;
  progress: number;
  membersToNext: number;
} {
  const size = Math.max(0, Math.floor(teamSize));
  let current: TeamRankInfo = TEAM_RANKS[0];
  for (const rank of TEAM_RANKS) {
    if (size >= rank.minTeam) current = rank;
  }

  const idx = TEAM_RANKS.findIndex((r) => r.id === current.id);
  const next: TeamRankInfo | null =
    idx >= 0 && idx < TEAM_RANKS.length - 1 ? TEAM_RANKS[idx + 1] : null;

  if (!next) {
    return { current, next: null, progress: 1, membersToNext: 0 };
  }

  const span = next.minTeam - current.minTeam;
  const into = size - current.minTeam;
  const progress = span <= 0 ? 1 : Math.min(1, Math.max(0, into / span));
  const membersToNext = Math.max(0, next.minTeam - size);

  return { current, next, progress, membersToNext };
}
