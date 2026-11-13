import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { apiSend, crew } from './support/slice3';

// AC-40 is a check sourced from the designs' Accessibility sections: every slice 3 page passes
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

test('slice 3 pages pass axe and keyboard checks (layer1-gates-and-queue#AC-40)', async ({ page, browser }) => {
  test.setTimeout(240_000);
  const c = await crew(page, browser);
  const p = `/projects/${c.project}`;
  const item = await apiSend(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await apiSend(c.riley, c.project, { title: 'Ferry pilot character sheet', handoff: 'character-design' });
  const decided = await apiSend(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art' });
  await c.morgan.request.post(`${p.replace('/projects', '/api/v1/projects')}/review-items/${decided}/decision`, { data: { decision: 'revise', feedback: 'Warmer light.' } });

  for (const path of [`${p}/approvers`, `${p}/approvers/creative`, `${p}/approvers/protected/contracts-and-licence-terms`, `${p}/review/waiting`]) {
    await check(page, path);
  }
  for (const path of [`${p}/review`, `${p}/review/${item}`]) await check(c.morgan, path);
  for (const path of [`${p}/review`, `${p}/review/new`, `${p}/review/sent`, `${p}/review/${item}`]) await check(c.riley, path);

  // States: the error summaries, the removal refusal and the dialogs.
  await check(c.riley, `${p}/review/new`, async (pg) => {
    await pg.getByRole('button', { name: 'Send for review' }).click();
    await expect(pg.getByRole('alert')).toBeVisible();
  });
  await check(page, `${p}/approvers/creative`, async (pg) => {
    await pg.getByLabel('Delegate (optional)').selectOption({ index: 1 });
    await pg.getByLabel('Approver').selectOption({ index: 0 });
    await pg.getByRole('button', { name: 'Save Creative' }).click();
    await expect(pg.getByRole('alert')).toBeVisible();
  });
  const samId = (await page.request.get(`/api/v1/projects/${c.project}/people`).then((r) => r.json()) as { id: string; display: string }[]).find((x) => x.display === 'Sam Okafor')?.id;
  await check(page, `${p}/people/${samId}/remove`);
  await c.morgan.goto(`${p}/review/${item}`);
  await c.morgan.getByRole('button', { name: 'Reject' }).click();
  await expect(c.morgan.getByRole('dialog')).toBeVisible();
  const dialog = await new AxeBuilder({ page: c.morgan }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(dialog.violations.map((v) => v.id)).toEqual([]);
  await c.close();
});
