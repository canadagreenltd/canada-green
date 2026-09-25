import type { Metadata } from "next";
import { FaqPageContent } from "@/components/public/faq-page-content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about investing on Canada Green — eligibility, payments, returns, and security.",
};

export default function FaqPage() {
  return <FaqPageContent />;
}
