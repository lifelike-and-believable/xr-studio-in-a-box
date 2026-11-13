import { expect, test } from '@playwright/test';
import { crew } from './support/slice3';

// Approvers (layer1-gates-and-queue#AC-2 to AC-12).

test('review and approvers tabs sit in order (layer1-gates-and-queue#AC-2)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}`);
  const tabs = page.getByRole('navigation', { name: 'Project' }).getByRole('link');
  await expect(tabs).toHaveText(['Overview', 'Review', 'Facts', 'People', 'Approvers', 'Activity']);
  await c.riley.goto(`/projects/${c.project}`);
  await expect(c.riley.getByRole('navigation', { name: 'Project' }).getByRole('link')).toHaveText(['Overview', 'Review', 'Facts', 'People', 'Approvers']);
  await c.close();
});

test('approvers page lists areas and protected approvals (layer1-gates-and-queue#AC-3, AC-4)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/approvers`);
  const areas = page.getByRole('table', { name: 'Approver and delegate for each area' });
  await expect(areas.getByRole('rowheader')).toHaveText(['Creative', 'Performance and behaviour', 'Builds and operations', 'Business']);
  await expect(areas.getByRole('row', { name: /^Creative/ })).toContainText('Look and concept art; character design; mesh and rig;');
  await expect(areas.getByRole('row', { name: /^Creative/ }).getByRole('cell').nth(1)).toHaveText('jordan@xr.test');
  await expect(areas.getByRole('row', { name: /^Creative/ }).getByRole('cell').nth(2)).toHaveText('None');
  const held = page.getByRole('table', { name: 'Holder of each protected approval' });
  await expect(held.getByRole('rowheader')).toHaveText([
    'Contracts and licence terms',
    'Funding applications and reports',
    'Publishing and marketing',
    'Audience-facing safety and consent',
  ]);
  await expect(page.getByText('Hand-offs not listed here, such as a build for rehearsal, move on without waiting for anyone.')).toBeVisible();
  await expect(page.getByText('One person can hold every approval. When a project starts, its owner holds them all.')).toBeVisible();
  await c.close();
});

test('only directors and producers change approvers (layer1-gates-and-queue#AC-5)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/approvers`);
  await expect(page.getByRole('link', { name: 'Change Creative' })).toBeVisible();
  await c.riley.goto(`/projects/${c.project}/approvers`);
  await expect(c.riley.getByRole('link', { name: /^Change/ })).toHaveCount(0);
  await expect(c.riley.getByText('Directors and producers can change approvers. On this project: jordan@xr.test and Morgan Ray.')).toBeVisible();
  await c.riley.goto(`/projects/${c.project}/approvers/creative`);
  await expect(c.riley.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await c.close();
});

test('name an approver and a delegate for an area (layer1-gates-and-queue#AC-6, AC-8, AC-12)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/approvers`);
  await page.getByRole('link', { name: 'Change Creative' }).click();
  await expect(page.getByRole('heading', { name: 'Creative: approver and delegate' })).toBeVisible();
  const delegate = page.getByLabel('Delegate (optional)');
  await expect(delegate.locator('option').first()).toHaveText('No delegate');
  await expect(page.getByLabel('Approver').locator('option')).toHaveText(['jordan@xr.test', 'Morgan Ray', 'Riley Chen', 'Sam Okafor']);
  await page.getByLabel('Approver').selectOption({ label: 'Morgan Ray' });
  await delegate.selectOption({ label: 'Sam Okafor' });
  await page.getByRole('button', { name: 'Save Creative' }).click();
  const notice = page.getByRole('status');
  await expect(notice).toHaveText('Creative saved: Morgan Ray approves it, with Sam Okafor as delegate. Items already waiting in Creative now wait for them.');
  await expect(notice).toBeFocused();
  await expect(page).toHaveTitle(/^Creative saved/);

  await page.getByRole('link', { name: 'Change Business' }).click();
  await page.getByRole('link', { name: 'Cancel' }).click();
  await expect(page.getByRole('table', { name: 'Approver and delegate for each area' }).getByRole('row', { name: /^Business/ }).getByRole('cell').nth(1)).toHaveText('jordan@xr.test');

  await page.goto(`/projects/${c.project}/activity?area=approvers`);
  await expect(page.getByText('Named Morgan Ray as approver and Sam Okafor as delegate for Creative')).toBeVisible();
  await c.close();
});

test('name the holder of a protected approval (layer1-gates-and-queue#AC-7)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/approvers`);
  await page.getByRole('link', { name: 'Change Publishing and marketing' }).click();
  await expect(page.getByRole('heading', { name: 'Publishing and marketing: holder' })).toBeVisible();
  await page.getByLabel('Holder').selectOption({ label: 'Morgan Ray' });
  await page.getByRole('button', { name: 'Save publishing and marketing' }).click();
  await expect(page.getByRole('status')).toHaveText('Publishing and marketing saved: Morgan Ray holds it.');
  await c.close();
});

test('only people who use the dashboard can be chosen (layer1-gates-and-queue#AC-8)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/people/new`);
  await page.getByLabel('Email address').fill(`kai-${Date.now()}@xr.test`);
  await page.getByLabel('Name (optional)').fill('Kai Morin');
  await page.getByRole('checkbox', { name: 'Performer', exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.goto(`/projects/${c.project}/people/new`);
  await page.getByLabel('Email address').fill(`ash-${Date.now()}@xr.test`);
  await page.getByLabel('Name (optional)').fill('Ash Nadeau');
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.goto(`/projects/${c.project}/approvers/creative`);
  const options = page.getByLabel('Approver').locator('option');
  await expect(options).not.toContainText(['Kai Morin']);
  await expect(page.getByLabel('Approver').locator('option', { hasText: 'Ash Nadeau' })).toHaveText('Ash Nadeau (invited, not signed in yet)');
  await c.close();
});

test('approver and delegate must differ (layer1-gates-and-queue#AC-9)', async ({ page, browser }) => {
  const c = await crew(page, browser, { approvers: false });
  await page.goto(`/projects/${c.project}/approvers/creative`);
  await page.getByLabel('Approver').selectOption({ label: 'Morgan Ray' });
  await page.getByLabel('Delegate (optional)').selectOption({ label: 'Morgan Ray' });
  await page.getByRole('button', { name: 'Save Creative' }).click();
  const summary = page.locator('main [role="alert"]');
  await expect(summary).toContainText('Choose someone other than the approver as delegate, or No delegate.');
  await expect(summary).toBeFocused();
  await expect(page.getByLabel('Approver')).toHaveValue(/.+/);
  await expect(page.getByLabel('Approver').locator('option:checked')).toHaveText('Morgan Ray');
  await c.close();
});

test('someone who approves cannot be removed (layer1-gates-and-queue#AC-11)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await page.goto(`/projects/${c.project}/people`);
  await page.getByRole('link', { name: 'Change roles or remove Sam Okafor' }).click();
  await page.getByRole('button', { name: 'Remove Sam Okafor from the project' }).click();
  await expect(page.getByRole('heading', { name: 'Sam Okafor cannot be removed yet' })).toBeFocused();
  await expect(page.getByText('Sam is the delegate for Creative. Give those to someone else on Approvers first, so that no item waits for a person who has left.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Remove/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Keep Sam' })).toBeVisible();
  await page.getByRole('link', { name: 'Go to Approvers' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${c.project}/approvers$`));

  await page.goto(`/projects/${c.project}/people`);
  await page.getByRole('link', { name: 'Change roles or remove Sam Okafor' }).click();
  await page.getByRole('checkbox', { name: 'Technical artist', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Performer', exact: true }).check();
  await page.getByRole('button', { name: 'Save roles' }).click();
  await expect(page.locator('main [role="alert"]')).toContainText('Sam is the delegate for Creative.');
  await c.close();
});
