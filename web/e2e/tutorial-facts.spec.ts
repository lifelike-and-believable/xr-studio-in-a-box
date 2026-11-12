import { expect, test } from '@playwright/test';
import { PNG, pdfWithPages } from '../test/support/documents';
import { FIRST, acceptInvitation, addPerson, createOrganisation, signIn, startProject, uniq } from './support/world';

// Runs docs/tutorials/layer1-facts-identifiers-activity.md (tutorial-layer1-facts-identifiers-activity)
// step by step against the built app, so a tutorial that no longer matches the product fails.
// Step numbers below are the tutorial's.

test('tutorial: record a project once, keep identifiers out, and read who changed what (tutorial-layer1-facts-identifiers-activity)', async ({ page, browser }) => {
  test.setTimeout(180_000);
  const org = uniq('Harbourfront Puppet Co. ');
  const project = uniq('The Lantern Keeper ');

  // Step 1: sign in, create the organisation and start the project in it.
  await signIn(page, FIRST.jordan);
  const orgId = await createOrganisation(page, org);
  const projectId = await startProject(page, project, { organisation: org });

  // Step 2: the Facts tab, nothing recorded yet.
  await page.getByRole('navigation', { name: 'Project' }).getByRole('link', { name: 'Facts' }).click();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Description', 'Plan', 'Budget', 'Credits', 'Collaborators', 'Schedule', 'Work samples', 'Capacity']);
  await expect(page.getByText('Not recorded yet.')).toHaveCount(8);
  await expect(page.getByText(`${org} has no facts recorded yet. People who look after it add them on its page.`)).toBeVisible();

  // Step 3: add the description.
  await page.getByRole('link', { name: 'Add description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('A lantern keeper on a drowned coast talks with guests who row out to her light.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await expect(page.getByRole('status')).toHaveText('Description saved.');
  await expect(page.getByText(/Last changed by .+, \d{1,2} [A-Z][a-z]+ at \d\d:\d\d/).first()).toBeVisible();

  // Step 4: the budget.
  await page.getByRole('link', { name: 'Add budget' }).click();
  await page.getByLabel('Total in Canadian dollars').fill('$148,000');
  await page.getByLabel('Note (optional)').fill('Fees, build, venue and streaming.');
  await page.getByRole('button', { name: 'Save budget' }).click();
  await expect(page.getByText('Total: $148,000 CAD. Note: Fees, build, venue and streaming.')).toBeVisible();

  // Step 5: capacity, with a mistake first.
  await page.getByRole('link', { name: 'Add capacity' }).click();
  await page.getByLabel('Guests in the room per show').fill('forty');
  await page.getByLabel('Viewers online per show').fill('200');
  await page.getByRole('button', { name: 'Save capacity' }).click();
  await expect(page.getByText('Enter the number of guests in the room as a whole number, like 40.').first()).toBeVisible();
  await page.getByLabel('Guests in the room per show').fill('40');
  await page.getByRole('button', { name: 'Save capacity' }).click();
  await expect(page.getByText('40 guests in the room and 200 viewers online, per show.')).toBeVisible();

  // Step 6: change the description, compare, and restore the first version.
  await page.getByRole('link', { name: 'Edit description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('A lantern keeper on a drowned coast talks with the guests who row out to her light. Streamed and in a hybrid room.');
  await page.getByRole('button', { name: 'Save description' }).click();
  await expect(page.getByRole('status')).toHaveText('Description saved.');
  await page.getByRole('link', { name: 'Earlier versions of description' }).click();
  await page.getByRole('link', { name: 'Compare with current: version 1' }).click();
  await expect(page.getByRole('heading', { name: 'Compare description: version 1 and current' })).toBeVisible();
  await expect(page.locator('ins').first()).toBeVisible();
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('dialog', { name: 'Restore version 1 of description?' })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('status')).toHaveText('Description restored to version 1, saved as version 3. Earlier versions are kept.');

  // Step 7: text that looks like a bank account number, confirmed as a catalogue number.
  await page.getByRole('link', { name: 'Add plan' }).click();
  await page.getByRole('textbox', { name: 'Plan' }).fill('Build the lantern prop, catalogue 00123-004-1234567, in March.');
  await page.getByRole('button', { name: 'Save plan' }).click();
  await expect(page.locator('.summary[role="alert"]').getByRole('heading')).toHaveText('Not saved: this looks like a bank account number');
  await page.getByRole('button', { name: 'It is not a bank account number' }).click();
  await page.getByLabel('What is it?').fill('Catalogue number for the lantern prop');
  await page.getByRole('button', { name: 'Confirm and save plan' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Plan saved. Your confirmation that "00123-004-1234567" is not a bank account number is recorded in Activity.',
  );

  // Step 8: work samples, one held because its text matches.
  await page.getByRole('link', { name: 'Add work samples' }).click();
  await page.getByLabel('Title').fill('Lantern test');
  await page.getByLabel('File').setInputFiles({ name: 'lantern-test.png', mimeType: 'image/png', buffer: Buffer.from(PNG) });
  await page.getByRole('button', { name: 'Add work sample' }).click();
  await expect(page.getByRole('status')).toHaveText('Lantern test added to the work samples.');
  await page.getByLabel('Title').fill('Grant letter');
  await page.getByLabel('File').setInputFiles({
    name: 'grant-letter.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(pdfWithPages(['Dear Harbourfront,', 'GST 123456789 RT0001'])),
  });
  await page.getByRole('button', { name: 'Add work sample' }).click();
  await expect(page.locator('.summary[role="alert"]')).toContainText('Page 2 of grant-letter.pdf has text matching the format for a GST/HST number');
  await page.goto(`/projects/${projectId}/facts/work-samples`);
  await expect(page.getByText(/^Held: grant-letter\.pdf\./)).toBeVisible();
  await page.getByRole('button', { name: 'Delete grant-letter.pdf now' }).click();
  await expect(page.getByRole('status')).toHaveText('grant-letter.pdf deleted.');

  // Step 9: remove a sample, then bring it back from an earlier version.
  await page.getByRole('button', { name: 'Remove Lantern test' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove Lantern test' }).click();
  await expect(page.getByRole('status')).toHaveText('Lantern test removed from the work samples. It stays in the earlier versions of Work samples.');
  await page.getByRole('link', { name: 'Earlier versions of work samples' }).click();
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('status')).toHaveText('Work samples restored to version 1, saved as version 3. Earlier versions are kept.');

  // Step 10: the organisation's bio, read by the project.
  await page.getByRole('link', { name: org }).first().click();
  await expect(page.getByRole('heading', { level: 2, name: 'Organisation facts' })).toBeVisible();
  await page.getByRole('link', { name: 'Add bio' }).click();
  await page.getByRole('textbox', { name: 'Bio', exact: true }).fill('A Toronto company making live puppetry for rooms and screens since 2014.');
  await page.getByRole('button', { name: 'Save bio' }).click();
  await expect(page.getByRole('status')).toHaveText(`Bio saved. Every project in ${org} now reads the new bio.`);
  await page.goto(`/projects/${projectId}/facts`);
  await expect(page.getByRole('heading', { name: `From ${org}` })).toBeVisible();
  await expect(page.getByText('A Toronto company making live puppetry for rooms and screens since 2014.')).toBeVisible();

  // Step 11: a funder applicant profile.
  await page.goto(`/organisations/${orgId}`);
  await page.getByRole('link', { name: 'Add the profile for Canada Council for the Arts' }).click();
  await page.getByLabel('Applicant name as registered with the funder').fill('Harbourfront Puppet Company Inc.');
  await page.getByLabel('Applicant category').fill('Arts organisation');
  await page.getByLabel('Mandate').fill('Live puppetry that brings audiences in rooms and online into the same story.');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toHaveText(`Applicant profile for Canada Council for the Arts saved. Every project in ${org} now reads it.`);

  // Step 12: the identifier formats.
  await page.getByRole('navigation', { name: 'Organisation' }).getByRole('link', { name: 'Identifier formats' }).click();
  await page.getByRole('link', { name: 'Add a format' }).click();
  await page.getByLabel('Name').fill('Funder account number');
  await page.getByLabel('Pattern').fill('###-AA-#####');
  await page.getByLabel(/Try it with an example/).fill('204-HP-11872');
  await page.getByLabel(/Try it with an example/).blur();
  await expect(page.locator('#example-result')).toHaveText('"204-HP-11872" matches this pattern.');
  await page.getByRole('button', { name: 'Add format' }).click();
  await expect(page.getByRole('status')).toHaveText('Funder account number added. It is checked from now on; text already saved is not changed.');
  await page.getByRole('button', { name: 'Turn off Business Number' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Turn off' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Business Number turned off. Text that only matches it is now saved where agents can read it. Turn it on again at any time.',
  );
  await page.getByRole('button', { name: 'Turn on Business Number' }).click();
  await expect(page.getByRole('status')).toHaveText('Business Number turned on. It is checked from now on; text already saved is not changed.');

  // Step 13: the project's activity, filtered to Facts.
  await page.goto(`/projects/${projectId}/activity`);
  const table = page.getByRole('table', { name: 'Activity, newest first' });
  await expect(table).toContainText('Saved the plan (version 1) after confirming that text in it is not a bank account number ("Catalogue number for the lantern prop")');
  await expect(table).toContainText('Restored the description to version 1, saved as version 3');
  await expect(table).toContainText('Deleted grant-letter.pdf, held because its text looked like it had a GST/HST number');
  await page.getByLabel('Area').selectOption({ label: 'Facts' });
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByText(/^\d+ entries: Facts\.$/)).toBeFocused();

  // Step 14: the organisation's activity.
  await page.goto(`/organisations/${orgId}/activity`);
  await expect(page.getByRole('table', { name: 'Activity, newest first' })).toContainText('Added the identifier format "Funder account number"');
  await expect(page.getByRole('table', { name: 'Activity, newest first' })).toContainText('Saved the bio (version 1)');

  // Step 15: what an artist sees.
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, projectId, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await context.newPage();
  await acceptInvitation(rileyPage, riley);
  await rileyPage.goto(`/projects/${projectId}/facts`);
  await expect(rileyPage.getByText('The budget is visible to the director and producer.')).toBeVisible();
  await expect(rileyPage.getByRole('link', { name: /^(Edit|Add)\b/ })).toHaveCount(0);
  await expect(rileyPage.getByRole('navigation', { name: 'Project' }).getByRole('link')).toHaveText(['Overview', 'Facts', 'People']);
  await context.close();
});
