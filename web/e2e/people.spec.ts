import { expect, test, type Browser } from '@playwright/test';
import {
  FIRST,
  acceptInvitation,
  addPerson,
  forgetSends,
  linkIn,
  mailsTo,
  nextMail,
  signIn,
  sql,
  startProject,
  uniq,
} from './support/world';

// People and roles (docs-people-and-roles).

async function invitee(browser: Browser, address: string) {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const page = await context.newPage();
  await acceptInvitation(page, address);
  return page;
}

test('people list and statuses (layer1-organisations-projects-people#AC-28)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Statuses '));
  const riley = `${uniq('riley-')}@xr.test`;
  const kim = `${uniq('kim-')}@xr.test`;
  const kai = `${uniq('kai-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist', 'Sound designer'] });
  await addPerson(page, project, { email: kim, name: 'Kim Lee', roles: ['Artist'] });
  await addPerson(page, project, { email: kai, name: 'Kai Morin', roles: ['Performer'] });
  const rileyPage = await invitee(browser, riley);

  await page.goto(`/projects/${project}/people`);
  const row = (name: string) => page.getByRole('row').filter({ hasText: name });
  await expect(row(FIRST.jordan)).toContainText('Owner');
  await expect(row(FIRST.jordan)).toContainText('Director, Producer');
  await expect(row('Riley Chen')).toContainText('Artist, Sound designer');
  await expect(row('Riley Chen')).toContainText('Signed in');
  await expect(row('Kim Lee')).toContainText('Invited, not signed in yet');
  await expect(row('Kai Morin')).toContainText('No dashboard access');
  await rileyPage.context().close();
});

test('add a person (layer1-organisations-projects-people#AC-29)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Adding '));
  await page.goto(`/projects/${project}/people/new`);
  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByLabel('Name (optional)')).toBeVisible();
  const artist = page.getByRole('checkbox', { name: 'Artist', exact: true });
  await expect(artist).toHaveAccessibleDescription(/Makes characters, environments and effects\..*In the dashboard today: sees the project and who is on it\./);
  const roles = page.getByRole('checkbox');
  await expect(roles).toHaveCount(11);
  await page.getByLabel('Email address').fill('riley@example.com');
  await artist.check();
  const summary = page.getByRole('region', { name: /Before you add/ });
  await expect(summary).toContainText('Before you add riley@example.com');
  await expect(summary).toContainText('They will get an invitation email with a link that works once, for 7 days.');
  await page.getByLabel('Name (optional)').fill('Riley Chen');
  await expect(summary).toContainText('Before you add Riley Chen');
});

test('what an added person gets (layer1-organisations-projects-people#AC-30)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Outcomes '));

  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist', 'Sound designer'] });
  await expect(page.getByRole('status')).toHaveText(
    `Riley Chen added as Artist and Sound designer. We have emailed ${riley} an invitation link that lasts 7 days.`,
  );
  expect(mailsTo(riley).at(-1)?.subject).toMatch(/^You have been added to .* in XR Studio$/);

  const kai = `${uniq('kai-')}@xr.test`;
  await addPerson(page, project, { email: kai, name: 'Kai Morin', roles: ['Performer'] });
  await expect(page.getByRole('status')).toHaveText(
    'Kai Morin added as Performer. XR Studio has not emailed Kai Morin: Performer does not use the dashboard. They will get a link to their own page when there is something for them, so let them know.',
  );
  expect(mailsTo(kai)).toHaveLength(0);
  const accounts = await sql('select count(*)::int as n from auth_user where lower(email) = lower($1)', [kai]);
  expect(accounts.rows[0].n).toBe(0);

  // Someone who already uses XR Studio on another project.
  const sam = `${uniq('sam-')}@xr.test`;
  await addPerson(page, project, { email: sam, name: 'Sam Okafor', roles: ['Technical artist'] });
  const samPage = await invitee(browser, sam);
  const second = await startProject(page, uniq('Second '));
  const before = mailsTo(sam).length;
  await addPerson(page, second, { email: sam, roles: ['Technical artist'] });
  await expect(page.getByRole('status')).toHaveText(
    `Sam Okafor added as Technical artist. We have emailed ${sam} a link to the project.`,
  );
  const mail = await nextMail(sam, before);
  expect(linkIn(mail)).toContain(`/projects/${second}`);
  await samPage.context().close();
});

test('send an invitation again (layer1-organisations-projects-people#AC-31)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Resend '));
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const invitation = mailsTo(riley).at(-1);
  if (!invitation) throw new Error('no invitation was captured');
  const first = linkIn(invitation);

  await forgetSends(riley);
  const before = mailsTo(riley).length;
  await page.getByRole('button', { name: 'Send the sign-in link again to Riley Chen' }).click();
  await expect(page.getByRole('status')).toHaveText(
    `We have sent Riley Chen a new invitation link to ${riley}. It lasts 7 days. You can send another in a minute.`,
  );
  await nextMail(riley, before);
  await page.getByRole('button', { name: 'Send the sign-in link again to Riley Chen' }).click();
  await expect(page.getByRole('status')).toHaveText('You can send another in a minute');
  expect(mailsTo(riley)).toHaveLength(before + 1);

  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await rileyPage.goto(first);
  await expect(rileyPage.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();
  await acceptInvitation(rileyPage, riley);
  await expect(rileyPage).toHaveURL(new RegExp(`/projects/${project}$`));
  await other.close();
});

test('change roles and remove a person (layer1-organisations-projects-people#AC-32)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Change roles '));
  await addPerson(page, project, { email: `${uniq('riley-')}@xr.test`, name: 'Riley Chen', roles: ['Artist', 'Sound designer'] });
  await page.getByRole('link', { name: 'Change roles or remove Riley Chen' }).click();
  await page.getByRole('checkbox', { name: 'Sound designer', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Save roles' }).click();
  await expect(page.getByRole('status')).toHaveText("Riley Chen's roles saved: Artist.");

  await page.getByRole('link', { name: 'Change roles or remove Riley Chen' }).click();
  await page.getByRole('button', { name: 'Remove Riley Chen from the project' }).click();
  await expect(page.getByRole('heading', { name: /Remove Riley Chen/ })).toBeFocused();
  await page.getByRole('link', { name: 'Keep Riley Chen' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Riley Chen' })).toBeVisible();

  const name = await page.getByRole('heading', { level: 1 }).innerText();
  await page.getByRole('link', { name: 'Change roles or remove Riley Chen' }).click();
  await page.getByRole('button', { name: 'Remove Riley Chen from the project' }).click();
  await page.getByRole('button', { name: 'Remove Riley Chen' }).click();
  await expect(page.getByRole('status')).toHaveText(`Riley Chen removed from ${name}. Their past work stays on the project.`);
  await expect(page.getByRole('row').filter({ hasText: 'Riley Chen' })).toHaveCount(0);

  // Unticking every role asks for the same confirmation.
  await addPerson(page, project, { email: `${uniq('kim-')}@xr.test`, name: 'Kim Lee', roles: ['Artist'] });
  await page.getByRole('link', { name: 'Change roles or remove Kim Lee' }).click();
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Save roles' }).click();
  await expect(page.getByRole('heading', { name: /Remove Kim Lee/ })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Kim Lee' }).click();
  await expect(page.getByRole('status')).toHaveText(`Kim Lee removed from ${name}. Their past work stays on the project.`);
});

test('last manager and self edit (layer1-organisations-projects-people#AC-33)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Last manager '));
  await page.goto(`/projects/${project}/people`);
  await page.getByRole('link', { name: `Change roles or remove ${FIRST.jordan}` }).click();
  const before = page.getByRole('region', { name: 'Before you save' });
  await expect(before).toContainText('You will still be able to add people and change roles.');
  const message =
    'You are the only person on this project who can add people and change roles, so this role stays until you give someone else the Director or Producer role.';
  await expect(page.getByText(message).first()).toBeVisible();
  await expect(page.getByRole('button', { name: `Remove ${FIRST.jordan} from the project` })).toHaveCount(0);

  // The server refuses it too.
  const me = await sql('select id from person where email = $1', [FIRST.jordan]);
  const refused = await page.request.put(`/api/v1/projects/${project}/people/${me.rows[0].id}/roles`, {
    data: { roles: ['artist'] },
    headers: { origin: 'http://127.0.0.1:3100' },
  });
  expect(refused.status()).toBe(409);
  expect(await refused.text()).toContain(message);
  const roles = await sql('select role from project_role where project_id = $1 and person_id = $2 order by role', [project, me.rows[0].id]);
  expect(roles.rows.map((r) => r.role)).toEqual(['director', 'producer']);

  // With another manager, dropping your own management roles is allowed, and the summary says so.
  await addPerson(page, project, { email: `${uniq('pat-')}@xr.test`, name: 'Pat Producer', roles: ['Producer'] });
  await page.getByRole('link', { name: `Change roles or remove ${FIRST.jordan}` }).click();
  await page.getByRole('checkbox', { name: 'Director', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Producer', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).check();
  await expect(before).toContainText('You will no longer be able to add people and change roles. Pat Producer can.');
});

test('add a person errors (layer1-organisations-projects-people#AC-34)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Add errors '));
  await page.goto(`/projects/${project}/people/new`);
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText('Enter an email address, like name@example.com.');
  await expect(page.getByRole('checkbox', { name: 'Artist', exact: true })).toBeChecked();
  await expect(page).toHaveTitle(/^Error:/);

  await page.getByLabel('Email address').fill(`${uniq('x-')}@xr.test`);
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText('Choose at least one role.');

  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  await page.goto(`/projects/${project}/people/new`);
  await page.getByLabel('Email address').fill(riley);
  await page.getByRole('checkbox', { name: 'Artist', exact: true }).check();
  await page.getByRole('button', { name: 'Add person' }).click();
  await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
    'Riley Chen is already on this project. Use Change roles or remove for Riley Chen to change what they can do.',
  );

  // An address mail cannot reach: the person is still added.
  const bounce = `${uniq('bounce-')}@nowhere.invalid`;
  await addPerson(page, project, { email: bounce, name: 'Bo Unce', roles: ['Artist'] });
  await expect(page.getByRole('status')).toContainText('could not be sent');
  await expect(page.getByRole('row').filter({ hasText: 'Bo Unce' })).toBeVisible();
});

test('only managers can change people (layer1-organisations-projects-people#AC-36)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Managers only '));
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const rileyPage = await invitee(browser, riley);
  await rileyPage.goto(`/projects/${project}/people`);
  await expect(rileyPage.getByRole('link', { name: 'Add a person' })).toHaveCount(0);
  await expect(rileyPage.getByText(`Ask ${FIRST.jordan} to add people or change roles.`)).toBeVisible();
  const add = await rileyPage.request.post(`/api/v1/projects/${project}/people`, {
    data: { email: `${uniq('x-')}@xr.test`, roles: ['director'] },
    headers: { origin: 'http://127.0.0.1:3100' },
  });
  expect(add.status()).toBe(403);
  const page404 = await rileyPage.goto(`/projects/${project}/people/new`);
  expect(page404?.status()).toBe(404);
  await rileyPage.context().close();
});
