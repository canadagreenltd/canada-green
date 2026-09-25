import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/public/section-heading";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description:
    "Important risk disclosure for Canada Green investment opportunities.",
};

export default function RiskDisclosurePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <SectionHeading eyebrow="Legal" title="Risk Disclosure" />
      <div className="mt-2 rounded-2xl border border-brand-300/40 bg-brand-50 p-5 text-sm leading-relaxed text-neutral-700">
        <p className="font-semibold text-neutral-900">Placeholder notice</p>
        <p className="mt-2">
          Full Risk Disclosure will be published prior to public launch. Contact
          us with any questions in the meantime at{" "}
          <a
            href="mailto:hello@canadagreen.ca"
            className="font-medium text-brand-700 underline"
          >
            hello@canadagreen.ca
          </a>{" "}
          or via our{" "}
          <Link href="/contact" className="font-medium text-brand-700 underline">
            contact form
          </Link>
          .
        </p>
      </div>
      <div className="mt-8 space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-sm leading-relaxed text-neutral-700">
        <p>
          Investing involves risk, including the possible loss of capital.
          Expected returns shown on Canada Green are projections based on
          project models — they are <strong>not guarantees</strong>.
        </p>
        <p>
          Outcomes depend on construction, utilization, markets, weather (for
          agriculture), regulation, and sponsor performance. Offerings may be
          limited by province of residence and investor category. Always read
          each project&apos;s risk disclosure and offering documents before
          investing.
        </p>
      </div>
    </section>
  );
}
