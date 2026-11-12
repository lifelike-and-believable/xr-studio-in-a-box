import { expect, test } from '@playwright/test';
import { errorSummary, saveText, team } from './support/slice2';
import { FIRST, createOrganisation, signIn, startProject, uniq } from './support/world';

// Bank details, tax numbers and identifier formats (docs-identifier-filter).

test('a fact holding an identifier is not saved (layer1-facts-identifiers-activity#AC-21)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Held fact '));
  await page.goto(`/projects/${project}/facts/description/edit`);
  const box = page.getByRole('textbox', { name: 'Description' });
  await box.fill('Grant paid to account 00123-004-1234567. A lantern keeper.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await expect(errorSummary(page)).toBeFocused();
  await expect(page).toHaveTitle(/^Error: Not saved/);
  await expect(errorSummary(page).getByRole('heading')).toHaveText('Not saved: this looks like a bank account number');
  await expect(errorSummary(page).locator('mark')).toHaveText('00123-004-1234567');
  await expect(errorSummary(page)).toContainText('Description: "00123-004-1234567" matches the format for a bank account number');
  await expect(page.getByText('Take out "00123-004-1234567", or confirm it is not a bank account number.')).toBeVisible();
  await expect(box).toHaveValue('Grant paid to account 00123-004-1234567. A lantern keeper.');
  await expect(box).toHaveAttribute('aria-invalid', 'true');
  await page.goto(`/projects/${project}/facts`);
  await expect(page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Description' }) })).toContainText('Not recorded yet.');
});

test('overlapping formats and several matches (layer1-facts-identifiers-activity#AC-22)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Several '));
  await page.goto(`/projects/${project}/facts/description/edit`);
  await page.getByRole('textbox', { name: 'Description' }).fill('Ticket booking reference 046454286.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await expect(errorSummary(page).getByRole('heading')).toHaveText('Not saved: this looks like a Social Insurance Number or a Business Number');
  await expect(page.getByText('Take out "046454286", or confirm it is none of these.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'It is none of these' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Description' }).fill('SIN 046 454 286 and account 00123-004-1234567');
  await page.getByRole('button', { name: 'Save description' }).click();
  const items = errorSummary(page).getByRole('listitem');
  await expect(items).toHaveCount(2);
  await expect(items.getByRole('link')).toHaveCount(2);
  await expect(items.first().getByRole('link')).toHaveAttribute('href', '#text');
});

test('confirm a false match and save (layer1-facts-identifiers-activity#AC-23)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Confirm '));
  await page.goto(`/projects/${project}/facts/description/edit`);
  const box = page.getByRole('textbox', { name: 'Description' });
  await box.fill('Prop catalogue 00123-004-1234567.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await box.fill('Prop catalogue 00123-004-1234567. A lantern keeper.');
  await page.getByRole('button', { name: 'It is not a bank account number' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project}/facts/description/confirm$`));
  await expect(page.getByRole('heading', { name: 'Confirm it is not a bank account number' })).toBeVisible();
  await expect(page.locator('mark')).toHaveText('00123-004-1234567');

  const answer = page.getByLabel('What is it?');
  await page.getByRole('button', { name: 'Confirm and save description' }).click();
  await expect(errorSummary(page)).toContainText('Say in a few words what the number is.');
  await answer.fill('x'.repeat(101));
  await page.getByRole('button', { name: 'Confirm and save description' }).click();
  await expect(errorSummary(page)).toContainText('Keep your answer to 100 characters or fewer.');
  await expect(answer).toHaveValue('x'.repeat(101));
  await answer.fill('It is 046 454 286');
  await page.getByRole('button', { name: 'Confirm and save description' }).click();
  await expect(errorSummary(page)).toContainText(
    'Your answer also looks like a Social Insurance Number or a Business Number. Say what it is in words, without the number.',
  );

  await page.getByRole('link', { name: 'Go back and edit the text' }).click();
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('Prop catalogue 00123-004-1234567. A lantern keeper.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await page.getByRole('button', { name: 'It is not a bank account number' }).click();
  await page.getByLabel('What is it?').fill('Catalogue number for the lantern prop');
  await page.getByRole('button', { name: 'Confirm and save description' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Description saved. Your confirmation that "00123-004-1234567" is not a bank account number is recorded in Activity.',
  );
  await expect(page.getByText('Prop catalogue 00123-004-1234567. A lantern keeper.')).toBeVisible();
  await page.goto(`/projects/${project}/activity`);
  await expect(page.getByRole('table')).toContainText(
    'Saved the description (version 1) after confirming that text in it is not a bank account number ("Catalogue number for the lantern prop")',
  );
});

test('a confirmation covers that text in that fact only (layer1-facts-identifiers-activity#AC-24)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Covered '));
  await page.goto(`/projects/${project}/facts/plan/edit`);
  await page.getByRole('textbox', { name: 'Plan' }).fill('Ticket 046454286');
  await page.getByRole('button', { name: 'Save plan' }).click();
  await page.getByRole('button', { name: 'It is none of these' }).click();
  await page.getByLabel('What is it?').fill('Ticket number');
  await page.getByRole('button', { name: 'Confirm and save plan' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await saveText(page, project, 'plan', 'Ticket 046-454-286, shows in April.');
  await expect(page.getByRole('status')).toHaveText('Plan saved.');
  await page.goto(`/projects/${project}/facts/credits/edit`);
  await page.getByRole('textbox', { name: 'Credits' }).fill('Ticket 046454286');
  await page.getByRole('button', { name: 'Save credits' }).click();
  await expect(errorSummary(page)).toContainText('Not saved');
});

test('identifier formats page and starter list (layer1-facts-identifiers-activity#AC-27)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await page.goto(`/organisations/${t.org}`);
  await page.getByRole('navigation', { name: 'Organisation' }).getByRole('link', { name: 'Identifier formats' }).click();
  await expect(page).toHaveURL(new RegExp(`/organisations/${t.org}/identifier-formats$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Identifier formats' })).toBeVisible();
  await expect(page.getByText(/^Text matching a format that is On is not saved where agents can read it/)).toBeVisible();
  const table = page.getByRole('table', { name: `Identifier formats for ${t.orgName}` });
  const rows = table.getByRole('row');
  await expect(rows).toHaveCount(6);
  for (const [i, name] of ['Bank account number (Canada)', 'Social Insurance Number', 'Business Number', 'GST/HST number', 'Payment card number'].entries()) {
    await expect(rows.nth(i + 1)).toContainText(name);
    await expect(rows.nth(i + 1)).toContainText('On');
    await expect(rows.nth(i + 1)).toContainText('Starter');
    await expect(rows.nth(i + 1).getByRole('button', { name: `Turn off ${name}` })).toBeVisible();
    await expect(rows.nth(i + 1).getByRole('button', { name: /^Remove/ })).toHaveCount(0);
  }
  await expect(rows.nth(1)).toContainText('like 00123-004-1234567');
  for (const other of [t.riley, t.tess]) {
    await other.goto(`/organisations/${t.org}/identifier-formats`);
    await expect(other.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  }
  await t.close();
});

test('add a format (layer1-facts-identifiers-activity#AC-28)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const org = await createOrganisation(page, uniq('Formats Org '));
  await page.goto(`/organisations/${org}/identifier-formats`);
  await page.getByRole('link', { name: 'Add a format' }).click();
  await expect(page).toHaveURL(new RegExp(`/organisations/${org}/identifier-formats/new$`));
  const status = page.locator('#example-result');
  await expect(status).toHaveAttribute('role', 'status');
  await expect(status).toHaveText('');

  await page.getByLabel('Name').fill('Funder account number');
  await page.getByLabel('Pattern').fill('###-AA-#');
  await page.getByLabel(/Try it with an example/).fill('204-HP-11872');
  await page.getByLabel(/Try it with an example/).blur();
  await expect(status).toHaveText('"204-HP-11872" does not match this pattern.');
  await page.getByLabel('Pattern').fill('###-AA-#####');
  await page.getByLabel(/Try it with an example/).fill('204 hp 11872');
  await expect(status).toHaveText('"204 hp 11872" matches this pattern.');

  await page.getByLabel('Pattern').fill('##-##');
  await page.getByRole('button', { name: 'Add format' }).click();
  await expect(errorSummary(page)).toContainText('Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices.');
  await expect(page.getByLabel('Name')).toHaveValue('Funder account number');
  await expect(page.getByLabel(/Try it with an example/)).toHaveValue('204 hp 11872');
  await page.getByLabel('Name').fill('');
  await page.getByLabel('Pattern').fill('');
  await page.getByRole('button', { name: 'Add format' }).click();
  await expect(errorSummary(page)).toContainText('Enter a name for the format.');
  await expect(errorSummary(page)).toContainText('Enter a pattern, like ###-AA-#####.');

  await page.getByLabel('Name').fill('Funder account number');
  await page.getByLabel('Pattern').fill('###-AA-#####');
  await page.getByRole('button', { name: 'Add format' }).click();
  await expect(page.getByRole('status')).toHaveText('Funder account number added. It is checked from now on; text already saved is not changed.');
  const row = page.getByRole('row').filter({ hasText: 'Funder account number' });
  await expect(row).toContainText('On');
  await expect(row).toContainText(/, \d{1,2} [A-Z][a-z]+/);
});

test('turn a format off and on (layer1-facts-identifiers-activity#AC-29)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Toggle Org ');
  const org = await createOrganisation(page, orgName);
  const project = await startProject(page, uniq('Toggle '), { organisation: orgName });
  await page.goto(`/organisations/${org}/identifier-formats`);
  const turnOff = page.getByRole('button', { name: 'Turn off Business Number' });
  await turnOff.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button')).toHaveText(['Keep it on', 'Turn off']);
  await page.keyboard.press('Escape');
  await expect(turnOff).toBeFocused();
  await turnOff.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Turn off' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Business Number turned off. Text that only matches it is now saved where agents can read it. Turn it on again at any time.',
  );
  const row = page.getByRole('row').filter({ hasText: 'Business Number' });
  await expect(row).toContainText('Off');
  await saveText(page, project, 'plan', 'Order 123456789');
  await expect(page.getByRole('status')).toHaveText('Plan saved.');

  await page.goto(`/organisations/${org}/identifier-formats`);
  await page.getByRole('button', { name: 'Turn on Business Number' }).click();
  await expect(page.getByRole('status')).toHaveText('Business Number turned on. It is checked from now on; text already saved is not changed.');
  await page.goto(`/projects/${project}/facts`);
  await expect(page.getByText('Order 123456789')).toBeVisible();
});

test('remove an added format (layer1-facts-identifiers-activity#AC-30)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Remove Org ');
  const org = await createOrganisation(page, orgName);
  await page.goto(`/organisations/${org}/identifier-formats/new`);
  await page.getByLabel('Name').fill('Prop number');
  await page.getByLabel('Pattern').fill('AA-######');
  await page.getByRole('button', { name: 'Add format' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.getByRole('button', { name: 'Remove Prop number' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button')).toHaveText(['Keep Prop number', 'Remove Prop number']);
  await dialog.getByRole('button', { name: 'Remove Prop number' }).click();
  await expect(page.getByRole('status')).toHaveText(
    `Prop number removed. It is no longer checked in any of ${orgName}'s projects. Its removal is recorded in Activity.`,
  );
  await expect(page.getByRole('row').filter({ hasText: 'Prop number' })).toHaveCount(0);
  await page.goto(`/organisations/${org}/activity`);
  await expect(page.getByRole('table')).toContainText('Removed the identifier format "Prop number"');
});

test('who may confirm and change formats; agents refused (layer1-facts-identifiers-activity#AC-31)', async ({ page, browser }) => {
  const t = await team(page, browser);
  const api = await t.riley.request.post(`/api/v1/organisations/${t.org}/identifier-formats`, { data: { name: 'Riley', pattern: '######' } });
  expect(api.status()).toBe(403);
  const confirm = await t.riley.request.post(`/api/v1/projects/${t.project}/facts/plan/confirm`, {
    data: { values: { text: '046 454 286' }, baseVersion: 0, answer: 'Ticket' },
  });
  expect(confirm.status()).toBe(403);
  await t.riley.goto(`/projects/${t.project}/facts/plan/confirm`);
  await expect(t.riley.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await t.close();
});
