import type { Metadata } from "next";
import { ProjectsBrowser } from "@/components/public/projects-browser";

export const metadata: Metadata = {
  title: "All Investment Opportunities",
  description:
    "Browse vetted EV charging and agriculture investment projects across Canada.",
};

export default function ProjectsPage() {
  return <ProjectsBrowser />;
}
