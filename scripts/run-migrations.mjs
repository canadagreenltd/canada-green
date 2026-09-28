/**
 * Apply all SQL files in supabase/migrations/ in filename order
 * against the remote Postgres database (SUPABASE_DB_URL).
 *
 * Why not Supabase CLI `db push`?
 * Linking a remote project requires interactive `supabase login` + access
 * token. This script is non-interactive: paste SUPABASE_DB_URL once, then
 * run `npm run db:migrate`.
 */
import fs from "fs";
import path from "path";
import pg from "pg";
import { loadEnv, requireEnv, projectRoot } from "./load-env.mjs";

loadEnv();

const dbUrl = requireEnv("SUPABASE_DB_URL");
const migrationsDir = path.join(projectRoot(), "supabase", "migrations");

async function main() {
  if (!fs.existsSync(migrationsDir)) {
    console.error(`No migrations folder at ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No .sql migration files found. Nothing to do.");
    return;
  }

  console.log(`Applying ${files.length} migration(s)…`);

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Track applied migrations (idempotent re-runs for new files only)
    await client.query(`
      create table if not exists public._migrations (
        id text primary key,
        applied_at timestamptz not null default now()
      );
    `);

    for (const file of files) {
      const { rows } = await client.query(
        `select 1 from public._migrations where id = $1`,
        [file]
      );
      if (rows.length > 0) {
        console.log(`  skip  ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`  apply ${file}…`);
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(`insert into public._migrations (id) values ($1)`, [
          file,
        ]);
        await client.query("commit");
        console.log(`  ok    ${file}`);
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }

    console.log("\nMigrations complete.");
  } catch (err) {
    console.error("\nMigration failed:");
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
