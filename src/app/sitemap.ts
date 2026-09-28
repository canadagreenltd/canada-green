import type { MetadataRoute } from "next";
import { projects } from "@/lib/mock-data/projects";

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const isProd =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  if (isProd) {
    // Prefer setting NEXT_PUBLIC_SITE_URL on Vercel; fallback avoids localhost in prod XML
    return "https://canadagreen.ca";
  }

  return "http://localhost:3000";
}

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
