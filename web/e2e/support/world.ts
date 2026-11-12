import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, type Browser, type Page } from '@playwright/test';
import { Pool } from 'pg';

// Shared helpers for the slice 1 end-to-end tests (layer1-organisations-projects-people).
// Tests run in one worker against one database that keeps earlier runs' data, so every name
// and address a test makes up carries a fresh suffix.

export const FIRST = {
  jordan: 'jordan@xr.test',
  morgan: 'morgan@xr.test',
  solo: 'solo@xr.test',
  empty: 'empty@xr.test',
  keys: 'keys@xr.test',
  access: 'access@xr.test',
} as const;

export function uniq(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function mailDir(): string {
  const dir = process.env.MAIL_CAPTURE_DIR;
  if (!dir) throw new Error('MAIL_CAPTURE_DIR is not set: run the suite with pnpm run e2e');
  return dir;
}

export type Mail = { to: string; subject: string; text: string; sentAt: string; file: string };

export function mailsTo(address: string): Mail[] {
  const dir = mailDir();
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ ...JSON.parse(readFileSync(path.join(dir, f), 'utf8')), file: f }) as Mail)
    .filter((m) => m.to.toLowerCase() === address.toLowerCase());
}

export async function nextMail(address: string, countBefore: number): Promise<Mail> {
  await expect.poll(() => mailsTo(address).length, { timeout: 10_000 }).toBeGreaterThan(countBefore);
  const mail = mailsTo(address).at(-1);
  if (!mail) throw new Error(`no mail to ${address}`);
  return mail;
}

export function linkIn(mail: Mail): string {
  const link = mail.text.match(/https?:\/\/\S+/)?.[0];
  if (!link) throw new Error(`no link in mail to ${mail.to}`);
  return link;
}

let pool: Pool | undefined;
export function sql(text: string, values: unknown[] = []) {
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return pool.query(text, values);
}

// The one-a-minute limit is real; tests that need a second email clear the record of the first.
export async function forgetSends(address: string) {
  await sql('delete from email_send where lower(address) = lower($1)', [address]);
}

export async function requestLink(page: Page, address: string) {
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill(address);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
}

export async function signIn(page: Page, address: string, start = '/sign-in') {
  await forgetSends(address);
  const before = mailsTo(address).length;
  await page.goto(start);
  if (!page.url().includes('/sign-in')) return;
  await page.getByLabel('Email address').fill(address);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  const mail = await nextMail(address, before);
  await page.goto(linkIn(mail));
}

export async function newPage(browser: Browser, address: string, baseURL = 'http://127.0.0.1:3100') {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await signIn(page, address);
  return page;
}

export async function startProject(
  page: Page,
  name: string,
  opts: { organisation?: string; owner?: string; brief?: string } = {},
): Promise<string> {
  await page.goto('/projects/new');
  await page.getByLabel('Project name').fill(name);
  if (opts.brief) await page.getByLabel('Brief (optional)').fill(opts.brief);
  if (opts.organisation) await page.getByLabel('Organisation').selectOption({ label: opts.organisation });
  if (opts.owner) await page.getByLabel('Owner').selectOption({ label: opts.owner });
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  return projectId(page);
}

export function projectId(page: Page): string {
  const id = page.url().match(/\/projects\/([0-9a-f-]{36})/)?.[1];
  if (!id) throw new Error(`not on a project page: ${page.url()}`);
  return id;
}

export async function createOrganisation(page: Page, name: string, stewards: string[] = []) {
  await page.goto('/organisations/new');
  await page.getByLabel('Organisation name').fill(name);
  for (const s of stewards) await page.getByRole('checkbox', { name: s }).check();
  await page.getByRole('button', { name: 'Create organisation' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  const id = page.url().match(/\/organisations\/([0-9a-f-]{36})/)?.[1];
  if (!id) throw new Error(`not on an organisation page: ${page.url()}`);
  return id;
}

export async function addPerson(
  page: Page,
  project: string,
  person: { email: string; name?: string; roles: string[] },
) {
  await page.goto(`/projects/${project}/people/new`);
  await page.getByLabel('Email address').fill(person.email);
  if (person.name) await page.getByLabel('Name (optional)').fill(person.name);
  for (const role of person.roles) await page.getByRole('checkbox', { name: role, exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'People' }).or(page.getByRole('status')).first()).toBeVisible();
}

export async function acceptInvitation(page: Page, address: string) {
  const mail = mailsTo(address).filter((m) => m.subject.startsWith('You have been added')).at(-1);
  if (!mail) throw new Error(`no invitation for ${address}`);
  await page.goto(linkIn(mail));
}
