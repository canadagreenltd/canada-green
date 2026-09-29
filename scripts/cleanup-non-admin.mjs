/**
 * Pre-launch DB wipe: keep admin profiles only; delete all other users + related data.
 *
 * Removes:
 * - Non-admin auth.users (cascades to profiles → payments, tickets, commissions, rewards)
 * - All audit_logs
 * - Receipt files in storage for deleted users
 *
 * Keeps: admin auth user(s) + admin profile(s), schema/migrations
 *
 * Safety: requires CONFIRM=YES
 *
 *   CONFIRM=YES npm run db:cleanup
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./load-env.mjs";

loadEnv();

if (process.env.CONFIRM?.trim() !== "YES") {
  console.error("Refusing to run without CONFIRM=YES");
  console.error("Example:  $env:CONFIRM='YES'; npm run db:cleanup");
  process.exit(1);
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllAuthUsers() {
  const users = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 200) break;
  }
  return users;
}

async function removeReceiptFolder(userId) {
  const { data: files, error } = await supabase.storage
    .from("receipts")
    .list(userId, { limit: 1000 });
  if (error) {
    // Folder may not exist
    if (!/not found|404/i.test(error.message)) {
      console.warn(`  storage list ${userId}: ${error.message}`);
    }
    return;
  }
  if (!files?.length) return;
  const paths = files.map((f) => `${userId}/${f.name}`);
  const { error: removeError } = await supabase.storage
    .from("receipts")
    .remove(paths);
  if (removeError) {
    console.warn(`  storage remove ${userId}: ${removeError.message}`);
  }
}

async function main() {
  console.log("Loading admin profile ids…");
  const { data: admins, error: adminErr } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("role", "admin");

  if (adminErr) throw adminErr;
  if (!admins?.length) {
    console.error("No admin profiles found. Aborting (would wipe everything).");
    console.error("Create an admin first: npm run db:create-admin");
    process.exit(1);
  }

  const adminIds = new Set(admins.map((a) => a.id));
  console.log(
    `Keeping ${admins.length} admin(s): ${admins.map((a) => a.email).join(", ")}`
  );

  const authUsers = await listAllAuthUsers();
  const toDelete = authUsers.filter((u) => !adminIds.has(u.id));

  console.log(
    `Auth users: ${authUsers.length} total, ${toDelete.length} non-admin to delete`
  );

  for (const u of toDelete) {
    console.log(`Deleting ${u.email || u.id}…`);
    await removeReceiptFolder(u.id);
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    if (error) throw error;
  }

  // Clear test audit trail
  const { error: auditErr } = await supabase
    .from("audit_logs")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (auditErr) throw auditErr;
  console.log("Cleared audit_logs.");

  // Safety: remove any leftover non-admin profiles (should already be gone)
  const { data: leftover, error: leftErr } = await supabase
    .from("profiles")
    .select("id, email, role")
    .neq("role", "admin");
  if (leftErr) throw leftErr;

  if (leftover?.length) {
    console.log(`Removing ${leftover.length} leftover non-admin profile(s)…`);
    for (const p of leftover) {
      await removeReceiptFolder(p.id);
      const { error } = await supabase.auth.admin.deleteUser(p.id);
      if (error) {
        // Profile without auth row — delete profile directly
        const { error: pErr } = await supabase
          .from("profiles")
          .delete()
          .eq("id", p.id);
        if (pErr) throw pErr;
      }
    }
  }

  const { count: profileCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  const { count: paymentCount } = await supabase
    .from("payment_submissions")
    .select("*", { count: "exact", head: true });
  const { count: ticketCount } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true });
  const { count: commissionCount } = await supabase
    .from("referral_commissions")
    .select("*", { count: "exact", head: true });

  console.log("\nCleanup complete.");
  console.log(`  profiles:              ${profileCount ?? "?"}`);
  console.log(`  payment_submissions:   ${paymentCount ?? "?"}`);
  console.log(`  support_tickets:       ${ticketCount ?? "?"}`);
  console.log(`  referral_commissions:  ${commissionCount ?? "?"}`);
  console.log("Admins remaining:");
  for (const a of admins) {
    console.log(`  - ${a.email} (${a.id})`);
  }
}

main().catch((err) => {
  console.error("\nCleanup failed:");
  console.error(err.message || err);
  process.exit(1);
});
