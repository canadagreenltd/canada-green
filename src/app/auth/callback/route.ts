import { NextResponse } from "next/server";
import { ROLES } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_NEXT = new Set([
  "/",
  "/dashboard",
  "/admin",
  "/login",
  "/signup",
  "/reset-password",
  "/forgot-password",
]);

function sanitizeNext(next: string | null): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return "/";
  }
  if (ALLOWED_NEXT.has(next)) return next;
  if (next.startsWith("/dashboard/") || next.startsWith("/admin/")) return next;
  return "/";
}

/**
 * Exchanges the auth code from email links (signup confirm + password recovery)
 * for a session, then redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const safeNext = sanitizeNext(searchParams.get("next"));
  const type = searchParams.get("type");

  const isRecovery =
    type === "recovery" || safeNext === "/reset-password";

  const errorPath = isRecovery ? "/reset-password" : "/login";

  const errorRedirect = () => {
    const errorUrl = new URL(errorPath, origin);
    errorUrl.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(errorUrl);
  };

  if (!isSupabaseConfigured()) {
    return errorRedirect();
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Ensure profile row exists (self-heal orphans / race after signup)
        await supabase.rpc("ensure_my_profile");

        // Password recovery always goes to reset form
        if (isRecovery) {
          return NextResponse.redirect(new URL("/reset-password", origin));
        }

        // After email confirm / magic login: send admins to /admin
        if (safeNext === "/dashboard" || safeNext.startsWith("/dashboard/")) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .maybeSingle();
            if (profile?.role === ROLES.ADMIN) {
              return NextResponse.redirect(new URL("/admin", origin));
            }
          }
        }

        return NextResponse.redirect(new URL(safeNext, origin));
      }
    } catch {
      return errorRedirect();
    }
  }

  return errorRedirect();
}
