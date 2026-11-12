import { expect, test } from '@playwright/test';
import { errorSummary, saveOrgText, saveText, team } from './support/slice2';
import { FIRST, createOrganisation, signIn, startProject, uniq } from './support/world';

// Project facts (docs-project-facts).

const FACTS = ['Description', 'Plan', 'Budget', 'Credits', 'Collaborators', 'Schedule', 'Work samples', 'Capacity'];

test('facts tab lists the facts in order with who last changed each (layer1-facts-identifiers-activity#AC-1)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Facts Org ');
  const org = await createOrganisation(page, orgName);
  const project = await startProject(page, uniq('Facts '), { organisation: orgName });
  await expect(page.getByText('No project facts yet.')).toHaveCount(0);

  const tabs = page.getByRole('navigation', { name: 'Project' }).getByRole('link');
  await expect(tabs).toHaveText(['Overview', 'Facts', 'People', 'Activity']);
  await tabs.filter({ hasText: 'Facts' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project}/facts$`));
  await expect(page.getByRole('navigation', { name: 'Project' }).getByRole('link', { name: 'Facts' })).toHaveAttribute('aria-current', 'page');

  const facts = page.getByRole('heading', { level: 3 });
  await expect(facts).toHaveText(FACTS);
  await expect(page.getByText('Not recorded yet.')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Add description' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: `From ${orgName}` })).toBeVisible();
  await expect(page.getByText(`${orgName} has no facts recorded yet. People who look after it add them on its page.`)).toBeVisible();

  await saveText(page, project, 'description', 'A lantern keeper on a drowned coast.');
  await saveOrgText(page, org, 'bio', 'Bio', 'A Toronto puppet company.');
  await page.goto(`/projects/${project}/facts`);
  const description = page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Description' }) });
  await expect(description).toContainText('A lantern keeper on a drowned coast.');
  await expect(description).toContainText(/Last changed by .+, \d{1,2} [A-Z][a-z]+ at \d\d:\d\d/);
  await expect(description.getByRole('link', { name: 'Edit description' })).toBeVisible();
  await expect(description.getByRole('link', { name: 'Earlier versions of description' })).toBeVisible();
  await expect(page.getByText('A Toronto puppet company.')).toBeVisible();
  await expect(page.getByRole('link', { name: `Open ${orgName}'s facts` })).toHaveAttribute('href', `/organisations/${org}`);
});

test('edit a fact and see who last changed it (layer1-facts-identifiers-activity#AC-2)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Edit '));
  await page.goto(`/projects/${project}/facts`);
  await page.getByRole('link', { name: 'Add plan' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project}/facts/plan/edit$`));
  await page.getByRole('textbox', { name: 'Plan' }).fill('Never saved');
  await page.getByRole('link', { name: 'Cancel' }).click();
  await expect(page.getByText('Never saved')).toHaveCount(0);

  await page.getByRole('link', { name: 'Add plan' }).click();
  await page.getByRole('textbox', { name: 'Plan' }).fill('Rehearsals in March.');
  await page.getByRole('button', { name: 'Save plan' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project}/facts`));
  await expect(page.getByRole('status')).toHaveText('Plan saved.');
  await expect(page.getByRole('status')).toBeFocused();
  await expect(page).toHaveTitle(/^Plan saved/);
  const plan = page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Plan' }) });
  await expect(plan).toContainText('Rehearsals in March.');
  await expect(plan).toContainText(/Last changed by /);
  await expect(plan.getByRole('link', { name: 'Edit plan' })).toBeVisible();
});

test('fact values are parsed and checked (layer1-facts-identifiers-activity#AC-3)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Values '));
  await page.goto(`/projects/${project}/facts/budget/edit`);
  await page.getByLabel('Total in Canadian dollars').fill('$148,000');
  await page.getByLabel('Note (optional)').fill('Fees, build, venue and streaming.');
  await page.getByRole('button', { name: 'Save budget' }).click();
  await expect(page.getByRole('status')).toHaveText('Budget saved.');
  await expect(page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Budget' }) })).toContainText(
    'Total: $148,000 CAD. Note: Fees, build, venue and streaming.',
  );

  await page.goto(`/projects/${project}/facts/capacity/edit`);
  await page.getByLabel('Guests in the room per show').fill('forty');
  await page.getByLabel('Viewers online per show').fill('0');
  await page.getByRole('button', { name: 'Save capacity' }).click();
  await expect(errorSummary(page)).toBeFocused();
  await expect(page).toHaveTitle(/^Error:/);
  await expect(errorSummary(page).getByRole('link', { name: 'Enter the number of guests in the room as a whole number, like 40.' })).toHaveAttribute('href', '#guests');
  await expect(page.getByLabel('Guests in the room per show')).toHaveValue('forty');
  await expect(page.getByLabel('Guests in the room per show')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Viewers online per show')).toHaveValue('0');
  await page.getByLabel('Guests in the room per show').fill('40');
  await page.getByRole('button', { name: 'Save capacity' }).click();
  await expect(page.getByRole('status')).toHaveText('Capacity saved.');
  await expect(page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Capacity' }) })).toContainText(
    '40 guests in the room and 0 viewers online, per show.',
  );

  await page.goto(`/projects/${project}/facts/budget/edit`);
  await page.getByLabel('Total in Canadian dollars').fill('148000.50');
  await page.getByRole('button', { name: 'Save budget' }).click();
  await expect(page.getByText('Enter the total in whole Canadian dollars, like 148000.').first()).toBeVisible();
  await expect(page.getByLabel('Note (optional)')).toHaveValue('Fees, build, venue and streaming.');
});

test('facts visible and editable by role (layer1-facts-identifiers-activity#AC-4)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await page.goto(`/projects/${t.project}/facts/budget/edit`);
  await page.getByLabel('Total in Canadian dollars').fill('148000');
  await page.getByRole('button', { name: 'Save budget' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await saveText(page, t.project, 'description', 'Seen by everyone');

  for (const viewer of [t.riley, t.tess]) {
    await viewer.goto(`/projects/${t.project}/facts`);
    await expect(viewer.getByText(/^The project's facts\. The director and producer edit them: .+\.$/)).toBeVisible();
    await expect(viewer.getByText('Seen by everyone')).toBeVisible();
    await expect(viewer.getByRole('link', { name: /^(Edit|Add)\b/ })).toHaveCount(0);
    const budget = viewer.locator('.fact').filter({ has: viewer.getByRole('heading', { name: 'Budget' }) });
    await expect(budget).toHaveText(/The budget is visible to the director and producer\./);
    await expect(budget).not.toContainText('148');
    for (const path of ['budget/edit', 'budget/history', 'description/edit']) {
      await viewer.goto(`/projects/${t.project}/facts/${path}`);
      await expect(viewer.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
    }
    const api = await viewer.request.get(`/api/v1/projects/${t.project}/facts/budget`);
    expect(api.status()).toBe(404);
    const all = await viewer.request.get(`/api/v1/projects/${t.project}/facts`);
    expect(all.status()).toBe(200);
    expect(JSON.stringify(await all.json())).not.toContain('148000');
    const put = await viewer.request.put(`/api/v1/projects/${t.project}/facts/description`, { data: { values: { text: 'Changed' }, baseVersion: 1 } });
    expect(put.status()).toBe(403);
  }
  await t.riley.goto(`/projects/${t.project}/facts`);
  await expect(t.riley.getByRole('navigation', { name: 'Project' }).getByRole('link')).toHaveText(['Overview', 'Facts', 'People']);
  await t.tess.goto(`/projects/${t.project}/facts`);
  await expect(t.tess.getByRole('navigation', { name: 'Project' }).getByRole('link')).toHaveText(['Overview', 'Facts', 'People', 'Activity']);
  await t.close();
});

test('a saved fact is visible at the next request (layer1-facts-identifiers-activity#AC-5)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await t.riley.goto(`/projects/${t.project}/facts`);
  await saveText(page, t.project, 'schedule', 'Shows 6 to 18 April.');
  await t.riley.reload();
  await expect(t.riley.getByText('Shows 6 to 18 April.')).toBeVisible();
  const api = await t.riley.request.get(`/api/v1/projects/${t.project}/facts/schedule`);
  expect((await api.json()).value).toEqual({ text: 'Shows 6 to 18 April.' });
  await t.close();
});

test('earlier versions and compare (layer1-facts-identifiers-activity#AC-6)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await saveText(page, t.project, 'description', 'Guests row out to her light in a hybrid room and online.');
  await saveText(page, t.project, 'description', 'The guests row out to her light, streamed and in a hybrid room.');
  await page.goto(`/projects/${t.project}/facts`);
  await page.getByRole('link', { name: 'Earlier versions of description' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${t.project}/facts/description/history$`));
  await expect(page.getByRole('heading', { name: 'Earlier versions of description' })).toBeVisible();
  const table = page.getByRole('table', { name: 'Versions of description, newest first' });
  const rows = table.getByRole('row');
  await expect(rows.nth(1)).toContainText('2 (current)');
  await expect(rows.nth(1).getByRole('link')).toHaveCount(0);
  await expect(rows.nth(1).getByRole('button')).toHaveCount(0);
  await expect(rows.nth(2)).toContainText('1');
  await rows.nth(2).getByRole('link', { name: 'Compare with current: version 1' }).click();
  await expect(page.getByRole('heading', { name: 'Compare description: version 1 and current' })).toBeVisible();
  await expect(page.locator('del').first()).toBeVisible();
  await expect(page.locator('ins').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Version 1, saved by .+ on / })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Current version 2, saved by .+ on / })).toBeVisible();
  await expect(page.getByText('Guests row out to her light in a hybrid room and online.')).toBeVisible();
  await page.getByRole('link', { name: 'Back to earlier versions' }).click();
  await expect(page.getByRole('heading', { name: 'Earlier versions of description' })).toBeVisible();

  // Riley may compare but not restore.
  await t.riley.goto(`/projects/${t.project}/facts/description/history`);
  await expect(t.riley.getByRole('link', { name: 'Compare with current: version 1' })).toBeVisible();
  await expect(t.riley.getByRole('button', { name: /Restore/ })).toHaveCount(0);
  await t.riley.getByRole('link', { name: 'Compare with current: version 1' }).click();
  await expect(t.riley.getByRole('button', { name: /Restore/ })).toHaveCount(0);
  await t.close();
});

test('restore saves a new version and keeps every version (layer1-facts-identifiers-activity#AC-7)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Restore '));
  await saveText(page, project, 'credits', 'First credits');
  await saveText(page, project, 'credits', 'Second credits');
  await page.goto(`/projects/${project}/facts/credits/history`);
  const restore = page.getByRole('button', { name: 'Restore version 1' });
  await restore.click();
  const dialog = page.getByRole('dialog', { name: 'Restore version 1 of credits?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Restore version 1 of credits?' })).toBeFocused();
  await expect(dialog.getByRole('button')).toHaveText(['Keep the current credits', 'Restore version 1']);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(restore).toBeFocused();

  await page.getByRole('link', { name: 'Compare with current: version 1' }).click();
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('status')).toHaveText('Credits restored to version 1, saved as version 3. Earlier versions are kept.');
  await expect(page.getByRole('status')).toBeFocused();
  await expect(page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Credits' }) })).toContainText('First credits');
  await page.goto(`/projects/${project}/facts/credits/history`);
  const rows = page.getByRole('table').getByRole('row');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(1)).toContainText('3, restored from version 1 (current)');
});

test('a save made meanwhile is never overwritten (layer1-facts-identifiers-activity#AC-8)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Conflict '));
  await saveText(page, project, 'description', 'Original');
  await page.goto(`/projects/${project}/facts/description/edit`);
  await page.getByRole('textbox', { name: 'Description' }).fill('My version');

  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const morgan = await other.newPage();
  await signIn(morgan, FIRST.jordan);
  await saveText(morgan, project, 'description', 'Their version');
  await other.close();

  await page.getByRole('button', { name: 'Save description' }).click();
  await expect(errorSummary(page)).toBeFocused();
  await expect(errorSummary(page)).toContainText(/Check before saving: .+ saved a new description at \d\d:\d\d/);
  await expect(page.getByText('Their version')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('My version');
  await page.getByRole('button', { name: 'Save my description' }).click();
  await expect(page.getByRole('status')).toHaveText('Description saved.');
  await expect(page.getByText('My version')).toBeVisible();
  await page.goto(`/projects/${project}/facts/description/history`);
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(4);
});
