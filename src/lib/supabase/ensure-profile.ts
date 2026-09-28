import { createClient } from "@/lib/supabase/client";
import type { ProfileRole } from "@/types/database";

export type EnsuredProfile = {
  id: string;
  role: ProfileRole;
  full_name: string;
  email: string;
  referral_code: string;
};

/**
 * Ensures the signed-in user has a public.profiles row.
 * Safe to call on every login / auth callback.
 */
export async function ensureClientProfile(): Promise<EnsuredProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("ensure_my_profile");

  if (error) {
    console.error("ensure_my_profile:", error.message);
    return null;
  }

  // rpc may return object or array depending on PostgREST typing
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id) return null;

  return {
    id: row.id,
    role: row.role === "admin" ? "admin" : "user",
    full_name: row.full_name ?? "",
    email: row.email ?? "",
    referral_code: row.referral_code ?? "",
  };
}
