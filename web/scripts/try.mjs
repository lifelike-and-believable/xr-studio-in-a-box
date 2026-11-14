// pnpm run try (trying-the-product#AC-19, AC-20): starts a trial copy of XR Studio on this machine,
// with made-up people only, and deletes it when stopped. Written like run-e2e.mjs.
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const web = path.resolve(import.meta.dirname, '..');
const port = Number(process.env.TRY_PORT || 3000);
const cleanups = [];
let app;

function fail(message) {
  console.error(`pnpm run try could not start: ${message}`);
  cleanUp();
  process.exit(1);
}

function cleanUp() {
  if (app && app.exitCode === null) app.kill('SIGTERM');
  while (cleanups.length) {
    try {
      cleanups.pop()();
    } catch {
      // Keep removing the rest.
    }
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    cleanUp();
    console.log('The trial copy is stopped and deleted.');
    process.exit(0);
  });
}

function portIsFree(p) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(p, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port: found } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return found;
}

// PostgreSQL 18 in a container on a free port on 127.0.0.1, with a password made for this run.
async function startContainer() {
  const docker = spawnSync('docker', ['info'], { stdio: 'ignore' });
  if (docker.status !== 0) {
    fail('Docker is not running and no database was given. Start Docker, or set TRY_DATABASE_URL to the address of an empty PostgreSQL database of your own.');
  }
  const name = `xr-try-${randomBytes(4).toString('hex')}`;
  const password = randomBytes(16).toString('hex');
  const dbPort = await freePort();
  const run = spawnSync('docker', ['run', '-d', '--rm', '--name', name, '-e', 'POSTGRES_USER=xr', '-e', 'POSTGRES_PASSWORD', '-e', 'POSTGRES_DB=xr_try', '-p', `127.0.0.1:${dbPort}:5432`, 'postgres:18'], {
    // The password goes in the environment, not on the command line, where other users could read it.
    env: { ...process.env, POSTGRES_PASSWORD: password },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  if (run.status !== 0) fail('Docker could not start PostgreSQL. Check that Docker can pull postgres:18.');
  cleanups.push(() => spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore' }));
  const url = `postgres://xr:${password}@127.0.0.1:${dbPort}/xr_try`;
  for (let i = 0; i < 60; i += 1) {
    const client = new pg.Client({ connectionString: url });
    try {
      await client.connect();
      await client.end();
      return url;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  fail('PostgreSQL did not start in its container within a minute.');
}

// Empty means no table outside the system schemas; a trial copy carries the mark in app_meta
// (trying-the-product#AC-4). Anything else could be real data, so it is never migrated or marked.
async function checkDatabase(url) {
  const pool = new pg.Pool({ connectionString: url });
  try {
    const tables = await pool.query("select table_schema, table_name from information_schema.tables where table_schema not in ('pg_catalog', 'information_schema')");
    if (tables.rowCount === 0) return 'empty';
    const hasMeta = tables.rows.some((t) => t.table_schema === 'public' && t.table_name === 'app_meta');
    const marked = hasMeta && (await pool.query("select 1 from app_meta where key = 'trial-copy'")).rowCount > 0;
    if (!marked) fail('the database is not empty and not a trial copy, so it was left alone. Set TRY_DATABASE_URL to an empty database.');
    return 'marked';
  } catch {
    // The reason can include the address and its password, so it is not printed.
    fail('the database could not be reached. Check TRY_DATABASE_URL.');
  } finally {
    await pool.end();
  }
}

async function migrateAndMark(url) {
  const pool = new pg.Pool({ connectionString: url });
  try {
    await migrate(drizzle({ client: pool }), { migrationsFolder: path.join(web, 'drizzle') });
    // The first starting point holds nothing; loading it is writing the mark.
    await pool.query("insert into app_meta (key, value) values ('trial-copy', 'yes') on conflict (key) do nothing");
  } finally {
    await pool.end();
  }
}

async function waitForApp() {
  for (let i = 0; i < 60; i += 1) {
    if (app.exitCode !== null) fail('XR Studio stopped as it started; its output is above.');
    try {
      const r = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
      if (r.ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  fail('XR Studio did not answer within a minute; its output is above.');
}

// The production setting wins whatever else is set (design-trying-the-product, condition 2).
const production = process.env.XR_PRODUCTION ?? '';
if ((production !== '' && production !== '0') || process.env.VERCEL_ENV === 'production') {
  fail('the production setting (XR_PRODUCTION or VERCEL_ENV=production) is on in this shell. A trial copy is never made where it is; unset it and run pnpm run try again.');
}

if (!(await portIsFree(port))) fail(`port ${port} is in use. Stop what is using it, or set TRY_PORT to another port.`);

const url = process.env.TRY_DATABASE_URL || (await startContainer());
await checkDatabase(url);

const files = mkdtempSync(path.join(tmpdir(), 'xr-try-'));
cleanups.push(() => rmSync(files, { recursive: true, force: true }));

const address = `http://localhost:${port}`;
// Every setting the app reads is given here, empty where unused: Next.js does not override a
// variable that is already defined, so nothing in web/.env reaches the trial copy.
const env = {
  ...process.env,
  NODE_ENV: 'production',
  XR_TRY: '1',
  XR_PRODUCTION: '',
  VERCEL_ENV: '',
  DATABASE_URL: url,
  DATABASE_URL_UNPOOLED: url,
  BETTER_AUTH_SECRET: randomBytes(32).toString('hex'),
  STORAGE_SIGNING_SECRET: randomBytes(32).toString('hex'),
  CRON_SECRET: randomBytes(32).toString('hex'),
  STORAGE_DIR: files,
  MAIL_CAPTURE_DIR: '',
  SIGN_IN_FIRST_ADDRESSES: 'jordan@xr.test',
  APP_ORIGINS: `${address},http://127.0.0.1:${port}`,
  PASSKEY_RP_ID: 'localhost',
  PASSKEY_ORIGINS: address,
};

try {
  await migrateAndMark(url);
} catch {
  fail('the migrations could not be applied to the database.');
}

const build = spawnSync('pnpm', ['exec', 'next', 'build'], { cwd: web, env, stdio: 'inherit' });
if (build.status !== 0) fail('the build failed; its output is above. Fix it and run pnpm run try again.');

app = spawn('pnpm', ['exec', 'next', 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: web, env, stdio: ['ignore', 'ignore', 'inherit'] });
await waitForApp();
app.on('exit', () => {
  cleanUp();
  console.error('XR Studio stopped; the trial copy is deleted.');
  process.exit(1);
});

console.log('The trial copy is running.');
console.log(`Try XR Studio: ${address}/try`);
console.log('Press Ctrl+C to stop it and delete the trial copy.');
