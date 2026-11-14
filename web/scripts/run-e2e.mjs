// Runs the Playwright suite with the settings slice 1 needs. Playwright passes process.env to
// the app servers it starts, so the app and the tests share one mail capture folder and one
// list of first addresses. The auth secret is made fresh for each run and is never stored.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

export const FIRST_ADDRESSES = [
  'jordan@xr.test',
  'morgan@xr.test',
  'solo@xr.test',
  'empty@xr.test',
  'keys@xr.test',
  'access@xr.test',
];

const env = {
  ...process.env,
  MAIL_CAPTURE_DIR: process.env.MAIL_CAPTURE_DIR || mkdtempSync(path.join(tmpdir(), 'xr-mail-')),
  SIGN_IN_FIRST_ADDRESSES: process.env.SIGN_IN_FIRST_ADDRESSES || FIRST_ADDRESSES.join(', '),
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || randomBytes(32).toString('hex'),
  // The suite reaches the app as 127.0.0.1, and as localhost for passkeys, which need a domain name.
  APP_ORIGINS: process.env.APP_ORIGINS || 'http://127.0.0.1:3100,http://localhost:3100,http://127.0.0.1:3101',
  PASSKEY_RP_ID: process.env.PASSKEY_RP_ID || 'localhost',
  PASSKEY_ORIGINS: process.env.PASSKEY_ORIGINS || 'http://localhost:3100',
  // Slice 2: uploaded files go to a fresh folder; the signing and job secrets are made per run.
  STORAGE_DIR: process.env.STORAGE_DIR || mkdtempSync(path.join(tmpdir(), 'xr-storage-')),
  STORAGE_SIGNING_SECRET: process.env.STORAGE_SIGNING_SECRET || randomBytes(32).toString('hex'),
  CRON_SECRET: process.env.CRON_SECRET || randomBytes(32).toString('hex'),
};

// The try build (trying-the-product) runs against a database of its own, because Start empties
// it: made afresh for each run beside the test database, migrated, and marked as a trial copy.
async function freshTrialDatabase(base) {
  const url = new URL(base);
  const name = `${url.pathname.slice(1)}_try`;
  const admin = new pg.Pool({ connectionString: base });
  await admin.query(`drop database if exists ${name} with (force)`);
  await admin.query(`create database ${name}`);
  await admin.end();
  url.pathname = `/${name}`;
  const pool = new pg.Pool({ connectionString: url.toString() });
  await migrate(drizzle({ client: pool }), { migrationsFolder: path.resolve(import.meta.dirname, '../drizzle') });
  await pool.query("insert into app_meta (key, value) values ('trial-copy', 'yes')");
  await pool.end();
  return url.toString();
}

if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL to the test database (see .env.example).');
  process.exit(1);
}
env.TRY_E2E_DATABASE_URL = await freshTrialDatabase(process.env.DATABASE_URL);

// `pnpm run e2e -- <args>` passes a leading '--' through; Playwright does not want it.
const args = process.argv.slice(2).filter((arg, i) => !(i === 0 && arg === '--'));
const result = spawnSync('pnpm', ['exec', 'playwright', 'test', ...args], {
  stdio: 'inherit',
  env,
});
process.exit(result.status ?? 1);
