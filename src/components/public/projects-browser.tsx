"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projects, type Project } from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils";

type Filter = "all" | "ev" | "agriculture";
type Sort = "newest" | "ending" | "funded";

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "ending", label: "Ending Soon" },
  { value: "funded", label: "Most Funded" },
];

function sortProjects(list: Project[], sort: Sort): Project[] {
  const copy = [...list];
  if (sort === "newest") {
    return copy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  if (sort === "ending") {
    return copy.sort(
      (a, b) => Number(Boolean(b.endingSoon)) - Number(Boolean(a.endingSoon))
    );
  }
  return copy.sort(
    (a, b) => b.raisedCad / b.targetCad - a.raisedCad / a.targetCad
  );
}

export function ProjectsBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    const base =
      filter === "all"
        ? projects
        : projects.filter((p) => p.sector === filter);
    return sortProjects(base, sort);
  }, [filter, sort]);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort by";

  return (
    <>
      <section className="border-b border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
          <SectionHeading
            eyebrow="Marketplace"
            title="All Investment Opportunities"
            description="Explore open EV charging and agriculture projects across Canada. Filter by sector to find your fit."
          />
        </div>
      </section>

      <div className="sticky top-16 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-md lg:top-[4.25rem]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All" },
                { id: "ev", label: "EV Charging" },
                { id: "agriculture", label: "Agriculture" },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilter(pill.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  filter === pill.id
                    ? pill.id === "ev"
                      ? "bg-ev-700 text-white"
                      : pill.id === "agriculture"
                        ? "bg-agri-700 text-white"
                        : "bg-brand-700 text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-brand-300"
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>
          <Select
            value={sort}
            onValueChange={(value) => {
              if (value === "newest" || value === "ending" || value === "funded") {
                setSort(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]" aria-label="Sort projects">
              <SelectValue placeholder="Sort by">{sortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i * 0.05, 0.3)}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
