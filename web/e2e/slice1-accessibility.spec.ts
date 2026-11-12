import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { FIRST, addPerson, createOrganisation, signIn, startProject, uniq } from './support/world';

// AC-38 is a check sourced from the designs' Accessibility sections (approver's decision,
// 2026-11-12): every slice 1 page passes axe at WCAG 2.2 AA, fits 320 CSS pixels, and is usable
// by keyboard with a visible focus indicator.

async function check(page: Page, path: string) {
  await page.goto(path);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations, `${path}: ${results.violations.map((v) => v.id).join(', ')}`).toEqual([]);
  await page.setViewportSize({ width: 320, height: 640 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow, `${path} scrolls sideways at 320px`).toBe(false);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('h1')).toHaveCount(1);
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return 'none';
    const style = getComputedStyle(el);
    return `${style.outlineStyle} ${style.outlineWidth}`;
  });
  expect(outline, `${path}: first Tab stop has no visible focus`).not.toMatch(/^none|0px$/);
}

test('slice 1 pages pass axe and keyboard checks (layer1-organisations-projects-people#AC-38)', async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of ['/sign-in', '/signed-out']) await check(page, path);

  await signIn(page, FIRST.jordan);
  const org = await createOrganisation(page, uniq('Access Org '));
  const project = await startProject(page, uniq('Access '));
  await addPerson(page, project, { email: `${uniq('riley-')}@xr.test`, name: 'Riley Chen', roles: ['Artist'] });
  const riley = (await page.getByRole('link', { name: 'Change roles or remove Riley Chen' }).getAttribute('href')) ?? '';
  for (const path of [
    '/',
    '/account',
    '/organisations',
    '/organisations/new',
    `/organisations/${org}`,
    `/organisations/${org}/edit`,
    '/projects/new',
    `/projects/${project}`,
    `/projects/${project}/edit`,
    `/projects/${project}/people`,
    `/projects/${project}/people/new`,
    riley,
    `${riley}/remove`,
    '/projects/00000000-0000-7000-8000-000000000000',
  ]) {
    await check(page, path);
  }

  // Errors move focus to the summary and change the title.
  await page.goto('/projects/new');
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page).toHaveTitle(/^Error:/);
  await expect(page.getByLabel('Project name')).toHaveAttribute('aria-invalid', 'true');

  // A successful action moves focus to the notice and leads the title with the outcome.
  await page.getByLabel('Project name').fill(uniq('Focus '));
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('status')).toBeFocused();
  await expect(page).toHaveTitle(/^Project started/);

  // Email fields allow paste and password managers.
  await page.goto('/sign-in');
  const email = page.getByLabel('Email address');
  await expect(email).toHaveAttribute('type', 'email');
  await expect(email).not.toHaveAttribute('onpaste', /.+/);
});
