import type { MetadataRoute } from "next";
import { projects } from "@/lib/mock-data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const staticRoutes = [
    "",
    "/ev",
    "/agriculture",
    "/projects",
    "/how-it-works",
    "/about",
    "/impact",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/risk-disclosure",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
