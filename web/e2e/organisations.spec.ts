import { expect, test } from '@playwright/test';
import {
  FIRST,
  acceptInvitation,
  addPerson,
  createOrganisation,
  newPage,
  projectId,
  signIn,
  sql,
  startProject,
  uniq,
} from './support/world';

// Organisations and projects (docs-organisations-and-projects).

test('create an organisation (layer1-organisations-projects-people#AC-18)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  await page.goto('/organisations/new');
  await expect(page.getByRole('checkbox', { name: `${FIRST.jordan} (you)` })).toBeChecked();
  const name = uniq('Harbourfront ');
  await createOrganisation(page, name);
  await expect(page).toHaveURL(/\/organisations\/[0-9a-f-]{36}$/);
  await expect(page.getByText(`Looked after by`)).toBeVisible();
  await expect(page.locator('main')).toContainText(FIRST.jordan);
});

test('start a project (layer1-organisations-projects-people#AC-19)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgA = uniq('Org A ');
  const orgB = uniq('Org B ');
  await createOrganisation(page, orgA);
  await createOrganisation(page, orgB);
  // Someone on a project in organisation A appears as a possible owner only for A.
  const inA = await startProject(page, uniq('In A '), { organisation: orgA });
  const morganName = uniq('Morgan Ray ');
  await addPerson(page, inA, { email: `${uniq('morgan-')}@xr.test`, name: morganName, roles: ['Artist'] });

  await page.goto('/projects/new');
  await expect(page.getByLabel('Project name')).toBeVisible();
  await expect(page.getByLabel('Brief (optional)')).toBeVisible();
  const owner = page.getByLabel('Owner');
  await expect(owner.locator('option:checked')).toHaveText(`${FIRST.jordan} (you)`);
  await page.getByLabel('Organisation').selectOption({ label: orgA });
  await expect(owner.locator('option')).toContainText([`${FIRST.jordan} (you)`, morganName]);
  await page.getByLabel('Organisation').selectOption({ label: orgB });
  await expect(owner.locator('option', { hasText: morganName })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'When you start it' })).toContainText(
    'You will own it and have the Director and Producer roles.',
  );

  const name = uniq('Tide Songs ');
  await page.getByLabel('Project name').fill(name);
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Project started. You own it and have the Director and Producer roles.');
  await page.goto('/projects');
  await expect(page.getByRole('listitem').filter({ hasText: name })).toBeVisible();
});

test('roles when a project starts (layer1-organisations-projects-people#AC-20)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const org = uniq('Roles Org ');
  await createOrganisation(page, org);
  const first = await startProject(page, uniq('Seed '), { organisation: org });
  const morganEmail = `${uniq('morgan-')}@xr.test`;
  await addPerson(page, first, { email: morganEmail, name: 'Morgan Ray', roles: ['Artist'] });

  await page.goto('/projects/new');
  await page.getByLabel('Organisation').selectOption({ label: org });
  await page.getByLabel('Owner').selectOption({ label: 'Morgan Ray' });
  await expect(page.getByRole('region', { name: 'When you start it' })).toContainText(
    'Morgan Ray will own it and have the Director and Producer roles. You will have the Producer role.',
  );
  const name = uniq('Owned by Morgan ');
  await page.getByLabel('Project name').fill(name);
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Project started. Morgan Ray owns it and has the Director and Producer roles. You have the Producer role.',
  );
  const project = projectId(page);
  const roles = await sql(
    'select p.email, r.role from project_role r join person p on p.id = r.person_id where r.project_id = $1 order by p.email, r.role',
    [project],
  );
  expect(roles.rows).toEqual([
    { email: FIRST.jordan, role: 'producer' },
    { email: morganEmail, role: 'director' },
    { email: morganEmail, role: 'producer' },
  ]);
});

test('start a project with a default organisation (layer1-organisations-projects-people#AC-21)', async ({ page, browser }) => {
  // A person with an account but on no organisation: invited, signed in, then removed.
  const jordan = await newPage(browser, FIRST.jordan);
  const seed = await startProject(jordan, uniq('Seed '));
  const solo = `${uniq('solo-')}@xr.test`;
  await addPerson(jordan, seed, { email: solo, name: 'Sol Solo', roles: ['Artist'] });
  await acceptInvitation(page, solo);
  await jordan.goto(`/projects/${seed}/people`);
  await jordan.getByRole('link', { name: 'Change roles or remove Sol Solo' }).click();
  await jordan.getByRole('button', { name: 'Remove Sol Solo from the project' }).click();
  await jordan.getByRole('button', { name: 'Remove Sol Solo' }).click();
  await expect(jordan.getByRole('status')).toContainText('Sol Solo removed from');
  await jordan.context().close();

  await page.goto('/projects/new');
  await expect(page.getByText('A new organisation with the same name as the project will be made.')).toBeVisible();
  const name = uniq('Solo Show ');
  await page.getByLabel('Project name').fill(name);
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await page.getByRole('link', { name, exact: true }).last().click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page).toHaveURL(/\/organisations\//);
  await expect(page.locator('main')).toContainText('Sol Solo');
});

test('edit a project\'s name and brief (layer1-organisations-projects-people#AC-22)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Editable '));
  await page.getByRole('link', { name: 'Edit name and brief' }).click();
  const renamed = uniq('Renamed ');
  await page.getByLabel('Project name').fill(renamed);
  await page.getByLabel('Brief (optional)').fill('New brief.');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Name and brief saved.');
  await expect(page.getByRole('heading', { level: 1, name: renamed })).toBeVisible();
  await expect(page.getByText('New brief.')).toBeVisible();

  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await acceptInvitation(rileyPage, riley);
  await rileyPage.goto(`/projects/${project}`);
  await expect(rileyPage.getByRole('link', { name: 'Edit name and brief' })).toHaveCount(0);
  await expect(rileyPage.getByText(/can change the name and brief\./)).toBeVisible();
  const edit = await rileyPage.goto(`/projects/${project}/edit`);
  expect(edit?.status()).toBe(404);
  await other.close();
});

test('edit an organisation and keep someone looking after it (layer1-organisations-projects-people#AC-23)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const name = uniq('Editable Org ');
  await createOrganisation(page, name);
  await page.getByRole('link', { name: 'Edit organisation' }).click();
  const self = page.getByRole('checkbox', { name: `${FIRST.jordan} (you)` });
  await expect(self).toBeChecked();
  await expect(self).toBeDisabled();
  const renamed = uniq('Renamed Org ');
  await page.getByLabel('Organisation name').fill(renamed);
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Organisation saved.');
  await expect(page.getByRole('heading', { level: 1, name: renamed })).toBeVisible();
});

test('organisation page contents (layer1-organisations-projects-people#AC-24)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const org = uniq('Page Org ');
  await createOrganisation(page, org);
  const p1 = uniq('Shown ');
  const project = await startProject(page, p1, { organisation: org });
  await page.getByRole('link', { name: org }).first().click();
  const main = page.locator('main');
  await expect(main.getByRole('heading', { level: 1, name: org })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Looked after by' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Start a project in this organisation' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Edit organisation' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(main.getByRole('link', { name: p1 })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Organisation facts' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Add legal name' })).toBeVisible();

  // A member who does not look after it sees no Edit organisation.
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await acceptInvitation(rileyPage, riley);
  await rileyPage.goto(`/projects/${project}`);
  await rileyPage.getByRole('link', { name: org }).first().click();
  await expect(rileyPage.getByRole('heading', { level: 1, name: org })).toBeVisible();
  await expect(rileyPage.getByRole('link', { name: 'Edit organisation' })).toHaveCount(0);
  await other.close();
});

test('organisations list (layer1-organisations-projects-people#AC-25)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const org = uniq('Listed Org ');
  await createOrganisation(page, org);
  const project = await startProject(page, uniq('Listed In '), { organisation: org });
  await page.goto('/organisations');
  await expect(page.getByRole('row').filter({ hasText: org })).toContainText('Look after it');

  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await acceptInvitation(rileyPage, riley);
  await rileyPage.goto('/organisations');
  await expect(rileyPage.getByRole('row').filter({ hasText: org })).toContainText('On its projects');
  await other.close();
});

test('organisation and project errors (layer1-organisations-projects-people#AC-26)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const org = uniq('Errors Org ');
  const other = uniq('Errors Other ');
  await createOrganisation(page, org);
  await createOrganisation(page, other);

  // Empty project name keeps the brief.
  await page.goto('/projects/new');
  await page.getByLabel('Brief (optional)').fill('Keep me.');
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText('Enter the project name.');
  await expect(page.getByLabel('Brief (optional)')).toHaveValue('Keep me.');

  // Duplicate name in the same organisation; fine in another.
  const name = uniq('Tide Songs ');
  await startProject(page, name, { organisation: org });
  await page.goto('/projects/new');
  await page.getByLabel('Project name').fill(name);
  await page.getByLabel('Organisation').selectOption({ label: org });
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
    `There is already a project called ${name} in ${org}. Choose a different name.`,
  );
  await page.getByLabel('Organisation').selectOption({ label: other });
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();

  // Organisation names.
  await page.goto('/organisations/new');
  await page.getByRole('button', { name: 'Create organisation' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText('Enter the organisation name.');
  await page.getByLabel('Organisation name').fill(org);
  await page.getByRole('button', { name: 'Create organisation' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
    `You already look after an organisation called ${org}. Choose a different name.`,
  );

  // An owner removed from the organisation's projects while the form was open.
  const seed = await startProject(page, uniq('Seed '), { organisation: org });
  const leaving = `${uniq('leaving-')}@xr.test`;
  await addPerson(page, seed, { email: leaving, name: 'Lee Leaving', roles: ['Artist'] });
  await page.goto('/projects/new');
  await page.getByLabel('Project name').fill(uniq('Race '));
  await page.getByLabel('Organisation').selectOption({ label: org });
  await page.getByLabel('Owner').selectOption({ label: 'Lee Leaving' });
  await sql('delete from project_role where person_id = (select id from person where email = $1)', [leaving]);
  await page.getByRole('button', { name: 'Start project' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
    'The person you chose can no longer own a project here. Choose another owner.',
  );

  // A double submit makes one project.
  const once = uniq('Once ');
  await page.goto('/projects/new');
  await page.getByLabel('Project name').fill(once);
  await page.getByRole('button', { name: 'Start project' }).dblclick();
  await expect(page.getByRole('heading', { level: 1, name: once })).toBeVisible();
  const count = await sql('select count(*)::int as n from project where name = $1', [once]);
  expect(count.rows[0].n).toBe(1);
});
