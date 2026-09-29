import type { MetadataRoute } from "next";
import { projects } from "@/lib/mock-data/projects";
import { getSiteUrl } from "@/lib/supabase/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  // Legal stubs (/terms, /privacy, /risk-disclosure) stay reachable but are
  // excluded until counsel-reviewed copy ships.
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
