"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Copy, MapPin, Share2, Shield } from "lucide-react";
import { ProgressBar } from "@/components/shared/progress-bar";
import {
  FacebookIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/shared/social-icons";
import { SectorBadge, StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  formatCad,
  getFundedPercent,
  type Project,
} from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils";

export function ProjectDetailView({ project }: { project: Project }) {
  const [activeImage, setActiveImage] = useState(0);
  const funded = getFundedPercent(project);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <nav className="mb-6 text-sm text-neutral-600">
        <Link href="/" className="hover:text-brand-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/projects" className="hover:text-brand-700">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{project.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={project.images[activeImage]}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {project.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-20 w-28 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                  i === activeImage
                    ? "ring-brand-700"
                    : "ring-transparent opacity-80 hover:opacity-100"
                )}
              >
                <Image
                  src={src}
                  alt={`${project.title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SectorBadge sector={project.sector} />
            <StatusBadge status={project.status} />
            <p className="flex items-center gap-1.5 text-sm text-neutral-600">
              <MapPin className="size-3.5" />
              {project.location}
            </p>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-600">{project.description}</p>

          <Tabs defaultValue="overview" className="mt-10">
            <TabsList variant="line" className="w-full justify-start gap-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="risk">Risk Disclosure</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h2 className="font-heading text-lg font-bold">
                  Project Overview
                </h2>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {project.overview}
                </p>
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold">
                  Why It Matters
                </h2>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {project.whyItMatters}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="financials" className="mt-6 space-y-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Target Raise", formatCad(project.targetCad)],
                  ["Minimum Investment", formatCad(project.minInvestment)],
                  [
                    "Expected Return",
                    `${project.expectedReturnMin}–${project.expectedReturnMax}% p.a.`,
                  ],
                  ["Investment Term", `${project.termYears} years`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-neutral-200 bg-white p-4"
                  >
                    <dt className="text-xs tracking-wide text-neutral-600 uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 font-heading text-lg font-bold text-neutral-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div>
                <h3 className="font-heading font-bold">Use of Funds</h3>
                <ul className="mt-3 space-y-2">
                  {project.financials.useOfFunds.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
                    >
                      <span className="text-neutral-600">{row.label}</span>
                      <span className="font-semibold text-neutral-900">
                        {row.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="risk" className="mt-6">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                <h2 className="font-heading text-lg font-bold text-neutral-900">
                  Risk Disclosure
                </h2>
                <p className="mt-3 leading-relaxed text-neutral-600">
                  {project.riskDisclosure}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-6">
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
                <p className="font-heading font-semibold text-neutral-900">
                  No updates yet
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  Project sponsors will post progress updates here as milestones
                  are reached.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-end justify-between">
              <p className="font-heading text-3xl font-bold text-neutral-900">
                {funded}%
              </p>
              <p className="text-sm text-neutral-600">funded</p>
            </div>
            <ProgressBar
              percent={funded}
              sector={project.sector}
              className="mt-3"
            />
            <p className="mt-3 text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">
                {formatCad(project.raisedCad)}
              </span>{" "}
              raised of {formatCad(project.targetCad)} target
            </p>

            <ul className="mt-6 space-y-3 border-t border-neutral-200 pt-6 text-sm">
              {[
                [
                  "Expected Return",
                  `${project.expectedReturnMin}–${project.expectedReturnMax}% p.a.`,
                ],
                ["Investment Term", `${project.termYears} years`],
                ["Minimum Investment", formatCad(project.minInvestment)],
                ["Investors", String(project.investorCount)],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-4">
                  <span className="text-neutral-600">{label}</span>
                  <span className="font-semibold text-neutral-900">{value}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "mt-6 w-full"
              )}
            >
              Invest Now
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-600">
              <Shield className="size-3.5 text-brand-500" />
              Secure investment process
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 border-t border-neutral-200 pt-5">
              <Share2 className="size-4 text-neutral-600" />
              {[Copy, LinkedInIcon, XIcon, FacebookIcon].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-brand-300 hover:text-brand-700"
                  aria-label="Share"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-4 space-y-2 rounded-2xl border border-neutral-200 bg-brand-50/60 p-4 text-sm text-neutral-600">
            {[
              "Vetted project sponsor",
              "Transparent use of funds",
              "Canadian-focused opportunity",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-brand-700" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
