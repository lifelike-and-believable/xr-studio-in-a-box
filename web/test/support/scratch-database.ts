import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// A database of its own, migrated, for a test that empties every table: the other test files
// share DATABASE_URL and run at the same time.
export async function scratchDatabase(): Promise<{ url: string; drop: () => Promise<void> }> {
  const base = new URL(process.env.DATABASE_URL ?? '');
  const name = `xr_scratch_${randomBytes(6).toString('hex')}`;
  const admin = new Pool({ connectionString: base.toString() });
  await admin.query(`create database ${name}`);
  const url = new URL(base);
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString() });
  await migrate(drizzle({ client: pool }), { migrationsFolder: path.resolve(import.meta.dirname, '../../drizzle') });
  await pool.end();
  return {
    url: url.toString(),
    drop: async () => {
      await admin.query(`drop database if exists ${name} with (force)`);
      await admin.end();
    },
  };
}
