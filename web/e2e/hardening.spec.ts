import { expect, test } from '@playwright/test';
import { FIRST, addPerson, linkIn, mailsTo, newPage, nextMail, signIn, sql, startProject, uniq } from './support/world';

// Fixes from the slice 1 code review, checked through the app (layer1-organisations-projects-people).

test('a performer given a dashboard role is invited and can open the project (layer1-organisations-projects-people#AC-30)', async ({ page, browser }) => {
  const jordan = await newPage(browser, FIRST.jordan);
  const name = uniq('Gains ');
  const project = await startProject(jordan, name);
  const kai = `${uniq('kai-')}@xr.test`;
  await addPerson(jordan, project, { email: kai, name: 'Kai Moana', roles: ['Performer'] });
  expect(mailsTo(kai)).toHaveLength(0);

  await jordan.goto(`/projects/${project}/people`);
  await jordan.getByRole('link', { name: 'Change roles or remove Kai Moana' }).click();
  await jordan.getByRole('checkbox', { name: 'Performer', exact: true }).uncheck();
  await jordan.getByRole('checkbox', { name: 'Artist', exact: true }).check();
  await jordan.getByRole('button', { name: 'Save roles' }).click();
  await expect(jordan.getByRole('status')).toHaveText(
    `Kai Moana's roles saved: Artist. We have emailed ${kai} an invitation link that lasts 7 days.`,
  );

  const invitation = await nextMail(kai, 0);
  expect(invitation.subject).toBe(`You have been added to ${name} in XR Studio`);
  await page.goto(linkIn(invitation));
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await jordan.context().close();
});

test('the last manager is told why they stay when removal is tried (layer1-organisations-projects-people#AC-33)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Alone '));
  const me = await sql('select id from person where lower(email) = lower($1)', [FIRST.jordan]);
  await page.goto(`/projects/${project}/people/${me.rows[0].id}/remove`);
  await page.getByRole('button', { name: /^Remove / }).click();
  await expect(page.locator('main [role="alert"]')).toContainText(
    'You are the only person on this project who can add people and change roles',
  );
  await expect(page).toHaveTitle(/^Error: /);
  await expect(page.getByRole('link', { name: 'Back to People' })).toBeVisible();
});

test('the sign-in link request answers the same way and sends after answering (layer1-organisations-projects-people#AC-1)', async ({ request }) => {
  const stranger = `${uniq('nobody-')}@xr.test`;
  const known = await request.post('/api/v1/sign-in/link', { data: { email: FIRST.empty } });
  const unknown = await request.post('/api/v1/sign-in/link', { data: { email: stranger } });
  expect(known.status()).toBe(200);
  expect(unknown.status()).toBe(200);
  expect(await known.json()).toEqual(await unknown.json());
  expect(mailsTo(stranger)).toHaveLength(0);
  const bad = await request.post('/api/v1/sign-in/link', { data: { email: 'not an address' } });
  expect(bad.status()).toBe(400);
});

test('a return address that browsers rewrite off the site is refused (layer1-organisations-projects-people#AC-4)', async ({ page }) => {
  await sql('delete from email_send where lower(address) = lower($1)', [FIRST.morgan]);
  const before = mailsTo(FIRST.morgan).length;
  await page.goto(`/sign-in?next=${encodeURIComponent('/\t/evil.example')}`);
  await page.getByLabel('Email address').fill(FIRST.morgan);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  const mail = await nextMail(FIRST.morgan, before);
  await page.goto(linkIn(mail));
  await expect(page).toHaveURL(/^http:\/\/127\.0\.0\.1:3100\/$/);
});
