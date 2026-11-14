import 'server-only';
import { Pool } from 'pg';
import { writeTrialMark } from '../record/commands';
import { BUILDERS } from './build-points';
import { APP_TABLES } from './tables';
import { isMarked, TRIAL_MARK } from './mark';
import { tryMode } from './mode';
import { tutorialById } from './starting-points';

export { isMarked, TRIAL_MARK };

export { APP_TABLES };


function refuseOutsideTryMode() {
  if (!tryMode()) throw new Error('trial copy: try mode is off');
}

// Only the loader empties tables, as the database's owner: the app's own role may not delete the
// ledgers (design-trying-the-product, "Start and the append-only records").
async function asOwner<T>(work: (pool: Pool) => Promise<T>): Promise<T> {
  const url = process.env.DATABASE_URL_UNPOOLED;
  if (!url) throw new Error('trial copy: DATABASE_URL_UNPOOLED is not set');
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    return await work(pool);
  } finally {
    await pool.end();
  }
}

export async function markTrialCopy(): Promise<void> {
  refuseOutsideTryMode();
  await asOwner(async (pool) => {
    // Anything in any of XR Studio's tables counts (design-trying-the-product, condition 1).
    const held = await pool.query(`select ${APP_TABLES.map((t) => `exists (select 1 from "${t}")`).join(' or ')} as held`);
    if (held.rows[0]?.held) throw new Error('trial copy: the database holds a record, so it is not marked as a trial copy');
    await writeTrialMark(pool);
  });
}

// Start (trying-the-product#AC-10, AC-15): empties every table and loads the tutorial's starting
// point. Emptying the auth tables signs everyone out, in every browser.
export async function loadStartingPoint(tutorialId: string): Promise<void> {
  refuseOutsideTryMode();
  const build = tutorialById(tutorialId) ? BUILDERS[tutorialId] : undefined;
  if (!build) throw new Error('trial copy: no starting point for that tutorial');
  if (!(await isMarked())) throw new Error('trial copy: this database is not a trial copy');
  await asOwner(async (pool) => {
    const client = await pool.connect();
    try {
      await client.query('begin');
      // The mark is checked again on the connection that empties, in case the two connection
      // settings name different databases.
      const marked = await client.query('select 1 from app_meta where key = $1 for update', [TRIAL_MARK]);
      if (marked.rowCount === 0) throw new Error('trial copy: this database is not a trial copy');
      await client.query(`truncate ${APP_TABLES.map((t) => `"${t}"`).join(', ')}`);
      await writeTrialMark(client);
      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  });
  await build();
}
