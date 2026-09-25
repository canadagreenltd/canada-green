import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  DollarSign,
  FileText,
  Leaf,
  Search,
  Shield,
  UserPlus,
  Wheat,
  Zap,
} from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { Hero } from "@/components/public/hero";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { SectorPanel } from "@/components/public/sector-panel";
import { StatBlock } from "@/components/public/stat-block";
import { StepItem } from "@/components/public/step-item";
import { TestimonialCard } from "@/components/public/testimonial-card";
import { buttonVariants } from "@/components/ui/button";
import { homeFaqs } from "@/lib/mock-data/faq";
import { getFeaturedProjects } from "@/lib/mock-data/projects";
import { testimonials } from "@/lib/mock-data/testimonials";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invest in Canada's Green Future",
  description:
    "Canada Green connects everyday Canadians with vetted EV charging and agricultural investment opportunities.",
};

const STEPS = [
  {
    title: "Create Account",
    description: "Sign up in minutes and verify your investor profile.",
    icon: UserPlus,
  },
  {
    title: "Explore Projects",
    description: "Browse vetted EV and agriculture opportunities.",
    icon: Search,
  },
  {
    title: "Invest",
    description: "Choose an amount and submit your payment securely.",
    icon: DollarSign,
  },
  {
    title: "Track Progress",
    description: "Follow funding status and project updates live.",
    icon: FileText,
  },
  {
    title: "Make an Impact",
    description: "Help build cleaner transport and stronger farms.",
    icon: Leaf,
  },
];

const CHECKLIST = [
  "Carefully vetted projects across both sectors",
  "Transparent, regularly updated project data",
  "Simple, secure investment process",
  "Support for Canadian jobs and rural/urban communities",
  "Focused on measurable environmental impact",
];

export default function HomePage() {
  const featured = getFeaturedProjects(4);

  return (
    <>
      <Hero
        image="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1920&q=80"
        imageAlt="Canadian mountain landscape at dusk"
        eyebrow="Crowdfunding for a Sustainable Canada"
        title={
          <>
            Invest in Canada&apos;s{" "}
            <span className="text-brand-300">Green Future</span>
          </>
        }
        description="Canada Green connects everyday Canadians with vetted EV charging and agricultural investment opportunities — building cleaner transportation and stronger farms, one project at a time."
        primaryCta={{ label: "Explore Opportunities", href: "/projects" }}
        secondaryCta={{ label: "How It Works", href: "/how-it-works" }}
      >
        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/20 sm:p-5">
          {[
            { value: "8", label: "Vetted Projects" },
            { value: "2", label: "Sectors" },
            { value: "Open", label: "Now Onboarding Investors" },
            { value: "100%", label: "Canada-Focused" },
          ].map((stat) => (
            <div key={stat.label} className="px-2 text-center sm:px-4">
              <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] tracking-wide text-white/70 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Hero>

      {/* Sector split */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Where Your Investment Goes"
            title="Two Sectors. One Mission."
            description="Channel capital into the infrastructure and farmland shaping Canada's sustainable economy."
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal delay={0.1}>
            <SectorPanel
              href="/ev"
              sector="ev"
              icon={Zap}
              image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80"
              imageAlt="Electric vehicle charging station"
              title="Power the Road Ahead"
              description="Invest in Canada's growing EV charging network — from urban fast-charging hubs to highway corridors."
              cta="Explore EV Projects"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <SectorPanel
              href="/agriculture"
              sector="agriculture"
              icon={Wheat}
              image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
              imageAlt="Canadian farmland at golden hour"
              title="Grow What Matters"
              description="Support Canadian farms and agri-innovation — from vertical farming to sustainable land development."
              cta="Explore Agriculture Projects"
            />
          </Reveal>
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Featured Opportunities"
              title="Vetted Projects. Real Impact."
              description="Browse a curated mix of EV and agriculture investment opportunities across Canada."
              action={
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
                >
                  View All Projects
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Simple & Transparent"
              title="How Investing Works"
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {STEPS.map((step, i) => (
                <StepItem
                  key={step.title}
                  step={i + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  showConnector={i < STEPS.length - 1}
                />
              ))}
            </div>
          </Reveal>
          <div className="mt-12 flex justify-center">
            <Link
              href="/signup"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start Investing
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact strip */}
      <section className="relative isolate overflow-hidden py-20">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
          alt="Canadian forest canopy"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-950/80" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="More Than Just Returns"
              title="A Cleaner Grid. A Stronger Harvest."
              description="Every investment on Canada Green is designed to move capital toward measurable Canadian outcomes."
              light
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-4 grid grid-cols-2 divide-neutral-200/0 border-white/10 md:grid-cols-4 md:divide-x md:divide-white/20">
              <StatBlock value="2" label="Investment Sectors" light />
              <StatBlock value="1,000+" label="Investor Goal" light />
              <StatBlock value="100%" label="Canada-Focused Projects" light />
              <StatBlock
                value={<Leaf className="mx-auto size-9 text-brand-300" />}
                label="Measurable Impact"
                light
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Canada Green */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Why Canada Green?"
              title="Investing Made Simple, Secure, Sustainable"
              description="We built a platform that treats everyday investors with the clarity institutions expect — without the jargon."
            />
            <ul className="mt-2 space-y-3">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-8"
              )}
            >
              Learn About Us
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80"
                  alt="Canadian investor outdoors"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                <p className="absolute right-6 bottom-24 font-script text-3xl text-white md:text-4xl">
                  Invest Today. Build Tomorrow.
                </p>
              </div>
              <div className="absolute -bottom-4 left-4 flex max-w-xs items-center gap-3 rounded-xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] md:left-8">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <Shield className="size-5" />
                </span>
                <p className="text-sm font-semibold text-neutral-900">
                  Secure & Transparent Platform
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What Our Investors Say"
              title="Real People. Real Impact."
              align="center"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 lg:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Questions?"
            title="Frequently Asked Questions"
            align="center"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion items={homeFaqs} />
        </Reveal>
        <p className="mt-8 text-center text-sm text-neutral-600">
          Still curious?{" "}
          <Link href="/faq" className="font-semibold text-brand-700 hover:underline">
            View all FAQs
          </Link>
        </p>
      </section>

      <CtaBanner
        title="Ready to Build a Greener Canada?"
        description="Join Canadians investing in the infrastructure and farms of tomorrow."
        ctaLabel="Get Started Now"
        ctaHref="/signup"
        image="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80"
        imageAlt="Moraine Lake and Canadian Rockies"
      />
    </>
  );
}
