/**
 * Configure Auth via Supabase Management API (optional).
 * - mailer_autoconfirm: false → Confirm email ON (required for signup emails)
 * - site_url + uri_allow_list from NEXT_PUBLIC_SITE_URL
 *
 * If SUPABASE_ACCESS_TOKEN is missing, skips with a clear message and exits 0.
 * You can set the same options manually in the Supabase dashboard.
 */
import { loadEnv, requireEnv } from "./load-env.mjs";

loadEnv();

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "http://localhost:3000"
);

if (!accessToken) {
  console.log("Skipping auth config (SUPABASE_ACCESS_TOKEN not set).");
  console.log("");
  console.log("Do this once in the Supabase dashboard so email flows work:");
  console.log("  1. Authentication → Providers → Email → Confirm email = ON");
  console.log("  2. Authentication → URL Configuration:");
  console.log(`       Site URL: ${siteUrl}`);
  console.log(`       Redirect URLs include:`);
  console.log(`         ${siteUrl}/auth/callback`);
  console.log(`         ${siteUrl}/**`);
  console.log("         http://localhost:3000/auth/callback");
  console.log("         http://localhost:3000/**");
  console.log("");
  console.log(
    "Or create a token at https://supabase.com/dashboard/account/tokens"
  );
  console.log("  then: npm run db:configure-auth");
  process.exit(0);
}

const match = url.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co$/i);
if (!match) {
  console.error(
    `Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL: ${url}`
  );
  process.exit(1);
}

const projectRef = match[1];
const redirectAllowList = [
  `${siteUrl}/auth/callback`,
  `${siteUrl}/**`,
  "http://localhost:3000/auth/callback",
  "http://localhost:3000/**",
]
  .filter((v, i, arr) => arr.indexOf(v) === i)
  .join(",");

async function main() {
  console.log(`Updating auth config for project ${projectRef}…`);
  console.log(`  site_url:           ${siteUrl}`);
  console.log(`  mailer_autoconfirm: false (Confirm email ON)`);
  console.log(`  uri_allow_list:     ${redirectAllowList}`);

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_url: siteUrl,
        uri_allow_list: redirectAllowList,
        mailer_autoconfirm: false,
      }),
    }
  );

  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = null;
  }

  if (!res.ok) {
    console.error(`\nAuth config update failed (HTTP ${res.status}).`);
    console.error(json ? JSON.stringify(json, null, 2) : body);
    process.exit(1);
  }

  console.log("\nAuth config updated successfully.");
  console.log("Signup and forgot-password emails will now require confirmation links.");
}

main().catch((err) => {
  console.error("\nconfigure-auth failed:");
  console.error(err.message || err);
  process.exit(1);
});
