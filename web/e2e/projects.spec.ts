import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import {
  FIRST,
  acceptInvitation,
  addPerson,
  newPage,
  signIn,
  sql,
  startProject,
  uniq,
} from './support/world';

// The project list, navigation and access (docs-your-projects).

test('projects list shows only the person\'s projects (layer1-organisations-projects-people#AC-13)', async ({ page, browser }) => {
  await signIn(page, FIRST.empty);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await expect(page.getByText('You are not on any projects.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start a project' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create an organisation' })).toBeVisible();

  const jordan = await newPage(browser, FIRST.jordan);
  const name = uniq('Listed ');
  await startProject(jordan, name);
  await jordan.getByRole('link', { name: 'XR Studio' }).click();
  await expect(jordan).toHaveURL('http://127.0.0.1:3100/');
  const card = jordan.getByRole('listitem').filter({ hasText: name });
  await expect(card).toContainText(name);
  await expect(card).toContainText('Your roles: Director, Producer');
  await expect(card).toContainText('Owner');
  await expect(card).toContainText('Organisation:');

  // Someone else's project never reaches this list.
  await page.reload();
  await expect(page.getByText(name)).toHaveCount(0);
  await jordan.context().close();
});

test('project switcher groups projects by organisation (layer1-organisations-projects-people#AC-14)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const a = uniq('Switch A ');
  const b = uniq('Switch B ');
  await startProject(page, a);
  await startProject(page, b);
  const switcher = page.getByRole('button', { name: `Project: ${b}` });
  await switcher.click();
  const menu = page.getByRole('navigation', { name: 'Your projects' });
  await expect(menu.getByRole('link', { name: a })).toBeVisible();
  await expect(menu.getByRole('group').first()).toBeVisible();
  const allProjects = menu.getByRole('link', { name: 'All projects' });
  await expect(allProjects).toBeVisible();
  await menu.getByRole('link', { name: a }).click();
  await expect(page.getByRole('heading', { level: 1, name: a })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Organisations' })).toBeVisible();
});

test('account menu (layer1-organisations-projects-people#AC-15)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  await page.getByRole('button', { name: FIRST.jordan }).click();
  await expect(page.getByRole('link', { name: 'Your account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
});

// The menu sits in the frame every signed-in page shares, so it outlives a page change; it must
// close when the page changes (finding in docs/decisions/layer1-organisations-projects-people.md).
test('account menu closes when the page changes (layer1-organisations-projects-people#AC-15)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const menu = page.getByRole('button', { name: FIRST.jordan });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'Your account' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeHidden();

  await menu.click();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Organisations' }).click();
  await expect(page).toHaveURL(/\/organisations$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('not available, access removed and nothing for you (layer1-organisations-projects-people#AC-16)', async ({ page, browser }) => {
  await signIn(page, FIRST.access);
  const missing = await page.goto(`/projects/${randomUUID()}`);
  await expect(page.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to your projects' })).toBeVisible();
  const missingText = await page.locator('main').innerText();

  const jordan = await newPage(browser, FIRST.jordan);
  const project = await startProject(jordan, uniq('Private '));
  const hidden = await page.goto(`/projects/${project}`);
  expect(hidden?.status()).toBe(missing?.status());
  expect(await page.locator('main').innerText()).toBe(missingText);

  // Someone who had a role and lost it.
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(jordan, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const rileyContext = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await rileyContext.newPage();
  await acceptInvitation(rileyPage, riley);
  await jordan.goto(`/projects/${project}/people`);
  await jordan.getByRole('link', { name: 'Change roles or remove Riley Chen' }).click();
  await jordan.getByRole('button', { name: 'Remove Riley Chen from the project' }).click();
  await jordan.getByRole('button', { name: 'Remove Riley Chen' }).click();
  await expect(jordan.getByRole('status')).toContainText('Riley Chen removed from');
  await rileyPage.reload();
  await expect(rileyPage.getByText('You no longer have access to this project')).toBeVisible();

  // Someone whose only roles do not use the dashboard.
  const sam = `${uniq('sam-')}@xr.test`;
  await addPerson(jordan, project, { email: sam, name: 'Sam Okafor', roles: ['Artist'] });
  const samContext = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const samPage = await samContext.newPage();
  await acceptInvitation(samPage, sam);
  await jordan.goto(`/projects/${project}/people`);
  await jordan.getByRole('link', { name: 'Change roles or remove Sam Okafor' }).click();
  await jordan.getByRole('checkbox', { name: 'Artist', exact: true }).uncheck();
  await jordan.getByRole('checkbox', { name: 'Performer', exact: true }).check();
  await jordan.getByRole('button', { name: 'Save roles' }).click();
  await expect(jordan.getByRole('status')).toContainText("Sam Okafor's roles saved");
  await samPage.goto('/');
  await expect(samPage.getByText('Nothing in the dashboard for you yet')).toBeVisible();
  await rileyContext.close();
  await samContext.close();
  await jordan.context().close();
});

test('role change applies at the next request (layer1-organisations-projects-people#AC-17)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Change '));
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const rileyContext = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await rileyContext.newPage();
  await acceptInvitation(rileyPage, riley);
  await expect(rileyPage.getByRole('link', { name: 'Edit name and brief' })).toHaveCount(0);

  await page.goto(`/projects/${project}/people`);
  await page.getByRole('link', { name: 'Change roles or remove Riley Chen' }).click();
  await page.getByRole('checkbox', { name: 'Director', exact: true }).check();
  await page.getByRole('button', { name: 'Save roles' }).click();
  await expect(page.getByRole('status')).toContainText("Riley Chen's roles saved");

  await rileyPage.reload();
  await expect(rileyPage.getByRole('link', { name: 'Edit name and brief' })).toBeVisible();
  const api = await rileyPage.request.get(`/api/v1/projects/${project}`);
  expect(api.status()).toBe(200);
  const sessions = await sql(
    'select count(*)::int as n from session s join auth_user u on u.id = s.user_id where lower(u.email) = lower($1)',
    [riley],
  );
  expect(sessions.rows[0].n).toBeGreaterThan(0);
  await rileyContext.close();
});
