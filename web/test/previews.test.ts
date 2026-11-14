import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Pool } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { scratchDatabase } from './support/scratch-database';

// Previews (help-tutorials-and-previews#AC-15 to AC-18).
const root = path.resolve(import.meta.dirname, '../..');
const migrations = path.resolve(import.meta.dirname, '../drizzle');
const fresh = await scratchDatabase({ migrated: false });
const used = await scratchDatabase();
const storage = mkdtempSync(path.join(tmpdir(), 'xr-preview-files-'));
Object.assign(process.env, { DATABASE_URL: used.url, DATABASE_URL_UNPOOLED: used.url, STORAGE_DIR: storage });

const { preparePreviewDatabase } = await import('../src/try/preview-build');
const { originsFrom, passkeyFrom } = await import('../src/record/settings');
const { newStorageKey, readAll, receiveUpload, signUpload, storedSize, TRY_FILE_LIMIT, TRY_FILE_TOO_BIG } = await import('../src/storage/storage');

const pools = [new Pool({ connectionString: fresh.url }), new Pool({ connectionString: used.url })];
for (const p of pools) p.on('error', () => {});
const [onFresh, onUsed] = pools as [Pool, Pool];
const marked = async (pool: Pool) => (await pool.query("select 1 from app_meta where key = 'trial-copy'")).rowCount === 1;

afterAll(async () => {
  await Promise.all(pools.map((p) => p.end()));
  await fresh.drop();
  await used.drop();
});

describe('the preview workflow (help-tutorials-and-previews#AC-15)', () => {
  it('is the template, pinned to one commit, passed only the bypass secret', () => {
    const text = readFileSync(path.join(root, '.github/workflows/rfr-tutorials-preview.yml'), 'utf8');
    const pin = /rfr-tutorials-preview\.yml@([0-9a-f]{40})/.exec(text)?.[1];
    expect(pin).toBeTruthy();
    expect(text).toContain(`rules-ref: ${pin}`);
    expect(text).not.toMatch(/secrets:\s*inherit/);
    expect(text).toMatch(/secrets:\s*\n\s+RFR_PREVIEW_BYPASS: \$\{\{ secrets\.RFR_PREVIEW_BYPASS \}\}\s*$/);
  });
});

describe("the preview's build step (help-tutorials-and-previews#AC-16)", { timeout: 60_000 }, () => {
  const preview = (url: string) => ({ XR_TRY: '1', VERCEL: '1', DATABASE_URL_UNPOOLED: url });

  it('does nothing off Vercel, outside try mode, or with the production setting on', async () => {
    expect(await preparePreviewDatabase({ XR_TRY: '1', DATABASE_URL_UNPOOLED: fresh.url }, migrations)).toBe('skipped');
    expect(await preparePreviewDatabase({ VERCEL: '1', DATABASE_URL_UNPOOLED: fresh.url }, migrations)).toBe('skipped');
    expect(await preparePreviewDatabase({ ...preview(fresh.url), VERCEL_ENV: 'production' }, migrations)).toBe('skipped');
    expect(await preparePreviewDatabase({ ...preview(fresh.url), XR_PRODUCTION: '1' }, migrations)).toBe('skipped');
    expect((await onFresh.query("select count(*)::int as n from information_schema.tables where table_schema = 'public'")).rows[0].n).toBe(0);
  });

  it('stops on a database that holds anything and is not a trial copy', async () => {
    await expect(preparePreviewDatabase(preview(used.url), migrations)).rejects.toThrow(/not empty and not a trial copy/);
    expect(await marked(onUsed)).toBe(false);
  });

  it('migrates and marks an empty database', async () => {
    expect(await preparePreviewDatabase(preview(fresh.url), migrations)).toBe('prepared');
    expect(await marked(onFresh)).toBe(true);
  });

  it('empties a trial copy and marks it again', async () => {
    await onFresh.query("insert into person (id, email, name) values (gen_random_uuid(), 'riley@xr.test', 'Riley Chen')");
    expect(await preparePreviewDatabase(preview(fresh.url), migrations)).toBe('prepared');
    expect((await onFresh.query('select count(*)::int as n from person')).rows[0].n).toBe(0);
    expect(await marked(onFresh)).toBe(true);
  });
});

describe("a preview's addresses (help-tutorials-and-previews#AC-17)", () => {
  const vercel = { XR_TRY: '1', VERCEL: '1', VERCEL_URL: 'xr-abc123.vercel.app', VERCEL_BRANCH_URL: 'xr-git-try-team.vercel.app', APP_ORIGINS: 'https://xr.example.com' };

  it('come from the deployment in try mode on Vercel', () => {
    expect(originsFrom(vercel)).toEqual(['https://xr-abc123.vercel.app', 'https://xr-git-try-team.vercel.app']);
    expect(passkeyFrom(vercel)).toEqual({ rpID: 'xr-abc123.vercel.app', origins: ['https://xr-abc123.vercel.app'] });
  });

  it('come from the settings otherwise, as before', () => {
    for (const env of [{ ...vercel, XR_TRY: '' }, { ...vercel, VERCEL: '' }, { ...vercel, XR_PRODUCTION: '1' }]) {
      expect(originsFrom(env)).toEqual(['https://xr.example.com']);
    }
    expect(originsFrom({})).toEqual(['http://localhost:3000']);
    expect(passkeyFrom({ PASSKEY_RP_ID: 'xr.example.com', PASSKEY_ORIGINS: 'https://xr.example.com' })).toEqual({ rpID: 'xr.example.com', origins: ['https://xr.example.com'] });
    expect(passkeyFrom({ APP_ORIGINS: 'http://localhost:3100' })).toEqual({ rpID: 'localhost', origins: ['http://localhost:3100'] });
  });
});

describe("a preview's files (help-tutorials-and-previews#AC-18)", { timeout: 60_000 }, () => {
  it('are kept in the database, 4 MB at most, with the limit explained', async () => {
    Object.assign(process.env, { XR_TRY: '1', VERCEL: '1' });
    try {
      expect(TRY_FILE_LIMIT).toBe(4 * 1024 * 1024);
      expect(TRY_FILE_TOO_BIG).toBe('In a trial copy on the web, a file can be 4 MB at most. This limit is not in XR Studio itself.');
      const key = newStorageKey();
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      expect(await receiveUpload(await signUpload(key, 100), bytes)).toEqual({ ok: true });
      expect(await storedSize(key)).toBe(5);
      expect(Array.from(await readAll(key))).toEqual([1, 2, 3, 4, 5]);
      expect(readdirSync(storage)).toEqual([]);
      const big = newStorageKey();
      const result = await receiveUpload(await signUpload(big, TRY_FILE_LIMIT + 10), new Uint8Array(TRY_FILE_LIMIT + 1));
      expect(result).toEqual({ ok: false, status: 413, message: TRY_FILE_TOO_BIG });
      expect(await storedSize(big)).toBeNull();
    } finally {
      delete process.env.VERCEL;
    }
  });

  it('stay in the folder, with no such limit, in a local trial copy', async () => {
    Object.assign(process.env, { XR_TRY: '1' });
    delete process.env.VERCEL;
    const key = newStorageKey();
    expect(await receiveUpload(await signUpload(key, TRY_FILE_LIMIT + 10), new Uint8Array(TRY_FILE_LIMIT + 1))).toEqual({ ok: true });
    expect(readdirSync(storage)).toContain(key);
  });
});
