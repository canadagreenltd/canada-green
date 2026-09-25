import Image from "next/image";
import { MapPin } from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { Hero } from "@/components/public/hero";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { StatBlock } from "@/components/public/stat-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "See how Canada Green investments support EV infrastructure and Canadian agriculture.",
};

const LOCATIONS = [
  { city: "Toronto, ON", focus: "Fast-charge hub" },
  { city: "Kelowna, BC", focus: "Vertical farm" },
  { city: "Highway 401, ON", focus: "Charging corridor" },
  { city: "Saskatoon, SK", focus: "Grain co-op" },
  { city: "Vancouver, BC", focus: "Urban chargers" },
  { city: "Mirabel, QC", focus: "Berry greenhouse" },
  { city: "Calgary, AB", focus: "Fleet depot" },
  { city: "Prince Edward Island", focus: "Regenerative land" },
];

const STORIES = [
  {
    title: "Chargers where Canadians drive",
    text: "Corridor and urban charging projects aim to reduce range anxiety and support everyday EV ownership — from commuting to cross-province travel.",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1000&q=80",
  },
  {
    title: "Farms built for the next generation",
    text: "Vertical farms, storage upgrades, and regenerative land trusts help keep more food production — and more value — in Canadian communities.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&q=80",
  },
  {
    title: "Capital with a Canadian lens",
    text: "Every listed project is Canada-focused. Impact metrics will grow as projects fund and report — starting with transparent, honest baselines.",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&q=80",
  },
];

export default function ImpactPage() {
  return (
    <>
      <Hero
        compact
        image="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80"
        imageAlt="Foggy Canadian forest landscape"
        eyebrow="Measured Outcomes"
        title="Real Impact, Measured"
        description="Track the dual mission of Canada Green: electrifying mobility and strengthening the farms that feed this country."
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-ev-700 p-8 text-white md:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-ev-100 uppercase">
                EV Charging
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold md:text-3xl">
                Cleaner kilometres ahead
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <StatBlock value="120+" label="Chargers planned" light />
                <StatBlock value="18" label="Locations targeted" light />
                <StatBlock value="4.2kt" label="CO₂ model / year*" light />
                <StatBlock value="3" label="Corridor projects" light />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-agri-700 p-8 text-white md:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-agri-100 uppercase">
                Agriculture
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold md:text-3xl">
                Stronger harvests at home
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <StatBlock value="40+" label="Farms in scope*" light />
                <StatBlock value="2,800" label="Acres addressed*" light />
                <StatBlock value="18%" label="Yield uplift goal*" light />
                <StatBlock value="4" label="Agri projects live" light />
              </div>
            </div>
          </Reveal>
        </div>
        <p className="mt-6 text-center text-xs text-neutral-600">
          *Illustrative figures based on project models. Not guaranteed outcomes.
        </p>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Across Canada"
              title="Project Locations"
              description="A snapshot of where Canada Green opportunities are focused today."
              align="center"
            />
          </Reveal>
          <div className="relative mb-10 overflow-hidden rounded-3xl">
            <div className="relative aspect-[21/9] min-h-[220px]">
              <Image
                src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1600&q=80"
                alt="Aerial view representing projects across Canada"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-brand-950/45" />
              <p className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-bold text-white md:text-3xl">
                From coast to coast
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOCATIONS.map((loc, i) => (
              <Reveal key={loc.city} delay={i * 0.04}>
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-cream p-4">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  <div>
                    <p className="font-heading text-sm font-bold">{loc.city}</p>
                    <p className="text-xs text-neutral-600">{loc.focus}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Stories"
            title="What Your Investment Builds"
            align="center"
          />
        </Reveal>
        {STORIES.map((story, i) => (
          <Reveal key={story.title}>
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">
                  {story.title}
                </h3>
                <p className="mt-4 leading-relaxed text-neutral-600">
                  {story.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <CtaBanner
        title="Be part of the measured change"
        description="Explore open projects and put your capital to work across Canada."
        ctaLabel="View Projects"
        ctaHref="/projects"
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
        imageAlt="Farmland landscape"
      />
    </>
  );
}
