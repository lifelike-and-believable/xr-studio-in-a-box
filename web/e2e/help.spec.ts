import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { FIRST, signIn } from './support/world';

// Help (help-tutorials-and-previews). The ordinary build runs on 3100, a try build on 3102.
const TRY = 'http://127.0.0.1:3102';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function fits(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations, `${label}: ${results.violations.map((v) => v.id).join(', ')}`).toEqual([]);
  await page.setViewportSize({ width: 320, height: 640 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow, `${label} scrolls sideways at 320px`).toBe(false);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('h1')).toHaveCount(1);
}

test('Help in the header opens the help for the page you are on (help-tutorials-and-previews#AC-1)', async ({ page }) => {
  await signIn(page, FIRST.jordan, '/projects');
  await page.goto('/projects');
  const header = page.locator('header.site');
  const help = header.getByRole('link', { name: 'Help', exact: true });
  await expect(help).toBeVisible();
  // After the main navigation and before the person's name.
  const order = await header.evaluate((h) => {
    const items = [...h.querySelectorAll('nav[aria-label="Main"], a, button')];
    const nav = items.findIndex((e) => e.matches('nav[aria-label="Main"]'));
    const link = items.findIndex((e) => e.textContent?.trim() === 'Help');
    const account = items.findIndex((e) => e.matches('button[aria-controls="account-menu"]'));
    return { nav, link, account };
  });
  expect(order.nav).toBeLessThan(order.link);
  expect(order.link).toBeLessThan(order.account);
  await help.click();
  await expect(page).toHaveURL(/\/help\/projects\/your-projects$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your projects');
});

test('the start page, an area and a page (help-tutorials-and-previews#AC-2, AC-3, AC-5)', async ({ page }) => {
  await page.goto('/help');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('XR Studio');
  await expect(page.getByRole('heading', { name: 'Tutorials', level: 2 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try XR Studio in a trial copy' })).toHaveAttribute('href', '/help/tutorials/try-xr-studio-in-a-trial-copy');
  await expect(page.getByText('for Morgan, the director')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to XR Studio' })).toHaveAttribute('href', '/');
  await fits(page, '/help');

  await page.getByRole('link', { name: 'Board', exact: true }).first().click();
  await expect(page).toHaveURL(/\/help\/board$/);
  await page.goto('/help/board/board');
  const trail = page.getByRole('navigation', { name: 'Help' });
  await expect(trail.getByRole('listitem')).toHaveText(['Help', 'Board', 'Board']);
  await expect(trail.locator('[aria-current="page"]')).toHaveText('Board');
  await expect(page.getByRole('heading', { name: 'In this part of Help' })).toBeVisible();
  await expect(page.getByText('(this page)')).toBeVisible();
  const width = await page.locator('main').evaluate((m) => parseFloat(getComputedStyle(m).maxWidth));
  expect(width).toBeLessThanOrEqual(720);
  await fits(page, '/help/board/board');
});

test('a help address that does not exist (help-tutorials-and-previews#AC-5)', async ({ page }) => {
  for (const address of ['/help/nowhere', '/help/board/nowhere', '/help/tutorials/nowhere']) {
    const r = await page.goto(address);
    expect(r?.status(), address).toBe(404);
    await expect(page.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Back to XR Studio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to your projects' })).toHaveCount(0);
  }
});

test('a tutorial in Help, with the trial notice only in a trial copy (help-tutorials-and-previews#AC-6, AC-7)', async ({ page }) => {
  const notice = "You are in a trial copy. To put it at this tutorial's starting point, select Start beside it on Try XR Studio.";
  await page.goto('/help/tutorials/try-xr-studio-in-a-trial-copy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try XR Studio in a trial copy');
  await expect(page.getByText(notice)).toHaveCount(0);
  await fits(page, 'a tutorial');

  await page.goto(`${TRY}/help/tutorials/try-xr-studio-in-a-trial-copy`);
  await expect(page.getByText(notice)).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Try XR Studio', exact: true })).toHaveAttribute('href', '/try');

  await page.goto(`${TRY}/try`);
  await expect(page.getByRole('link', { name: 'Try XR Studio in a trial copy' })).toHaveAttribute('href', '/help/tutorials/try-xr-studio-in-a-trial-copy');
});
