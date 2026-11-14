import { Pool } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { scratchDatabase } from './support/scratch-database';

// From the security review of trial copies (trying-the-product#AC-4, AC-15): the database that is
// emptied is the one that carries the mark, and a database holding anything is never marked.
const marked = await scratchDatabase();
const unmarked = await scratchDatabase();
process.env.XR_TRY = '1';
process.env.DATABASE_URL = marked.url;
process.env.DATABASE_URL_UNPOOLED = unmarked.url;

const { loadStartingPoint, markTrialCopy } = await import('../src/try/records');

const pools = [new Pool({ connectionString: marked.url }), new Pool({ connectionString: unmarked.url })];
for (const p of pools) p.on('error', () => {});
const [onMarked, onUnmarked] = pools as [Pool, Pool];

afterAll(async () => {
  await Promise.all(pools.map((p) => p.end()));
  await marked.drop();
  await unmarked.drop();
});

describe('Start empties only a marked database (trying-the-product#AC-4, AC-15)', () => {
  it('refuses when the owner connection names a database without the mark', async () => {
    await onMarked.query("insert into app_meta (key, value) values ('trial-copy', 'yes')");
    await onUnmarked.query("insert into auth_user (id, name, email, email_verified) values ('u1', 'Real', 'real@example.com', true)");
    await expect(loadStartingPoint('tutorial-try-xr-studio-in-a-trial-copy')).rejects.toThrow(/not a trial copy/);
    expect((await onUnmarked.query('select count(*)::int as n from auth_user')).rows[0].n).toBe(1);
  });

  it('does not mark a database holding anything in any of its tables', async () => {
    await expect(markTrialCopy()).rejects.toThrow(/holds/);
    expect((await onUnmarked.query("select count(*)::int as n from app_meta where key = 'trial-copy'")).rows[0].n).toBe(0);
  });
});
