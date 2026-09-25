import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/public/section-heading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Canada Green privacy policy — placeholder pending legal review.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <SectionHeading eyebrow="Legal" title="Privacy Policy" />
      <div className="mt-2 rounded-2xl border border-brand-300/40 bg-brand-50 p-5 text-sm leading-relaxed text-neutral-700">
        <p className="font-semibold text-neutral-900">Placeholder notice</p>
        <p className="mt-2">
          Full Privacy Policy will be published prior to public launch. Contact
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
      <p className="mt-8 text-sm leading-relaxed text-neutral-600">
        In the interim, we only intend to collect information needed to operate
        the platform and meet regulatory obligations. We do not sell personal
        data. Detailed retention, cookies, and rights disclosures will appear
        here before launch.
      </p>
    </section>
  );
}
