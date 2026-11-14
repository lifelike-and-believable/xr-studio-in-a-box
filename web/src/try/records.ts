import 'server-only';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { db } from '../db/client';
import { writeTrialMark } from '../record/commands';
import { appMeta } from '../db/schema';
import { tryMode } from './mode';
import { tutorialById } from './starting-points';

// app_meta's key for the trial-copy mark (trying-the-product#AC-4). web/scripts/try.mjs and
// web/scripts/run-e2e.mjs write the same row.
export const TRIAL_MARK = 'trial-copy';

// XR Studio's own tables, emptied by name (trying-the-product#AC-15). app_meta keeps the mark; a
// unit test checks this list against the schema, so a new table cannot be missed.
export const APP_TABLES: readonly string[] = [
  'auth_user',
  'session',
  'account',
  'verification',
  'passkey',
  'person',
  'organisation',
  'organisation_steward',
  'project',
  'project_role',
  'project_role_removed',
  'invitation',
  'email_send',
  'sign_in_request',
  'fact_version',
  'stored_file',
  'upload',
  'identifier_format',
  'identifier_confirmation',
  'activity_entry',
  'approval_assignment',
  'review_item',
  'review_decision',
  'review_recommendation',
  'work',
  'work_feedback',
  'try_mail',
];

// What each starting point holds beyond an empty record, built with the record's own commands as
// the made-up people (design-trying-the-product, "Starting points"). The first holds nothing:
// Jordan can sign in because pnpm run try sets SIGN_IN_FIRST_ADDRESSES.
const BUILDERS: Record<string, () => Promise<void>> = {
  'tutorial-try-xr-studio-in-a-trial-copy': async () => {},
};

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

export async function isMarked(): Promise<boolean> {
  const rows = await db().select({ key: appMeta.key }).from(appMeta).where(eq(appMeta.key, TRIAL_MARK)).limit(1);
  return rows.length > 0;
}

export async function markTrialCopy(): Promise<void> {
  refuseOutsideTryMode();
  await asOwner(async (pool) => {
    const held = await pool.query(
      'select (select count(*) from person) + (select count(*) from organisation) + (select count(*) from project) as n',
    );
    if (Number(held.rows[0]?.n ?? 0) > 0) throw new Error('trial copy: the database holds a record, so it is not marked as a trial copy');
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
