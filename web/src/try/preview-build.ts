// The preview's build step (help-tutorials-and-previews#AC-16). Run by web/scripts/build.mjs with
// Node's type stripping, so it imports only Node, pg, drizzle-orm and other such modules.
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { tryMode, type Env } from './mode.ts';
import { APP_TABLES } from './tables.ts';

export type PreviewBuild = 'skipped' | 'prepared';
type Owner = { query: (text: string) => Promise<unknown> };

// The mark is written by the command layer; the build script, which cannot load it, passes its own.
const commandLayerMark = async (owner: Owner) => (await import('../record/commands')).writeTrialMark(owner);

// Only a preview on Vercel in try mode: never with the production setting, never off Vercel. Every
// deployment of the pull request starts the trial copy again, at the first starting point.
export async function preparePreviewDatabase(env: Env, migrationsFolder: string, writeMark: (owner: Owner) => Promise<void> = commandLayerMark): Promise<PreviewBuild> {
  if (!tryMode(env) || env.VERCEL !== '1') return 'skipped';
  const url = env.DATABASE_URL_UNPOOLED;
  if (!url) throw new Error('trial copy: DATABASE_URL_UNPOOLED is not set for the preview');
  const pool = new pg.Pool({ connectionString: url, max: 1 });
  try {
    const tables = await pool.query<{ table_schema: string; table_name: string }>(
      "select table_schema, table_name from information_schema.tables where table_schema not in ('pg_catalog', 'information_schema')",
    );
    const hasMeta = tables.rows.some((t) => t.table_schema === 'public' && t.table_name === 'app_meta');
    const marked = hasMeta && ((await pool.query("select 1 from app_meta where key = 'trial-copy'")).rowCount ?? 0) > 0;
    if (tables.rows.length > 0 && !marked) throw new Error('trial copy: the database is not empty and not a trial copy, so the build stops');
    if (marked) {
      // XR Studio's own tables, by name, that this database has; nothing else is touched.
      const present = new Set(tables.rows.filter((t) => t.table_schema === 'public').map((t) => t.table_name));
      const own = APP_TABLES.filter((t) => present.has(t));
      if (own.length > 0) await pool.query(`truncate ${own.map((t) => `"${t}"`).join(', ')}`);
    }
    await migrate(drizzle({ client: pool }), { migrationsFolder });
    await writeMark(pool);
    return 'prepared';
  } finally {
    await pool.end();
  }
}
