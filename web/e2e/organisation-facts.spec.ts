import { expect, test } from '@playwright/test';
import { errorSummary, saveOrgText, team } from './support/slice2';
import { FIRST, createOrganisation, signIn, startProject, uniq } from './support/world';

// Organisation facts (docs-organisation-facts).

test('organisation page shows its facts (layer1-facts-identifiers-activity#AC-13)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Org Facts ');
  const org = await createOrganisation(page, orgName);
  await page.goto(`/organisations/${org}`);
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: 'Start a project in this organisation' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Edit organisation' })).toBeVisible();
  await expect(main.getByRole('navigation', { name: 'Organisation' }).getByRole('link')).toHaveText(['Identifier formats', 'Activity']);
  const h2 = main.getByRole('heading', { level: 2 });
  await expect(h2).toHaveText(['Looked after by', 'Organisation facts', 'Projects']);
  await expect(main.getByText('Bank details and tax numbers are not organisation facts. They will be kept in the protected store, which comes in a later release; until then keep them out of XR Studio.')).toBeVisible();
  await expect(main.getByRole('heading', { level: 3 })).toHaveText(['Legal name', 'Bio', 'Company history', 'Funder applicant profiles', 'Standard work samples']);
  await expect(main.getByRole('link', { name: 'Add legal name' })).toBeVisible();

  await saveOrgText(page, org, 'legal-name', 'Legal name', 'Harbourfront Puppet Company Inc.');
  const legal = main.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Legal name' }) });
  await expect(legal).toContainText('Harbourfront Puppet Company Inc.');
  await expect(legal).toContainText(/Last changed by .+, \d{1,2} [A-Z][a-z]+ at \d\d:\d\d/);
  await expect(legal.getByRole('link', { name: 'Edit legal name' })).toBeVisible();
  await expect(legal.getByRole('link', { name: 'Earlier versions of legal name' })).toBeVisible();
});

test('edit, compare and restore an organisation fact (layer1-facts-identifiers-activity#AC-14)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Bio Org ');
  const org = await createOrganisation(page, orgName);
  await page.goto(`/organisations/${org}/facts/bio/edit`);
  await page.getByRole('textbox', { name: 'Bio', exact: true }).fill('A Toronto company.');
  await page.getByRole('button', { name: 'Save bio' }).click();
  await expect(page.getByRole('status')).toHaveText(`Bio saved. Every project in ${orgName} now reads the new bio.`);
  await expect(page.getByRole('status')).toBeFocused();
  await saveOrgText(page, org, 'bio', 'Bio', 'A Toronto company making live puppetry.');
  await page.goto(`/organisations/${org}/facts/bio/history`);
  await page.getByRole('link', { name: 'Compare with current: version 1' }).click();
  await expect(page.getByRole('heading', { name: 'Compare bio: version 1 and current' })).toBeVisible();
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('status')).toHaveText('Bio restored to version 1, saved as version 3. Earlier versions are kept.');

  // Save made meanwhile.
  await page.goto(`/organisations/${org}/facts/bio/edit`);
  await page.getByRole('textbox', { name: 'Bio', exact: true }).fill('Mine');
  const other = await page.context().browser()?.newContext({ baseURL: 'http://127.0.0.1:3100' });
  if (!other) throw new Error('no browser');
  const second = await other.newPage();
  await signIn(second, FIRST.jordan);
  await saveOrgText(second, org, 'bio', 'Bio', 'Theirs');
  await other.close();
  await page.getByRole('button', { name: 'Save bio' }).click();
  await expect(errorSummary(page)).toContainText(/Check before saving: .+ saved a new bio at/);
  await expect(page.getByRole('button', { name: 'Save my bio' })).toBeVisible();
});

test("both projects read the organisation's bio (layer1-facts-identifiers-activity#AC-15)", async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Shared ');
  const org = await createOrganisation(page, orgName);
  const one = await startProject(page, uniq('One '), { organisation: orgName });
  const two = await startProject(page, uniq('Two '), { organisation: orgName });
  await saveOrgText(page, org, 'bio', 'Bio', 'First bio.');
  await saveOrgText(page, org, 'bio', 'Bio', 'Second bio.');
  for (const project of [one, two]) {
    await page.goto(`/projects/${project}/facts`);
    await expect(page.getByText('Second bio.')).toBeVisible();
    await expect(page.getByText('First bio.')).toHaveCount(0);
  }
});

test('record a funder applicant profile (layer1-facts-identifiers-activity#AC-16)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Funder Org ');
  const org = await createOrganisation(page, orgName);
  await page.goto(`/organisations/${org}`);
  const profiles = page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Funder applicant profiles' }) });
  for (const funder of ['Canada Council for the Arts', 'Canada Media Fund', 'Creative BC', 'Epic MegaGrants']) {
    await expect(profiles.getByRole('listitem').filter({ hasText: funder })).toContainText('not recorded yet');
  }
  await profiles.getByRole('link', { name: 'Add the profile for Canada Council for the Arts' }).click();
  await expect(page).toHaveURL(new RegExp(`/organisations/${org}/facts/funder-profile-canada-council/edit$`));
  await expect(page.getByRole('heading', { name: 'Applicant profile for Canada Council for the Arts' })).toBeVisible();
  await page.getByLabel('Applicant name as registered with the funder').fill('Harbourfront Puppet Company Inc.');
  await page.getByLabel('Applicant category').fill('Arts organisation');
  await page.getByLabel("Funder's applicant profile number (optional)").fill('046 454 286');
  await page.getByLabel('Mandate').fill('Live puppetry.');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(errorSummary(page)).toContainText('Not saved: this looks like a Social Insurance Number or a Business Number');
  await expect(page.getByLabel('Mandate')).toHaveValue('Live puppetry.');
  await page.getByLabel("Funder's applicant profile number (optional)").fill('');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toHaveText(`Applicant profile for Canada Council for the Arts saved. Every project in ${orgName} now reads it.`);
  const line = profiles.getByRole('listitem').filter({ hasText: 'Canada Council for the Arts' });
  await expect(line).toContainText('recorded');
  await expect(line.getByRole('link', { name: 'Edit the profile for Canada Council for the Arts' })).toBeVisible();
  await expect(line.getByRole('link', { name: 'Earlier versions of the profile for Canada Council for the Arts' })).toBeVisible();

  // No field is required.
  await page.goto(`/organisations/${org}/facts/funder-profile-epic-megagrants/edit`);
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toHaveText(`Applicant profile for Epic MegaGrants saved. Every project in ${orgName} now reads it.`);
});

test('organisation facts by role, with a narrow role on one project (layer1-facts-identifiers-activity#AC-18)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await saveOrgText(page, t.org, 'bio', 'Bio', 'Our bio.');
  await page.goto(`/organisations/${t.org}/facts/funder-profile-creative-bc/edit`);
  await page.getByLabel('Mandate').fill('Secret mandate words');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toBeVisible();

  await t.riley.goto(`/organisations/${t.org}`);
  await expect(t.riley.getByText('Our bio.')).toBeVisible();
  await expect(t.riley.getByText('Visible to the people who look after the organisation, and to the director and producer on its projects.')).toBeVisible();
  await expect(t.riley.getByText('Secret mandate words')).toHaveCount(0);
  await expect(t.riley.getByRole('link', { name: /^(Edit|Add)\b/ })).toHaveCount(0);
  await expect(t.riley.getByRole('navigation', { name: 'Organisation' })).toHaveCount(0);
  for (const path of ['facts/bio/edit', 'identifier-formats', 'activity', 'facts/funder-profile-creative-bc/history']) {
    await t.riley.goto(`/organisations/${t.org}/${path}`);
    await expect(t.riley.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  }

  // A producer on a project who does not look after the organisation sees the profiles, without Edit.
  const producerEmail = `${uniq('pat-')}@xr.test`;
  await page.goto(`/projects/${t.project}/people/new`);
  await page.getByLabel('Email address').fill(producerEmail);
  await page.getByLabel('Name (optional)').fill('Pat Producer');
  await page.getByRole('checkbox', { name: 'Producer', exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const pat = await context.newPage();
  const { acceptInvitation } = await import('./support/world');
  await acceptInvitation(pat, producerEmail);
  await pat.goto(`/organisations/${t.org}`);
  await expect(pat.getByRole('listitem').filter({ hasText: 'Creative BC' })).toContainText('recorded');
  await expect(pat.getByRole('link', { name: /^(Edit|Add)\b/ })).toHaveCount(0);
  await pat.getByRole('link', { name: 'Earlier versions of the profile for Creative BC' }).click();
  await expect(pat).toHaveURL(new RegExp(`/organisations/${t.org}/facts/funder-profile-creative-bc/history$`));
  await expect(pat.getByRole('table').getByRole('row')).toHaveCount(2);
  const patApi = await pat.request.get(`/api/v1/organisations/${t.org}/facts/funder-profile-creative-bc`);
  expect(JSON.stringify(await patApi.json())).toContain('Secret mandate words');
  const rileyApi = await t.riley.request.get(`/api/v1/organisations/${t.org}/facts/funder-profile-creative-bc`);
  expect(rileyApi.status()).toBe(404);
  await pat.goto(`/organisations/${t.org}/activity`);
  await expect(pat.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await context.close();
  await t.close();
});
