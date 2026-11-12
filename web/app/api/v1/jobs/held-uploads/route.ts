import { timingSafeEqual } from 'node:crypto';
import { deleteExpiredHeldUploads } from '@/record/commands';

// The scheduled job that deletes held uploads past their time (layer1-facts-identifiers-activity#AC-26).
// Vercel Cron calls it every 5 minutes with the CRON_SECRET bearer token.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret ?? ''}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Response.json({ message: 'Not allowed.' }, { status: 401 });
  }
  return Response.json(await deleteExpiredHeldUploads());
}
