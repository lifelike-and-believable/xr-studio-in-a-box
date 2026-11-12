import { expect, test } from '@playwright/test';
import {
  FIRST,
  acceptInvitation,
  addPerson,
  forgetSends,
  linkIn,
  mailsTo,
  nextMail,
  requestLink,
  signIn,
  sql,
  startProject,
  uniq,
} from './support/world';

// Sign-in, invitations and passkeys (docs-sign-in).

test('email link sign-in is neutral and only sends to people who can sign in (layer1-organisations-projects-people#AC-1)', async ({ page }) => {
  await forgetSends(FIRST.jordan);
  const before = mailsTo(FIRST.jordan).length;
  await requestLink(page, FIRST.jordan);
  const known = await page.locator('main').innerText();
  await nextMail(FIRST.jordan, before);

  const stranger = `${uniq('stranger-')}@xr.test`;
  await requestLink(page, stranger);
  const unknown = await page.locator('main').innerText();
  expect(unknown.replace(stranger, 'X')).toBe(known.replace(FIRST.jordan, 'X'));
  // Mail is written before the response returns, so nothing more can arrive for this request.
  expect(mailsTo(stranger)).toHaveLength(0);
  const users = await sql('select count(*)::int as n from auth_user where lower(email) = lower($1)', [stranger]);
  expect(users.rows[0].n).toBe(0);
});

test('sign-in links are single use, expire after 15 minutes and are replaced by newer ones (layer1-organisations-projects-people#AC-2)', async ({ page }) => {
  await forgetSends(FIRST.morgan);
  let before = mailsTo(FIRST.morgan).length;
  await requestLink(page, FIRST.morgan);
  const first = linkIn(await nextMail(FIRST.morgan, before));
  await page.goto(first);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

  // Used once already.
  await page.context().clearCookies();
  await page.goto(first);
  await expect(page.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send another link' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Use a different email address' })).toBeVisible();

  // The stored expiry is 15 minutes, and an expired link no longer works.
  await forgetSends(FIRST.morgan);
  before = mailsTo(FIRST.morgan).length;
  await requestLink(page, FIRST.morgan);
  const second = linkIn(await nextMail(FIRST.morgan, before));
  const expiry = await sql(
    "select extract(epoch from (expires_at - created_at))::int as s from verification where value::jsonb->>'email' = $1 order by created_at desc limit 1",
    [FIRST.morgan],
  );
  expect(expiry.rows[0].s).toBe(900);
  await sql("update verification set expires_at = now() - interval '1 second' where value::jsonb->>'email' = $1", [FIRST.morgan]);
  await page.goto(second);
  await expect(page.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();

  // A newer link replaces the older one.
  await forgetSends(FIRST.morgan);
  before = mailsTo(FIRST.morgan).length;
  await requestLink(page, FIRST.morgan);
  const older = linkIn(await nextMail(FIRST.morgan, before));
  await forgetSends(FIRST.morgan);
  before = mailsTo(FIRST.morgan).length;
  await page.getByRole('button', { name: 'Send another link' }).click();
  const newer = linkIn(await nextMail(FIRST.morgan, before));
  await page.goto(older);
  await expect(page.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();

  // Send another link from the expired page goes to the same address.
  await forgetSends(FIRST.morgan);
  before = mailsTo(FIRST.morgan).length;
  await page.getByRole('button', { name: 'Send another link' }).click();
  await nextMail(FIRST.morgan, before);
  await page.goto(newer);
  await expect(page.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();
});

test('at most one sign-in email a minute per address (layer1-organisations-projects-people#AC-3)', async ({ page }) => {
  await forgetSends(FIRST.solo);
  const before = mailsTo(FIRST.solo).length;
  await requestLink(page, FIRST.solo);
  await nextMail(FIRST.solo, before);
  await page.getByRole('button', { name: 'Send another link' }).click();
  await expect(page.getByRole('status')).toHaveText('If this address can sign in, we have sent another link.');
  expect(mailsTo(FIRST.solo)).toHaveLength(before + 1);
});

test('sign-in returns to the requested page, same site only (layer1-organisations-projects-people#AC-4)', async ({ page }) => {
  await page.goto('/organisations');
  await expect(page).toHaveURL(/\/sign-in\?next=%2Forganisations/);
  await forgetSends(FIRST.jordan);
  let before = mailsTo(FIRST.jordan).length;
  await page.getByLabel('Email address').fill(FIRST.jordan);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  await page.goto(linkIn(await nextMail(FIRST.jordan, before)));
  await expect(page).toHaveURL(/\/organisations$/);

  await page.context().clearCookies();
  await page.goto('/sign-in?next=https%3A%2F%2Fevil.example%2Fsteal');
  await forgetSends(FIRST.jordan);
  before = mailsTo(FIRST.jordan).length;
  await page.getByLabel('Email address').fill(FIRST.jordan);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  await page.goto(linkIn(await nextMail(FIRST.jordan, before)));
  await expect(page).toHaveURL('http://127.0.0.1:3100/');
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
});

test('invitation links last 7 days and open the project (layer1-organisations-projects-people#AC-5)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const name = uniq('Invite ');
  const project = await startProject(page, name);
  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const expiry = await sql(
    'select extract(epoch from (i.expires_at - i.created_at))::int as s from invitation i join person p on p.id = i.person_id where lower(p.email) = lower($1)',
    [riley],
  );
  expect(expiry.rows[0].s).toBe(7 * 24 * 3600);

  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await acceptInvitation(rileyPage, riley);
  await expect(rileyPage).toHaveURL(new RegExp(`/projects/${project}$`));
  await expect(rileyPage.getByRole('heading', { level: 1, name })).toBeVisible();

  await other.clearCookies();
  await acceptInvitation(rileyPage, riley);
  await expect(rileyPage.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();

  // An unused invitation past its 7 days no longer works.
  const kim = `${uniq('kim-')}@xr.test`;
  await addPerson(page, project, { email: kim, name: 'Kim Lee', roles: ['Artist'] });
  await sql("update invitation set expires_at = now() - interval '1 second' where person_id = (select id from person where lower(email) = lower($1))", [kim]);
  await acceptInvitation(rileyPage, kim);
  await expect(rileyPage.getByRole('heading', { name: 'This sign-in link no longer works' })).toBeVisible();
  await other.close();
});

test('what each role sees the first time (layer1-organisations-projects-people#AC-6)', async ({ page, browser }) => {
  await signIn(page, FIRST.jordan);
  const name = uniq('First view ');
  const project = await startProject(page, name, { brief: 'A puppet show.' });
  await expect(page.getByRole('link', { name: 'Edit name and brief' })).toBeVisible();
  await page.getByRole('link', { name: 'People', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Add a person' })).toBeVisible();

  const riley = `${uniq('riley-')}@xr.test`;
  await addPerson(page, project, { email: riley, name: 'Riley Chen', roles: ['Artist'] });
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const rileyPage = await other.newPage();
  await acceptInvitation(rileyPage, riley);
  await expect(rileyPage.getByText('A puppet show.')).toBeVisible();
  await expect(rileyPage.getByRole('link', { name: 'Edit name and brief' })).toHaveCount(0);
  await rileyPage.getByRole('link', { name: 'People', exact: true }).click();
  await expect(rileyPage.getByText(/Ask .* to add people or change roles\./)).toBeVisible();
  await expect(rileyPage.getByRole('link', { name: 'Add a person' })).toHaveCount(0);
  await expect(rileyPage.getByRole('link', { name: /Change roles or remove/ })).toHaveCount(0);
  await other.close();
});

async function withAuthenticator(page: import('@playwright/test').Page, credentials: boolean) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: credentials,
    },
  });
  return { cdp, authenticatorId };
}

test('add and remove a passkey (layer1-organisations-projects-people#AC-7)', async ({ browser }) => {
  // Passkeys need a domain name, so this test uses localhost rather than 127.0.0.1.
  const context = await browser.newContext({ baseURL: 'http://localhost:3100' });
  const page = await context.newPage();
  await withAuthenticator(page, true);
  await signIn(page, FIRST.keys);
  await page.getByRole('button', { name: FIRST.keys }).click();
  await page.getByRole('link', { name: 'Your account' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Your account' })).toBeVisible();
  const rowsBefore = await page.getByRole('listitem').filter({ hasText: 'Made on' }).count();
  await page.getByRole('button', { name: 'Add a passkey' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Made on' })).toHaveCount(rowsBefore + 1);
  await page.getByRole('button', { name: /^Remove/ }).first().click();
  await expect(page.getByRole('status')).toHaveText('Passkey removed. You can no longer use it to sign in.');
  await expect(page.getByRole('listitem').filter({ hasText: 'Made on' })).toHaveCount(rowsBefore);
  await context.close();
});

test('sign in with a passkey (layer1-organisations-projects-people#AC-8)', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://localhost:3100' });
  const page = await context.newPage();
  await withAuthenticator(page, true);
  await signIn(page, FIRST.keys);
  await page.goto('/account');
  const rowsBefore = await page.getByRole('listitem').filter({ hasText: 'Made on' }).count();
  await page.getByRole('button', { name: 'Add a passkey' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Made on' })).toHaveCount(rowsBefore + 1);
  await context.clearCookies();

  await page.goto('/sign-in?next=%2Forganisations');
  await expect(page.getByLabel('Email address')).toHaveAttribute('autocomplete', 'username webauthn');
  await page.getByRole('button', { name: 'Sign in with a passkey' }).click();
  await expect(page).toHaveURL(/\/organisations$/);
  await context.close();

  // A device with no passkey for XR Studio.
  const bare = await browser.newContext({ baseURL: 'http://localhost:3100' });
  const barePage = await bare.newPage();
  // A fresh authenticator holds no passkey; presence is simulated so the browser answers at once.
  await withAuthenticator(barePage, true);
  await barePage.goto('/sign-in');
  await barePage.getByRole('button', { name: 'Sign in with a passkey' }).click();
  await expect(barePage.getByText('That passkey did not work.')).toBeVisible({ timeout: 15_000 });
  await expect(barePage.getByRole('button', { name: 'Try the passkey again' })).toBeVisible();
  await expect(barePage.getByLabel('Email address')).toBeVisible();
  await bare.close();
});

test('sign out (layer1-organisations-projects-people#AC-9)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  await page.getByRole('button', { name: FIRST.jordan }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'You are signed out' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in again' })).toBeVisible();
  await page.goto('/');
  await expect(page).toHaveURL(/\/sign-in/);
});

test('sign-in email errors (layer1-organisations-projects-people#AC-10)', async ({ page }) => {
  for (const value of ['', 'not-an-address']) {
    await page.goto('/sign-in');
    await page.getByLabel('Email address').fill(value);
    await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
    const summary = page.getByRole('alert', { name: 'There is a problem' });
    await expect(summary).toContainText('Enter an email address, like name@example.com.');
    await expect(summary).toBeFocused();
    await expect(summary.getByRole('link')).toHaveAttribute('href', '#email');
    await expect(page).toHaveTitle(/^Error:/);
    const field = page.getByLabel('Email address');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    const describedBy = (await field.getAttribute('aria-describedby')) ?? '';
    await expect(page.locator(`[id="${describedBy.split(' ').find((id) => id.endsWith('error'))}"]`)).toHaveText(
      /Enter an email address, like name@example.com./,
    );
  }
});

test('first addresses can sign in and nobody else can sign up (layer1-organisations-projects-people#AC-11)', async ({ page, request }) => {
  await signIn(page, FIRST.empty);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  const people = await sql('select count(*)::int as n from person where lower(email) = lower($1)', [FIRST.empty]);
  expect(people.rows[0].n).toBe(1);

  // Calling the auth library's own endpoint directly does not reach an outsider either.
  const outsider = `${uniq('outsider-')}@xr.test`;
  await request.post('/api/auth/sign-in/magic-link', {
    data: { email: outsider },
    headers: { origin: 'http://127.0.0.1:3100' },
  });
  expect(mailsTo(outsider)).toHaveLength(0);
  const users = await sql('select count(*)::int as n from auth_user where lower(email) = lower($1)', [outsider]);
  expect(users.rows[0].n).toBe(0);
});
