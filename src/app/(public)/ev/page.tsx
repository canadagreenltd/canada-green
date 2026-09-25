import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Landmark,
  Repeat,
} from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { Hero } from "@/components/public/hero";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { StatBlock } from "@/components/public/stat-block";
import { getProjectsBySector } from "@/lib/mock-data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charging Infrastructure",
  description:
    "Invest in Canada's growing EV charging network — urban hubs, highway corridors, and fleet depots.",
};

const WHY = [
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Growing Demand",
    text: "EV adoption is accelerating across Canada, and public charging supply still lags behind need.",
  },
  {
    icon: Landmark,
    title: "Government Support",
    text: "Federal and provincial programs continue to back charging infrastructure and clean transport.",
  },
  {
    icon: Repeat,
    title: "Recurring Revenue",
    text: "Well-sited chargers can generate usage-based income from drivers and fleet partners.",
  },
];

export default function EvPage() {
  const projects = getProjectsBySector("ev");

  return (
    <>
      <Hero
        overlay="ev"
        compact
        image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80"
        imageAlt="EV charging station at dusk"
        eyebrow="EV Charging Infrastructure"
        title="Power Canada's Electric Future"
        description="From downtown fast-charge hubs to highway corridors, invest in the network that keeps Canada moving — cleaner, farther, and more reliably."
        primaryCta={{ label: "View EV Projects", href: "/projects" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The Opportunity"
            title="Why Invest in EV Charging?"
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {WHY.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="card-elevated p-6">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-ev-100 text-ev-700">
                  <item.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Featured EV Projects"
              title="Charge the Transition"
              description="Curated charging opportunities across urban, corridor, and fleet use cases."
              action={
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ev-700"
                >
                  All Projects
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ev-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="EV Impact"
              title="Infrastructure That Moves Canada"
              light
              align="center"
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-white/20">
            <StatBlock value="120+" label="Chargers Planned" light />
            <StatBlock value="18" label="Target Locations" light />
            <StatBlock value="4.2kt" label="CO₂ Reduced / Year*" light />
            <StatBlock value="24/7" label="Network Ambition" light />
          </div>
          <p className="mt-8 text-center text-xs text-white/50">
            *Illustrative estimates based on modeled utilization — not guaranteed outcomes.
          </p>
        </div>
      </section>

      <CtaBanner
        title="Explore All EV Opportunities"
        description="Find the charging project that matches your goals and timeline."
        ctaLabel="Browse EV Projects"
        ctaHref="/projects"
        image="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&q=80"
        imageAlt="Electric car charging"
      />
    </>
  );
}
