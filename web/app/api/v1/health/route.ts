import { connection } from 'next/server';
import { db } from '@/db/client';
import { appMeta } from '@/db/schema';
import { checkHealth } from '@/health/check';

export async function GET() {
  await connection();
  // Reading app_meta shows the database is reachable and migrated.
  const { httpStatus, body } = await checkHealth(() => db().select().from(appMeta).limit(1));
  return Response.json(body, { status: httpStatus });
}
