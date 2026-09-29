import Link from "next/link";
import { Crown, Sparkles, Users } from "lucide-react";
import { getTeamRank } from "@/lib/team-rank";
import { cn } from "@/lib/utils";

export function TeamRankCard({
  teamSize,
  className,
}: {
  teamSize: number;
  className?: string;
}) {
  const { current, next, progress, membersToNext } = getTeamRank(teamSize);
  const pct = Math.round(progress * 100);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-300/25 bg-white p-5 shadow-[0_12px_40px_rgba(20,50,31,0.08)] sm:p-6",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-gradient-to-br opacity-30 blur-2xl",
          current.accent
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-12 -left-6 size-36 rounded-full bg-gradient-to-tr opacity-20 blur-2xl",
          current.accent
        )}
        aria-hidden
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] text-brand-500 uppercase">
            <Crown className="size-3.5" aria-hidden />
            Your rank
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm ring-2",
                current.badge,
                current.ring
              )}
            >
              <Sparkles className="size-4 opacity-80" aria-hidden />
              {current.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
              <Users className="size-4 text-brand-500" aria-hidden />
              <span className="font-semibold text-brand-900">
                {teamSize.toLocaleString("en-CA")}
              </span>{" "}
              team {teamSize === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </div>

      {next ? (
        <div className="relative mt-5 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
            <p className="font-medium text-brand-900">
              Refer more to reach{" "}
              <span className="font-bold">{next.label}</span>
            </p>
            <p className="shrink-0 tabular-nums text-neutral-600">
              {membersToNext} more
            </p>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-moss-100 ring-1 ring-brand-300/20"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress to ${next.label}`}
          >
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-[width]",
                current.accent
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-neutral-600">
            Grow your network to unlock higher ranks —{" "}
            <Link
              href="/dashboard/team"
              className="font-semibold text-brand-700 underline-offset-2 hover:underline"
            >
              view your team
            </Link>{" "}
            and share your invite link.
          </p>
        </div>
      ) : (
        <p className="relative mt-4 text-sm font-medium text-brand-800">
          You&apos;ve reached the top rank — Director. Keep growing your team
          and leading the network.
        </p>
      )}
    </div>
  );
}
