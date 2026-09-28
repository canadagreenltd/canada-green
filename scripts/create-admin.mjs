/**
 * Create the bootstrap admin user via Auth Admin API, then set profiles.role = 'admin'.
 * Safe to re-run: if the user already exists, ensures role is admin and exits 0.
 *
 * Required env: ADMIN_EMAIL, ADMIN_PASSWORD
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./load-env.mjs";

loadEnv();

const ADMIN_EMAIL = requireEnv("ADMIN_EMAIL").trim().toLowerCase();
const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");

if (ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const found = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

async function ensureAdminRole(userId) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId)
      .select("id, email, role, referral_code")
      .maybeSingle();

    if (error) throw error;
    if (data?.role === "admin") return data;

    await new Promise((r) => setTimeout(r, 400));
  }

  throw new Error(
    `Profile row not found for user ${userId}. Did migrations run? (npm run db:migrate)`
  );
}

async function main() {
  console.log(`Ensuring admin user: ${ADMIN_EMAIL}`);

  let user = await findUserByEmail(ADMIN_EMAIL);
  let created = false;

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Canada Green Admin",
        // Bypass referral requirement in handle_new_user (bootstrap only)
        skip_referral: "true",
      },
    });

    if (error) {
      if (/already|registered|exists/i.test(error.message)) {
        user = await findUserByEmail(ADMIN_EMAIL);
        if (!user) throw error;
        console.log("Admin user already exists (create returned conflict).");
      } else {
        throw error;
      }
    } else {
      user = data.user;
      created = true;
      console.log("Admin user created.");
    }
  } else {
    console.log("Admin user already exists — skipping create.");
  }

  const profile = await ensureAdminRole(user.id);
  console.log(
    `Admin role confirmed: ${profile.email} (role=${profile.role})${created ? " [new]" : " [existing]"}`
  );
  console.log(`Admin referral code (for first user signups): ${profile.referral_code}`);
  console.log("\nLogin at /login with:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: (the ADMIN_PASSWORD from your environment)`);
  console.log(
    `\nShare signup link: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/signup?ref=${profile.referral_code}`
  );
}

main().catch((err) => {
  console.error("\ncreate-admin failed:");
  console.error(err.message || err);
  process.exit(1);
});
