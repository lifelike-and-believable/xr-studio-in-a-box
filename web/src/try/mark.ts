import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { appMeta } from '../db/schema';

// app_meta's key for the trial-copy mark (trying-the-product#AC-4). web/scripts/try.mjs,
// web/scripts/run-e2e.mjs and writeTrialMark in the command layer write the same row. Kept apart
// from the loader, so the start-up and health checks of an ordinary build do not bring it in.
export const TRIAL_MARK = 'trial-copy';

export async function isMarked(): Promise<boolean> {
  const rows = await db().select({ key: appMeta.key }).from(appMeta).where(eq(appMeta.key, TRIAL_MARK)).limit(1);
  return rows.length > 0;
}
