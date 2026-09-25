import Link from "next/link";
import { ArrowRight, Cpu, Leaf, Wheat } from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { Hero } from "@/components/public/hero";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { StatBlock } from "@/components/public/stat-block";
import { getProjectsBySector } from "@/lib/mock-data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agriculture Development",
  description:
    "Support Canadian farms and agri-innovation — vertical farming, regenerative land, and food security.",
};

const WHY = [
  {
    icon: Wheat,
    title: "Food Security",
    text: "Strengthening domestic production reduces import dependence and builds resilient local supply.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    text: "Regenerative and controlled-environment methods protect soil, water, and long-term yield.",
  },
  {
    icon: Cpu,
    title: "AgTech Innovation",
    text: "From vertical farms to smart storage, technology is unlocking new Canadian agricultural capacity.",
  },
];

export default function AgriculturePage() {
  const projects = getProjectsBySector("agriculture");

  return (
    <>
      <Hero
        overlay="agri"
        compact
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
        imageAlt="Golden Canadian farmland"
        eyebrow="Agriculture Development"
        title="Grow Canada's Agricultural Future"
        description="Invest in farms, greenhouses, and land stewardship projects that feed communities and keep Canadian agriculture competitive for the next generation."
        primaryCta={{ label: "View Agriculture Projects", href: "/projects" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The Opportunity"
            title="Why Invest in Agriculture?"
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {WHY.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="card-elevated p-6">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-agri-100 text-agri-700">
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
              eyebrow="Featured Agriculture Projects"
              title="Cultivate Opportunity"
              description="From prairie co-ops to vertical farms — projects rooted in Canadian soil and innovation."
              action={
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-agri-700"
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

      <section className="bg-agri-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Agriculture Impact"
              title="Farms That Feed Tomorrow"
              light
              align="center"
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-white/20">
            <StatBlock value="40+" label="Farms Supported*" light />
            <StatBlock value="2,800" label="Acres in Scope*" light />
            <StatBlock value="18%" label="Yield Uplift Goal*" light />
            <StatBlock value="Year-round" label="Local Produce Ambition" light />
          </div>
          <p className="mt-8 text-center text-xs text-white/50">
            *Illustrative targets across listed projects — not guaranteed outcomes.
          </p>
        </div>
      </section>

      <CtaBanner
        title="Explore Agriculture Opportunities"
        description="Put capital to work where Canada grows."
        ctaLabel="Browse Agriculture Projects"
        ctaHref="/projects"
        image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
        imageAlt="Greenhouse agriculture"
      />
    </>
  );
}
