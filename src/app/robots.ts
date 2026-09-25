import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Soft-launch: unfinished areas stay out of search indexes
      disallow: ["/admin", "/dashboard", "/login", "/signup", "/forgot-password", "/reset-password"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
