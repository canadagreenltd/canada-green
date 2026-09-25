"use client";

import { FaqAccordion } from "@/components/public/faq-accordion";
import { SectionHeading } from "@/components/public/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faqCategories } from "@/lib/mock-data/faq";

export function FaqPageContent() {
  return (
    <>
      <section className="border-b border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center lg:px-6">
          <SectionHeading
            eyebrow="Help Centre"
            title="Frequently Asked Questions"
            description="Straight answers about how Canada Green works — with the same honest tone we use on every project page."
            align="center"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-6">
        <Tabs defaultValue={faqCategories[0].id}>
          <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1">
            {faqCategories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="px-3">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {faqCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <FaqAccordion items={cat.items} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </>
  );
}
