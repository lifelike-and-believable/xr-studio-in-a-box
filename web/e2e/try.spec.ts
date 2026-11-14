import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { Pool } from 'pg';

// Trial copies (trying-the-product). The ordinary build runs on 3100 (playwright.config.ts). A try
// build runs on 3102 against a database of its own, marked as a trial copy, and the same try build
// runs on 3103 with XR_PRODUCTION=1 and on 3104 with VERCEL_ENV=production.
const ORDINARY = 'http://127.0.0.1:3100';
const TRY = 'http://127.0.0.1:3102';
const TRY_WITH_PRODUCTION = ['http://127.0.0.1:3103', 'http://127.0.0.1:3104'];
const LINE = 'Trial copy. The people, projects and files here are made up. Do not enter real information.';
const FIRST_TUTORIAL = 'Try XR Studio in a trial copy';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

let pool: Pool | undefined;
function tryDb(text: string, values: unknown[] = []) {
  pool ??= new Pool({ connectionString: process.env.TRY_E2E_DATABASE_URL });
  return pool.query(text, values);
}

test.afterAll(async () => {
  await pool?.end();
});

async function notAvailable(base: string, method: 'GET' | 'POST', address: string, headers: Record<string, string> = {}, body?: string) {
  const r = await fetch(`${base}${address}`, { method, redirect: 'manual', headers, body });
  expect(r.status, `${method} ${base}${address}`).toBe(404);
  expect(await r.text(), `${method} ${base}${address}`).toContain('This page is not available');
}

// The server actions a build has for /try, from its manifest: the Start action in a try build, and
// none in an ordinary build.
function tryActions(dist: '.next' | '.next-try'): string[] {
  const manifest = path.resolve(import.meta.dirname, `../${dist}/server/server-reference-manifest.json`);
  const actions = (JSON.parse(readFileSync(manifest, 'utf8')) as { node: Record<string, { workers: Record<string, unknown> }> }).node;
  return Object.entries(actions)
    .filter(([, a]) => Object.keys(a.workers).some((w) => w.startsWith('app/try')))
    .map(([id]) => id);
}

const TRY_ADDRESSES = ['/try', '/try/sign-in?as=Jordan', '/try/mail', '/try/mail/00000000-0000-4000-8000-000000000000'];

test('an ordinary build has no /try route (trying-the-product#AC-2)', () => {
  const manifest = path.resolve(import.meta.dirname, '../.next/app-path-routes-manifest.json');
  expect(existsSync(manifest)).toBe(true);
  const routes = Object.values(JSON.parse(readFileSync(manifest, 'utf8')) as Record<string, string>);
  expect(routes.length).toBeGreaterThan(10);
  expect(routes.filter((r) => r.startsWith('/try'))).toEqual([]);
  const tryManifest = path.resolve(import.meta.dirname, '../.next-try/app-path-routes-manifest.json');
  const tryRoutes = Object.values(JSON.parse(readFileSync(tryManifest, 'utf8')) as Record<string, string>);
  expect(tryRoutes).toContain('/try');
});

test('outside try mode every /try address is not available (trying-the-product#AC-3)', async () => {
  for (const base of [ORDINARY, ...TRY_WITH_PRODUCTION]) {
    for (const address of TRY_ADDRESSES) await notAvailable(base, 'GET', address);
  }
  // Start is a server action: an ordinary build has none for /try, and a try build with the
  // production setting refuses its own.
  expect(tryActions('.next')).toEqual([]);
  await notAvailable(ORDINARY, 'POST', '/try', { 'content-type': 'application/x-www-form-urlencoded' }, 'tutorial=x');
  const start = tryActions('.next-try');
  expect(start.length).toBeGreaterThan(0);
  for (const base of TRY_WITH_PRODUCTION) {
    for (const id of start) {
      await notAvailable(base, 'POST', '/try', { 'next-action': id, 'content-type': 'text/plain;charset=UTF-8' }, '[]');
    }
  }
});

test('the trial line is on every page of a trial copy and only there (trying-the-product#AC-6)', async ({ page }) => {
  for (const address of ['/sign-in', '/try', '/no-such-page', '/projects']) {
    await page.goto(`${TRY}${address}`);
    // Next.js puts a hidden element of its own first in the body; the line is the first one shown.
    const band = page.locator('body > :not([hidden]):not(script)').first();
    await expect(band).toContainText(LINE);
    await expect(band.getByRole('link', { name: 'Try XR Studio', exact: true })).toHaveAttribute('href', '/try');
    await expect(band).not.toHaveAttribute('aria-live', /.+/);
    await expect(band).not.toHaveAttribute('role', 'alert');
  }
  await page.goto(`${ORDINARY}/sign-in`);
  await expect(page.getByText(LINE)).toHaveCount(0);
});

async function startFirstTutorial(page: Page) {
  await page.goto(`${TRY}/try`);
  await page.getByRole('button', { name: `Start: ${FIRST_TUTORIAL}`, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByText(`This copy now holds the starting point for ${FIRST_TUTORIAL}`)).toBeVisible();
}

test.describe.serial('Try XR Studio', () => {
  test('the page and its parts (trying-the-product#AC-7, AC-8, AC-11, AC-17)', async ({ page }) => {
    await startFirstTutorial(page);
    await page.goto(`${TRY}/try`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try XR Studio');
    const headings = await page.getByRole('heading', { level: 2 }).allTextContents();
    expect(headings).toEqual(['Choose a tutorial', 'Sign in as a person', 'Files for the tutorials', 'Email']);
    await expect(page.locator('nav[aria-label="Project"]')).toHaveCount(0);

    const table = page.getByRole('table', { name: /tutorial/i });
    await expect(table.getByRole('columnheader')).toHaveText(['Tutorial', 'For', 'Starts with', 'Start a tutorial']);
    const row = table.getByRole('row').nth(1);
    await expect(row.getByRole('link', { name: FIRST_TUTORIAL })).toHaveAttribute('href', '/help/tutorials/try-xr-studio-in-a-trial-copy');
    await expect(row).toContainText('Morgan, the director');
    await expect(row).toContainText('A new installation where Jordan can sign in');

    await expect(page.getByText('Nobody is signed in in this browser.')).toBeVisible();
    const jordan = page.getByRole('link', { name: 'Sign in as Jordan', exact: true });
    await expect(jordan).toHaveAttribute('href', '/try/sign-in?as=Jordan');
    for (const first of ['Morgan', 'Riley', 'Sam', 'Drew']) {
      await expect(page.getByRole('link', { name: `Sign in as ${first}` })).toHaveCount(0);
      await expect(page.getByText(`Not added yet. Jordan adds ${first} in the tutorial.`)).toBeVisible();
    }
    for (const role of ['Producer', 'Director', 'Artist', 'Technical artist', 'Sound designer']) {
      await expect(page.getByText(role, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('To act as two people at once, open a private window for the second person.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Email sent by this copy', exact: true })).toHaveAttribute('href', '/try/mail');
    await expect(page.getByText('No email leaves a trial copy.')).toBeVisible();
  });

  test('the Start dialog (trying-the-product#AC-9)', async ({ page }) => {
    await page.goto(`${TRY}/try`);
    const opener = page.getByRole('button', { name: `Start: ${FIRST_TUTORIAL}`, exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading')).toHaveText(`Start ${FIRST_TUTORIAL}?`);
    await expect(dialog).toContainText(
      "Everything done in this trial copy so far is replaced by the tutorial's starting point: A new installation where Jordan can sign in. Anyone else using this copy loses what they did.",
    );
    await expect(dialog.getByRole('button')).toHaveText(['Keep what is here', 'Start']);
    await expect(dialog.getByRole('button', { name: 'Keep what is here' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await opener.click();
    await dialog.getByRole('button', { name: 'Keep what is here' }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('sign in as Jordan, then Start signs everyone out (trying-the-product#AC-10, AC-12)', async ({ page }) => {
    await page.goto(`${TRY}/try`);
    await page.getByRole('link', { name: 'Sign in as Jordan', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`^${TRY}/(projects|what-needs-you)?$`));
    await expect(page.getByRole('button', { name: /Jordan Lee/ })).toBeVisible();
    await page.goto(`${TRY}/try`);
    await expect(page.getByText('Signed in as Jordan Lee.')).toBeVisible();

    await page.getByRole('button', { name: `Start: ${FIRST_TUTORIAL}`, exact: true }).click();
    const start = page.getByRole('dialog').getByRole('button', { name: 'Start', exact: true });
    await start.click();
    const notice = page.getByText(
      `This copy now holds the starting point for ${FIRST_TUTORIAL}: A new installation where Jordan can sign in. Sign in as Jordan to begin.`,
    );
    await expect(notice).toBeVisible();
    await expect(page.locator(':focus')).toContainText('This copy now holds the starting point');
    await expect(page).toHaveTitle(/^Started/);
    await expect(page.getByRole('link', { name: 'Open the tutorial', exact: true })).toBeVisible();
    await expect(page.getByText('Nobody is signed in in this browser.')).toBeVisible();
    expect((await tryDb('select count(*)::int as n from session')).rows[0].n).toBe(0);
  });

  test('a person not added yet, an unknown name, a prefetch, and no-store (trying-the-product#AC-12, AC-13, AC-14)', async ({ page }) => {
    await page.goto(`${TRY}/try/sign-in?as=Riley`);
    await expect(page.getByText('Riley is not on a project in this copy yet. Jordan adds Riley in Start a production and bring in your team.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Try XR Studio' }).last()).toHaveAttribute('href', '/try');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    for (const as of ['Alex', 'jordan@xr.test', 'jordan', '']) {
      await notAvailable(TRY, 'GET', `/try/sign-in?as=${encodeURIComponent(as)}`);
    }

    const links = async () => Number((await tryDb('select count(*)::int as n from verification')).rows[0].n);
    const before = await links();
    const prefetches: Record<string, string>[] = [{ purpose: 'prefetch' }, { 'sec-purpose': 'prefetch' }];
    for (const header of prefetches) {
      const r = await fetch(`${TRY}/try/sign-in?as=Jordan`, { redirect: 'manual', headers: header });
      expect(r.status, JSON.stringify(header)).toBe(404);
    }
    // Next.js removes Next-Router-Prefetch before the page sees it, and answers its router's
    // prefetches (RSC with Next-Router-Prefetch) without running the page.
    const routerPrefetch = await fetch(`${TRY}/try/sign-in?as=Jordan`, { redirect: 'follow', headers: { rsc: '1', 'next-router-prefetch': '1' } });
    expect(routerPrefetch.headers.get('set-cookie') ?? '').not.toMatch(/session_token/);
    expect(await links()).toBe(before);
    const r = await fetch(`${TRY}/try/sign-in?as=Jordan`, { redirect: 'manual' });
    expect(r.headers.get('cache-control')).toMatch(/no-store/);
  });

  test('email kept by the copy, and signing in as a person with an invitation (trying-the-product#AC-12, AC-16, AC-17, AC-18)', async ({ page, browser }) => {
    await startFirstTutorial(page);
    await page.goto(`${TRY}/try/mail`);
    await expect(page.getByText('No email has been sent by this copy yet.')).toBeVisible();

    await page.goto(`${TRY}/try/sign-in?as=Jordan`);
    const me = (await tryDb("select id from person where email = 'jordan@xr.test'")).rows[0].id as string;
    const org = await page.request.post(`${TRY}/api/v1/organisations`, { data: { name: 'Made-up Studio', stewardIds: [me] } });
    expect(org.ok(), await org.text()).toBe(true);
    const { id: organisationId } = (await org.json()) as { id: string };
    const project = await page.request.post(`${TRY}/api/v1/projects`, {
      data: { name: 'The Lantern Keeper', brief: '', organisationId, ownerId: me },
    });
    expect(project.ok(), await project.text()).toBe(true);
    const { id: projectId } = (await project.json()) as { id: string };
    const added = await page.request.post(`${TRY}/api/v1/projects/${projectId}/people`, {
      data: { email: 'riley@xr.test', name: 'Riley Chen', roles: ['artist'] },
    });
    expect(added.ok(), await added.text()).toBe(true);

    await page.goto(`${TRY}/try/mail`);
    const table = page.getByRole('table');
    await expect(table.getByRole('columnheader')).toHaveText(['To', 'Subject', 'Sent', 'Open a message']);
    const row = table.getByRole('row').nth(1);
    await expect(row).toContainText('riley@xr.test');
    await row.getByRole('link', { name: /^Open/ }).click();
    await expect(page.getByText('riley@xr.test')).toBeVisible();
    const link = page.getByRole('link', { name: /\/api\/v1\/invitations\// });
    await expect(link).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to email sent by this copy', exact: true })).toHaveAttribute('href', '/try/mail');
    await notAvailable(TRY, 'GET', '/try/mail/not-a-message');

    const riley = await browser.newContext();
    const rileyPage = await riley.newPage();
    await rileyPage.goto(`${TRY}/try`);
    await rileyPage.getByRole('link', { name: 'Sign in as Riley', exact: true }).click();
    await expect(rileyPage).toHaveURL(`${TRY}/what-needs-you`);
    await expect(rileyPage.getByRole('button', { name: /Riley Chen/ })).toBeVisible();
    const used = await tryDb("select used_at from invitation join person on person.id = invitation.person_id where person.email = 'riley@xr.test'");
    expect(used.rows[0].used_at).not.toBeNull();
    await riley.close();
  });

  test('Try XR Studio pages pass axe and fit 320 pixels (trying-the-product#AC-22, AC-8)', async ({ page }) => {
    test.setTimeout(120_000);
    const check = async (label: string) => {
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(results.violations, `${label}: ${results.violations.map((v) => v.id).join(', ')}`).toEqual([]);
      await page.setViewportSize({ width: 320, height: 640 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow, `${label} scrolls sideways at 320px`).toBe(false);
      await page.setViewportSize({ width: 1280, height: 800 });
      await expect(page.locator('h1')).toHaveCount(1);
    };
    await startFirstTutorial(page);
    await check('after Start');
    await page.goto(`${TRY}/try`);
    await check('/try');
    await page.getByRole('button', { name: `Start: ${FIRST_TUTORIAL}`, exact: true }).click();
    await check('the Start dialog');
    await page.keyboard.press('Escape');
    await page.goto(`${TRY}/try/mail`);
    await check('/try/mail, empty');
    await page.goto(`${TRY}/try/sign-in?as=Sam`);
    await check('not added yet');
    await tryDb("insert into try_mail (id, address, subject, text) values (gen_random_uuid(), 'drew@xr.test', 'A message', 'Open http://127.0.0.1:3102/what-needs-you')");
    await page.goto(`${TRY}/try/mail`);
    await check('/try/mail');
    await page.getByRole('link', { name: /^Open/ }).first().click();
    await check('a message');
  });
});

// pnpm run try stops with a reason and leaves nothing behind (trying-the-product#AC-20).
test.describe('pnpm run try when it cannot start (trying-the-product#AC-20)', () => {
  const script = path.resolve(import.meta.dirname, '../scripts/try.mjs');
  const run = (env: Record<string, string>) =>
    spawnSync(process.execPath, [script], { encoding: 'utf8', timeout: 60_000, env: { NODE_ENV: 'production', PATH: process.env.PATH ?? '', HOME: process.env.HOME ?? '', ...env } });

  test('Docker is not running and no database was given', () => {
    const r = run({ DOCKER_HOST: 'unix:///nonexistent/docker.sock' });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/Docker is not running/);
    expect(r.stderr).toMatch(/TRY_DATABASE_URL/);
  });

  test('the port is in use', async () => {
    const server = createServer();
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = (server.address() as { port: number }).port;
    const r = run({ TRY_DATABASE_URL: process.env.TRY_E2E_DATABASE_URL ?? '', TRY_PORT: String(port) });
    server.close();
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(new RegExp(`port ${port} is in use`));
  });

  test('the database is not empty and not a trial copy', () => {
    const r = run({ TRY_DATABASE_URL: process.env.DATABASE_URL ?? '' });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/not empty and not a trial copy/);
    expect(r.stderr).not.toContain(process.env.DATABASE_URL ?? 'never');
  });
});
