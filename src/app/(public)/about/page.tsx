import Image from "next/image";
import {
  Eye,
  Handshake,
  HeartHandshake,
  Scale,
  Shield,
} from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { Hero } from "@/components/public/hero";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Canada Green's mission to connect Canadians with sustainable EV and agriculture investments.",
};

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    text: "Clear project data, honest risk language, and regular updates.",
  },
  {
    icon: HeartHandshake,
    title: "Impact",
    text: "Capital directed toward cleaner mobility and stronger Canadian farms.",
  },
  {
    icon: Handshake,
    title: "Accessibility",
    text: "Designed for everyday investors — not just institutions.",
  },
  {
    icon: Shield,
    title: "Trust",
    text: "Vetted sponsors, secure processes, and responsible disclosures.",
  },
];

const TEAM = [
  {
    name: "Elena Brooks",
    role: "Chief Executive Officer",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "James Okonkwo",
    role: "Head of Investments",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Sofia Nguyen",
    role: "Director of Impact",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    name: "Daniel Cormier",
    role: "VP Partnerships",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        image="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80"
        imageAlt="Canadian mountain lake landscape"
        eyebrow="Our Mission"
        title="Building a Greener, Stronger Canada"
        description="Canada Green exists to channel everyday capital into the charging networks and agricultural systems that will define Canada's next economy."
      />

      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Vision"
            title="Two sectors. Shared prosperity."
            description="We believe Canadians should be able to invest in the infrastructure they use and the food systems they depend on — with clarity, care, and a Canada-first focus."
            align="center"
          />
        </Reveal>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Our Values"
              title="What guides every decision"
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card-elevated p-6 text-center">
                  <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <v.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-heading font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Leadership"
            title="The team behind Canada Green"
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.08}>
              <article className="card-elevated overflow-hidden">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-heading font-bold">{member.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{member.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 lg:px-6">
        <Reveal>
          <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-8">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Scale className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold">
                Compliance & regulatory notice
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Canada Green facilitates access to investment opportunities
                subject to applicable Canadian securities laws. Offerings may be
                limited by province of residence and investor category. Nothing
                on this site constitutes an offer to sell or solicitation to buy
                securities in any jurisdiction where such activity is unlawful.
                Expected returns are projections only and are not guarantees.
                Capital is at risk. Always review offering documents and seek
                independent advice if needed.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBanner
        title="Invest with purpose"
        description="Join Canadians building cleaner transport and stronger farms."
        ctaLabel="Get Started"
        ctaHref="/signup"
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
        imageAlt="Forest canopy"
      />
    </>
  );
}
