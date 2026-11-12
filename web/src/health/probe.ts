import 'server-only';
import { db } from '../db/client';
import { appMeta } from '../db/schema';

// Reading app_meta shows the database is reachable and migrated.
export const probeDatabase = () => db().select().from(appMeta).limit(1);
