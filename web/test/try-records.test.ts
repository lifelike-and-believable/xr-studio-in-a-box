import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Pool } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { scratchDatabase } from './support/scratch-database';

// The loader empties every table, so this file runs against a database of its own. The modules
// read their settings on first use, so the settings are made before they are imported.
const scratch = await scratchDatabase();
process.env.DATABASE_URL = scratch.url;
process.env.DATABASE_URL_UNPOOLED = scratch.url;
const mailFolder = mkdtempSync(path.join(tmpdir(), 'xr-try-mail-'));
process.env.MAIL_CAPTURE_DIR = mailFolder;

const { isMarked, loadStartingPoint, markTrialCopy, TRIAL_MARK } = await import('../src/try/records');
const { listMail, mailById } = await import('../src/try/mail');
const { deliver } = await import('../src/mail/transport');
const { checkStartUp } = await import('../src/try/start-up');

const pool = new Pool({ connectionString: scratch.url });
// Dropping the scratch database ends the app's own connections to it too.
pool.on('error', () => {});
const q = (text: string, values: unknown[] = []) => pool.query(text, values);
const FIRST = 'tutorial-try-xr-studio-in-a-trial-copy';

function settings(values: Record<string, string | undefined>) {
  for (const key of ['XR_TRY', 'XR_PRODUCTION', 'VERCEL_ENV']) delete process.env[key];
  Object.assign(process.env, values);
}

beforeEach(() => settings({ XR_TRY: '1' }));

afterAll(async () => {
  await pool.end();
  await scratch.drop();
});

describe('the trial-copy mark (trying-the-product#AC-4)', () => {
  beforeAll(async () => {
    await q('delete from app_meta where key = $1', ['trial-copy']);
  });

  it('is the trial-copy row of app_meta', () => {
    expect(TRIAL_MARK).toBe('trial-copy');
  });

  it('an unmarked database is refused by the loader', async () => {
    expect(await isMarked()).toBe(false);
    await expect(loadStartingPoint(FIRST)).rejects.toThrow(/not a trial copy/);
  });

  it('is not written outside try mode, or with the production setting on', async () => {
    settings({});
    await expect(markTrialCopy()).rejects.toThrow();
    settings({ XR_TRY: '1', XR_PRODUCTION: '1' });
    await expect(markTrialCopy()).rejects.toThrow();
    settings({ XR_TRY: '1', VERCEL_ENV: 'production' });
    await expect(markTrialCopy()).rejects.toThrow();
    expect((await q('select 1 from app_meta where key = $1', ['trial-copy'])).rowCount).toBe(0);
  });

  it('is not written to a database that holds anything', async () => {
    await q("insert into person (id, email, name) values (gen_random_uuid(), 'real@example.com', 'Real Person')");
    await expect(markTrialCopy()).rejects.toThrow(/holds/);
    expect(await isMarked()).toBe(false);
    await q("delete from person where email = 'real@example.com'");
  });

  it('is written to an empty database in try mode', async () => {
    await markTrialCopy();
    expect(await isMarked()).toBe(true);
  });
});

describe('Start empties the copy and loads the first starting point (trying-the-product#AC-15, AC-10)', () => {
  it('removes every row, signs everyone out, and keeps the mark', async () => {
    if (!(await isMarked())) await markTrialCopy();
    await q("insert into auth_user (id, name, email, email_verified) values ('u1', 'Jordan', 'jordan@xr.test', true)");
    await q("insert into session (id, expires_at, token, user_id) values ('s1', now() + interval '1 day', 't1', 'u1')");
    await q("insert into person (id, email, name) values (gen_random_uuid(), 'riley@xr.test', 'Riley Chen')");
    await q("insert into organisation (id, name) values ('00000000-0000-4000-8000-000000000001', 'Made-up Studio')");
    await q("insert into activity_entry (id, organisation_id, actor_kind, area, what) values (gen_random_uuid(), '00000000-0000-4000-8000-000000000001', 'person', 'organisation', 'Made the organisation')");
    await deliver({ to: 'riley@xr.test', subject: 'Hello', text: 'Hi' });
    await loadStartingPoint(FIRST);
    for (const table of ['auth_user', 'session', 'person', 'organisation', 'try_mail', 'activity_entry']) {
      expect((await q(`select count(*)::int as n from ${table}`)).rows[0].n, table).toBe(0);
    }
    expect(await isMarked()).toBe(true);
  });

  it('refuses outside try mode, whatever the mark says', async () => {
    settings({ XR_TRY: '1', XR_PRODUCTION: '1' });
    await expect(loadStartingPoint(FIRST)).rejects.toThrow();
    settings({});
    await expect(loadStartingPoint(FIRST)).rejects.toThrow();
  });

  it('refuses a tutorial it has no starting point for', async () => {
    await expect(loadStartingPoint('tutorial-none')).rejects.toThrow();
  });
});

describe('no email leaves a trial copy (trying-the-product#AC-16)', () => {
  it('in try mode a message is kept in the database and not written to the folder', async () => {
    const before = readdirSync(mailFolder).length;
    await deliver({ to: 'morgan@xr.test', subject: 'Kept', text: 'Open http://127.0.0.1:3102/x' });
    expect(readdirSync(mailFolder).length).toBe(before);
    const kept = await listMail();
    const mine = kept.find((m) => m.subject === 'Kept');
    expect(mine?.to).toBe('morgan@xr.test');
    expect(mine?.text).toBe('Open http://127.0.0.1:3102/x');
    expect(mine?.sentAt).toBeInstanceOf(Date);
    expect((await mailById(mine?.id ?? ''))?.subject).toBe('Kept');
  });

  it('lists the newest first, and finds nothing for an id that is not a message', async () => {
    await deliver({ to: 'sam@xr.test', subject: 'Later', text: 'x' });
    const kept = await listMail();
    expect(kept[0]?.subject).toBe('Later');
    expect(await mailById('not-an-id')).toBeUndefined();
    expect(await mailById('00000000-0000-4000-8000-000000000000')).toBeUndefined();
  });

  it('outside try mode the folder transport is used, as before', async () => {
    settings({});
    const before = readdirSync(mailFolder).length;
    await deliver({ to: 'someone@xr.test', subject: 'Sent', text: 'x' });
    expect(readdirSync(mailFolder).length).toBe(before + 1);
  });
});

describe('start-up checks (trying-the-product#AC-5)', () => {
  it('a production instance refuses a database marked as a trial copy', async () => {
    const log = vi.fn();
    await expect(checkStartUp({ XR_PRODUCTION: '1' }, async () => true, log)).rejects.toThrow(/trial copy/);
    await expect(checkStartUp({ VERCEL_ENV: 'production' }, async () => true, log)).rejects.toThrow(/trial copy/);
    await expect(checkStartUp({ XR_PRODUCTION: '1' }, async () => false, log)).resolves.toBeUndefined();
    await expect(checkStartUp({}, async () => true, log)).resolves.toBeUndefined();
  });

  it('logs an error naming both settings when the trying and production settings are both on', async () => {
    const log = vi.fn();
    await checkStartUp({ XR_TRY: '1', XR_PRODUCTION: '1' }, async () => false, log);
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/XR_TRY.*production|production.*XR_TRY/));
    const quiet = vi.fn();
    await checkStartUp({ XR_TRY: '1' }, async () => false, quiet);
    expect(quiet).not.toHaveBeenCalled();
  });
});
