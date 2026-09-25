import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { SectionHeading } from "@/components/public/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Canada Green team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
          <SectionHeading
            eyebrow="Contact"
            title="We'd love to hear from you"
            description="Questions about projects, investing, or partnerships? Send a message and our team will follow up."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-8">
            <h2 className="font-heading text-xl font-bold">Send a message</h2>
            <p className="mt-2 text-sm text-neutral-600">
              This form is front-end only for now — submissions show a toast
              confirmation.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-heading font-bold">Contact information</h3>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-brand-500" />
                  <a
                    href="mailto:hello@canadagreen.ca"
                    className="hover:text-brand-700"
                  >
                    hello@canadagreen.ca
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 text-brand-500" />
                  <span>Toronto, Ontario — Serving investors across Canada</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1000&q=80"
                alt="Canadian city skyline representing Canada Green"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-brand-950/30" />
              <p className="absolute bottom-4 left-4 font-heading text-lg font-bold text-white">
                Proudly Canadian
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
