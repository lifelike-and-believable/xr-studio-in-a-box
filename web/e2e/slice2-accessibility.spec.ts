import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { PNG, pdfWithPages } from '../test/support/documents';
import { saveOrgText, saveText, team } from './support/slice2';

// AC-41 is a check sourced from the designs' Accessibility sections: every slice 2 page passes
// axe at WCAG 2.2 AA, fits 320 CSS pixels, and is usable by keyboard with a visible focus.

async function check(page: Page, path: string, prepare?: (page: Page) => Promise<void>) {
  await page.goto(path);
  if (prepare) await prepare(page);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations, `${path}: ${results.violations.map((v) => v.id).join(', ')}`).toEqual([]);
  await page.setViewportSize({ width: 320, height: 640 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
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

test('slice 2 pages pass axe and keyboard checks (layer1-facts-identifiers-activity#AC-41)', async ({ page, browser }) => {
  test.setTimeout(240_000);
  const t = await team(page, browser);
  const p = `/projects/${t.project}`;
  const o = `/organisations/${t.org}`;
  await saveText(page, t.project, 'description', 'A lantern keeper on a drowned coast.');
  await saveText(page, t.project, 'description', 'A lantern keeper on a drowned coast, streamed.');
  await saveOrgText(page, t.org, 'bio', 'Bio', 'A Toronto company.');
  await page.goto(`${p}/facts/work-samples`);
  await page.getByLabel('Title').fill('Lantern test');
  await page.getByLabel('File').setInputFiles({ name: 'lantern.png', mimeType: 'image/png', buffer: Buffer.from(PNG) });
  await page.getByRole('button', { name: 'Add work sample' }).click();
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByLabel('Title').fill('Scan');
  await page.getByLabel('File').setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfWithPages(['SIN 046 454 286'])) });
  await page.getByRole('button', { name: 'Add work sample' }).click();
  await expect(page.getByRole('button', { name: /^It is none of these, add scan\.pdf$|^It is not a .*, add scan\.pdf$/ })).toBeVisible();

  for (const path of [
    `${p}/facts`,
    `${p}/facts/description/edit`,
    `${p}/facts/budget/edit`,
    `${p}/facts/capacity/edit`,
    `${p}/facts/description/history`,
    `${p}/facts/description/history?compare=1`,
    `${p}/facts/work-samples`,
    `${p}/activity`,
    `${p}/activity?area=facts`,
    `${o}`,
    `${o}/facts/bio/edit`,
    `${o}/facts/funder-profile-creative-bc/edit`,
    `${o}/facts/bio/history`,
    `${o}/work-samples`,
    `${o}/identifier-formats`,
    `${o}/identifier-formats/new`,
    `${o}/activity`,
  ]) {
    await check(page, path);
  }

  // States: a held fact, the confirmation page, and the dialogs.
  await check(page, `${p}/facts/plan/edit`, async (pg) => {
    await pg.getByRole('textbox', { name: 'Plan' }).fill('Ticket 046454286');
    await pg.getByRole('button', { name: 'Save plan' }).click();
    await expect(pg.locator('mark')).toBeVisible();
  });
  await page.getByRole('button', { name: 'It is none of these' }).click();
  await expect(page.getByLabel('What is it?')).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);

  await page.goto(`${p}/facts/description/history`);
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const dialog = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(dialog.violations.map((v) => v.id)).toEqual([]);
  await t.close();
});
