import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { Pool } from 'pg';

// From the security review of trial copies (trying-the-product#AC-14, design condition 2).
const TRY = 'http://127.0.0.1:3102';

let pool: Pool | undefined;
function tryDb(text: string) {
  pool ??= new Pool({ connectionString: process.env.TRY_E2E_DATABASE_URL });
  return pool.query(text);
}

test.afterAll(async () => {
  await pool?.end();
});

test('only a selection signs a browser in: not another site, not a link preview (trying-the-product#AC-14)', async () => {
  const links = async () => Number((await tryDb('select count(*)::int as n from verification')).rows[0].n);
  const before = await links();
  for (const headers of [{ 'sec-fetch-site': 'cross-site' }, { 'sec-fetch-site': 'same-site' }, {}] as Record<string, string>[]) {
    const r = await fetch(`${TRY}/try/sign-in?as=Jordan`, { redirect: 'manual', headers });
    expect(r.status, JSON.stringify(headers)).toBe(404);
    expect(await r.text()).toContain('This page is not available');
  }
  expect(await links()).toBe(before);
  const typed = await fetch(`${TRY}/try/sign-in?as=Jordan`, { redirect: 'manual', headers: { 'sec-fetch-site': 'none' } });
  expect(typed.status).toBe(307);
  expect(typed.headers.get('cache-control')).toMatch(/no-store/);
});

test('pnpm run try refuses when the production setting is on (trying-the-product#AC-1)', () => {
  const script = path.resolve(import.meta.dirname, '../scripts/try.mjs');
  for (const setting of [{ XR_PRODUCTION: '1' }, { VERCEL_ENV: 'production' }]) {
    const r = spawnSync(process.execPath, [script], {
      encoding: 'utf8',
      timeout: 60_000,
      env: { NODE_ENV: 'production', PATH: process.env.PATH ?? '', HOME: process.env.HOME ?? '', TRY_DATABASE_URL: process.env.TRY_E2E_DATABASE_URL ?? '', ...setting },
    });
    expect(r.status, JSON.stringify(setting)).not.toBe(0);
    expect(r.stderr).toMatch(/production setting/);
  }
});
