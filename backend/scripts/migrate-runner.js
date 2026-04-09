import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const command = process.argv[2];

if (command !== "up") {
  console.error("Only `up` is supported right now.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in backend/.env");
  process.exit(1);
}

const migrationsDir = path.resolve(process.cwd(), "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => /^\d+_.*\.sql$/.test(f))
  .sort((a, b) => a.localeCompare(b));

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function ensureMigrationsTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function isApplied(version) {
  const res = await client.query(
    "SELECT version FROM schema_migrations WHERE version = $1",
    [version],
  );
  return res.rowCount > 0;
}

async function markApplied(version) {
  await client.query(
    "INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING",
    [version],
  );
}

async function run() {
  await client.connect();
  await ensureMigrationsTable();

  for (const file of files) {
    const version = file.split("_")[0];
    if (await isApplied(version)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration ${file}...`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await markApplied(version);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`Migration failed: ${file}`);
      throw err;
    }
  }

  await client.end();
  console.log("Migrations complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

