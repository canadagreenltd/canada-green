import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  FileText,
  Leaf,
  Search,
  UserPlus,
} from "lucide-react";
import { CtaBanner } from "@/components/public/cta-banner";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how investing on Canada Green works — from account creation to impact.",
};

const STEPS = [
  {
    title: "Create Your Account",
    description:
      "Register with your email, verify your identity where required, and set up your investor profile. The process is designed to be clear and compliant with applicable Canadian securities rules.",
    icon: UserPlus,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80",
  },
  {
    title: "Explore Vetted Projects",
    description:
      "Browse EV charging and agriculture opportunities. Each listing includes location, target raise, expected return ranges, term length, and risk disclosure so you can compare with confidence.",
    icon: Search,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
  },
  {
    title: "Choose and Invest",
    description:
      "Select a project and investment amount that fits your goals. Follow the payment instructions and upload your receipt through your dashboard for review.",
    icon: DollarSign,
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&q=80",
  },
  {
    title: "Track Progress",
    description:
      "Monitor funding status, project updates, and your portfolio from one dashboard. We emphasize transparency so you always know where capital is going.",
    icon: FileText,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  },
  {
    title: "Make a Measurable Impact",
    description:
      "Your capital helps build chargers, farms, and food systems across Canada. Returns are never guaranteed — impact and outcomes depend on each project's performance.",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <p className="text-xs font-bold tracking-[0.22em] text-brand-300 uppercase">
            Simple & Transparent
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
            How Canada Green Works
          </h1>
          <p className="mt-4 text-white/80">
            Five clear steps from curious Canadian to active investor — without
            the noise.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-20 px-4 py-20 lg:px-6">
        {STEPS.map((step, i) => {
          const reverse = i % 2 === 1;
          return (
            <Reveal key={step.title}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-brand-700 font-heading text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <step.icon className="size-5" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <SectionHeading
            title="Still have questions?"
            description="Browse our full FAQ for eligibility, payments, returns, and security."
            align="center"
          />
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline"
          >
            Visit the FAQ
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <CtaBanner
        title="Ready to take the first step?"
        description="Create your account and explore open opportunities today."
        ctaLabel="Get Started"
        ctaHref="/signup"
        image="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80"
        imageAlt="Canadian Rockies landscape"
      />
    </>
  );
}
