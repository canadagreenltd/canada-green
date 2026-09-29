"use client";

import type { TeamNode } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

function Node({ node }: { node: TeamNode }) {
  const isDirect = node.depth === 1;
  const isRoot = node.depth === 0;
  const isIndirect = node.depth > 1;

  return (
    <li>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
          isRoot &&
            "border-brand-300/50 bg-gradient-to-r from-brand-50 to-moss-100 font-semibold text-brand-900",
          isDirect && "border-brand-300/30 bg-moss-100 text-brand-900",
          isIndirect && "border-brand-300/15 bg-white/80 text-neutral-800"
        )}
      >
        <span className="font-medium">{node.name}</span>
        {isDirect ? (
          <span className="rounded-full bg-brand-700/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-700 uppercase">
            L{node.depth} Direct
          </span>
        ) : null}
        {isIndirect ? (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
            L{node.depth} Indirect
          </span>
        ) : null}
      </div>
      {node.children.length > 0 ? (
        <ul className="mt-2 ml-2 space-y-2 border-l-2 border-brand-300/30 pl-3 sm:ml-3 sm:pl-4">
          {node.children.map((child) => (
            <Node key={child.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TeamTree({ tree }: { tree: TeamNode }) {
  return (
    <div className="space-y-4 overflow-x-auto">
      <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-moss-200 ring-1 ring-brand-300/50" />
          Direct (L1) — 5% one-time on their approved investments
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-white ring-1 ring-brand-300/30" />
          Indirect (L2+) — 1% one-time within your unlocked depth
        </span>
      </div>
      <ul className="min-w-[260px] space-y-2">
        <Node node={tree} />
      </ul>
    </div>
  );
}
