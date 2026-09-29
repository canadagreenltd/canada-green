/**
 * Shared env helpers for Supabase clients.
 * Public URL + anon key are required for browser/server clients.
 * Service role is never used here — keep it server-only elsewhere.
 */

/** Canonical production site URL when NEXT_PUBLIC_SITE_URL is unset. */
export const PRODUCTION_SITE_URL = "https://canadagreen.ca";

function isProductionRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Copy .env.local.example to .env.local and add your Supabase credentials."
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and add your Supabase credentials."
    );
  }
  return key;
}

/**
 * Site origin for auth redirects, OG metadata, robots, sitemap (no trailing slash).
 * Prefer NEXT_PUBLIC_SITE_URL. In production never fall back to localhost.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  if (isProductionRuntime()) return PRODUCTION_SITE_URL;
  return "http://localhost:3000";
}
