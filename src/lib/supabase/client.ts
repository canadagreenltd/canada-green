import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for Client Components.
 * Replace with real env vars once Supabase is configured.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
