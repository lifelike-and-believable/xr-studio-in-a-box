import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { appMeta } from '../db/schema';
import { productionSetting } from '../try/mode';
import { TRIAL_MARK } from '../try/mark';
import { MARKED_IN_PRODUCTION } from '../try/start-up';

// Reading app_meta shows the database is reachable and migrated. A production instance on a
// database that was a trial copy is unhealthy (trying-the-product#AC-5).
export async function probeDatabase(): Promise<void> {
  const marked = await db().select().from(appMeta).where(eq(appMeta.key, TRIAL_MARK)).limit(1);
  if (marked.length > 0 && productionSetting()) throw new Error(MARKED_IN_PRODUCTION);
}
