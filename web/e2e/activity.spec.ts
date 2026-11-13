import { expect, test } from '@playwright/test';
import { errorSummary, saveOrgText, saveText, team } from './support/slice2';
import { FIRST, signIn, sql, startProject, uniq } from './support/world';

// Activity (docs-activity-log).

test('project activity, paging and who may read it (layer1-facts-identifiers-activity#AC-34)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await saveText(page, t.project, 'description', 'First');
  await page.goto(`/projects/${t.project}`);
  await page.getByRole('navigation', { name: 'Project' }).getByRole('link', { name: 'Activity' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${t.project}/activity$`));
  const table = page.getByRole('table', { name: 'Activity, newest first' });
  await expect(table.getByRole('columnheader')).toHaveText(['When', 'Who', 'What', 'Area']);
  const rows = table.getByRole('row');
  await expect(rows.nth(1)).toContainText('Saved the description (version 1)');
  await expect(rows.nth(1)).toContainText('Facts');
  await expect(rows.last()).toContainText('Started the project');
  await expect(rows.last()).toContainText('Project');
  await expect(page.getByText(/^Showing the newest \d+ of \d+ entries\.$/)).toBeVisible();

  // Fifty at a time.
  const base = await sql('select count(*)::int as n from activity_entry where project_id = $1', [t.project]);
  const extra = 55 - base.rows[0].n;
  await sql(
    `insert into activity_entry (id, project_id, at, actor_person_id, actor_kind, area, what)
     select gen_random_uuid(), $1, now() - interval '1 day' - (n || ' seconds')::interval, null, 'system', 'Facts', 'Filler entry ' || n
     from generate_series(1, $2) n`,
    [t.project, extra],
  );
  await page.reload();
  await expect(page.getByText('Showing the newest 50 of 55 entries.')).toBeVisible();
  await expect(table.getByRole('row')).toHaveCount(51);
  await page.getByRole('link', { name: 'Older entries' }).click();
  await expect(table.getByRole('row')).toHaveCount(6);

  await t.tess.goto(`/projects/${t.project}/activity`);
  await expect(t.tess.getByRole('table', { name: 'Activity, newest first' })).toBeVisible();
  await t.riley.goto(`/projects/${t.project}/activity`);
  await expect(t.riley.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  expect((await t.riley.request.get(`/api/v1/projects/${t.project}/activity`)).status()).toBe(404);
  await t.close();
});

test('filter the activity (layer1-facts-identifiers-activity#AC-35)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await saveText(page, t.project, 'description', 'First');
  await saveText(page, t.project, 'plan', 'Plan');
  // Riley is removed, so appears as removed in Who once they have an entry; give them one.
  await sql(
    `insert into activity_entry (id, project_id, at, actor_person_id, actor_kind, area, what)
     select gen_random_uuid(), $1, now(), p.id, 'person', 'Facts', 'Saved the schedule (version 1)' from person p where p.email = $2`,
    [t.project, t.rileyEmail],
  );
  const rileyId = (await sql('select id from person where email = $1', [t.rileyEmail])).rows[0].id;
  await page.goto(`/projects/${t.project}/people/${rileyId}/remove`);
  await page.getByRole('button', { name: 'Remove Riley Chen' }).click();
  await expect(page.getByRole('status')).toBeVisible();

  await page.goto(`/projects/${t.project}/activity`);
  const who = page.getByLabel('Who');
  await expect(who.locator('option')).toContainText(['Anyone', 'Riley Chen (removed)', 'Agents']);
  await expect(page.getByLabel('Area').locator('option')).toHaveText(['All areas', 'Project', 'Facts', 'People', 'Approvers', 'Review']);
  const jordan = (await who.locator('option').allTextContents()).find((o) => o !== 'Anyone' && !o.includes('Riley') && o !== 'Agents') ?? '';
  await who.selectOption({ label: jordan });
  await page.getByLabel('Area').selectOption({ label: 'Facts' });
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/who=.*area=facts/);
  const result = page.getByText(`2 entries: ${jordan}, Facts.`);
  await expect(result).toBeFocused();
  await expect(page).toHaveTitle(new RegExp(`^2 entries: `));
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);

  await page.getByLabel('Who').selectOption({ label: 'Agents' });
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByText('No entries match these filters.')).toBeVisible();
  await expect(page.getByText('Agents arrive in a later release, so there are no agent entries yet.')).toBeVisible();
  await expect(page).toHaveTitle(/^No entries match/);

  await page.getByRole('link', { name: 'Clear filters' }).first().click();
  await expect(page).toHaveURL(new RegExp(`/projects/${t.project}/activity$`));
  await page.getByLabel('From').fill('2030-01-02');
  await page.getByLabel('To', { exact: true }).fill('2030-01-01');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(errorSummary(page)).toContainText('Choose a From date before the To date.');
  await expect(errorSummary(page)).toBeFocused();
  await expect(page.getByLabel('From')).toHaveValue('2030-01-02');
  await t.close();
});

test("times and date filters use the viewer's time zone (layer1-facts-identifiers-activity#AC-36)", async ({ browser, playwright }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100', timezoneId: 'Asia/Tokyo' });
  const page = await context.newPage();
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Zones '));
  // An entry at 23:30 UTC on 1 March is 08:30 on 2 March in Tokyo and 18:30 on 1 March in Toronto.
  await sql(
    `insert into activity_entry (id, project_id, at, actor_person_id, actor_kind, area, what)
     values (gen_random_uuid(), $1, '2030-03-01T23:30:00Z', null, 'system', 'Facts', 'Zone check')`,
    [project],
  );
  await page.goto(`/projects/${project}/activity`);
  await expect(page.getByRole('row').filter({ hasText: 'Zone check' })).toContainText('2 March, 08:30');
  await page.goto(`/projects/${project}/activity?from=2030-03-02&to=2030-03-02`);
  await expect(page.getByRole('row').filter({ hasText: 'Zone check' })).toBeVisible();
  await page.goto(`/projects/${project}/activity?from=2030-03-01&to=2030-03-01`);
  await expect(page.getByRole('row').filter({ hasText: 'Zone check' })).toHaveCount(0);

  // With no time zone sent, America/Toronto.
  const cookies = (await context.cookies()).filter((c) => c.name !== 'tz');
  expect(cookies.length).toBeGreaterThan(0);
  const bare = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3100',
    extraHTTPHeaders: { cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; ') },
  });
  const html = await (await bare.get(`/projects/${project}/activity`)).text();
  expect(html).toContain('1 March, 18:30');
  await bare.dispose();
  await context.close();
});

test('organisation activity (layer1-facts-identifiers-activity#AC-37)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await saveOrgText(page, t.org, 'bio', 'Bio', 'Our bio.');
  await saveText(page, t.project, 'description', 'Project only');
  await page.goto(`/organisations/${t.org}`);
  await page.getByRole('navigation', { name: 'Organisation' }).getByRole('link', { name: 'Activity' }).click();
  await expect(page).toHaveURL(new RegExp(`/organisations/${t.org}/activity$`));
  const table = page.getByRole('table', { name: 'Activity, newest first' });
  await expect(table).toContainText('Saved the bio (version 1)');
  await expect(table).toContainText('Created the organisation');
  await expect(table).not.toContainText('Saved the description');
  await expect(page.getByLabel('Area').locator('option')).toHaveText(['All areas', 'Organisation', 'Organisation facts', 'Identifier formats']);
  await expect(page.getByLabel('Who').locator('option')).not.toContainText(['Agents']);
  await t.tess.goto(`/organisations/${t.org}/activity`);
  await expect(t.tess.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await t.close();
});
