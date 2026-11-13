import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { crew } from './support/slice3';
import { addWorkFor, decideItem, feedbackOn, sendWork } from './support/slice4';

// AC-44 is a check sourced from the designs' Accessibility sections: every slice 4 page passes
// axe at WCAG 2.2 AA, fits 320 CSS pixels, and is usable by keyboard with a visible focus.

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function check(page: Page, path: string, prepare?: (page: Page) => Promise<void>) {
  await page.goto(path);
  if (prepare) await prepare(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
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

test('slice 4 pages pass axe and keyboard checks (layer1-versions-board-first-view#AC-44)', async ({ page, browser }) => {
  test.setTimeout(240_000);
  const c = await crew(page, browser);
  const p = `/projects/${c.project}`;
  const sheet = await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await addWorkFor(page, c.project, { title: 'Lantern Keeper mesh and rig', handoff: 'mesh-and-rig', owner: 'Sam Okafor' });
  const concept = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art' });
  await feedbackOn(c.sam, c.project, concept.itemId, 'The stairs need a second rig.');
  await decideItem(c.morgan, c.project, concept.itemId, 'revise', 'Go back to the first stairs.');
  const v2 = await sendWork(c.riley, c.project, { workId: concept.workId });
  await decideItem(c.morgan, c.project, v2.itemId, 'revise', 'Warmer light.');
  const empty = await addWorkFor(page, c.project, { title: 'Harbour ambience', handoff: 'sound-and-music', owner: 'Riley Chen' });

  for (const path of [`${p}/board`, `${p}/board?show=blocked`, `${p}/board/new`, `${p}/board/${empty}`, '/what-needs-you', '/projects']) await check(page, path);
  for (const path of [
    `${p}/board/${concept.workId}`,
    `${p}/board/${concept.workId}/compare`,
    `${p}/board/${sheet.workId}`,
    `${p}/review/new?work=${concept.workId}`,
    `${p}/review/${v2.itemId}`,
    '/what-needs-you',
  ]) {
    await check(c.riley, path);
  }
  await check(c.morgan, '/what-needs-you');

  // States: error summaries, the compare error and the dialogs.
  await check(page, `${p}/board/new`, async (pg) => {
    await pg.getByRole('button', { name: 'Add work' }).click();
    await expect(pg.locator('main [role="alert"]')).toBeVisible();
  });
  await check(c.riley, `${p}/board/${concept.workId}`, async (pg) => {
    await pg.getByRole('button', { name: 'Add feedback' }).click();
    await expect(pg.locator('main [role="alert"]')).toBeVisible();
  });
  await check(c.riley, `${p}/board/${concept.workId}/compare?a=1&b=1`);
  for (const [who, path, button] of [
    [c.riley, `${p}/board/${concept.workId}`, 'Restore version 1'],
    [page, `${p}/board/${empty}`, 'Remove Harbour ambience'],
  ] as const) {
    await who.goto(path);
    await who.getByRole('button', { name: button }).click();
    await expect(who.getByRole('dialog')).toBeVisible();
    const dialog = await new AxeBuilder({ page: who }).withTags(TAGS).analyze();
    expect(dialog.violations.map((v) => v.id)).toEqual([]);
  }
  await c.close();
});
