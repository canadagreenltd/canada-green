import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/public/section-heading";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Canada Green terms of use — placeholder pending legal review.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <SectionHeading eyebrow="Legal" title="Terms of Use" />
      <div className="mt-2 rounded-2xl border border-brand-300/40 bg-brand-50 p-5 text-sm leading-relaxed text-neutral-700">
        <p className="font-semibold text-neutral-900">Placeholder notice</p>
        <p className="mt-2">
          Full Terms &amp; Conditions will be published prior to public launch.
          Contact us with any questions in the meantime at{" "}
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
      <p className="mt-8 text-sm leading-relaxed text-neutral-600">
        Until the full document is live: by browsing this site you acknowledge
        that project information is for informational purposes, expected returns
        are not guarantees, and capital may be at risk. Nothing here constitutes
        legal, tax, or investment advice.
      </p>
    </section>
  );
}
