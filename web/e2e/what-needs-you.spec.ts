import { expect, test, type Browser, type Page } from '@playwright/test';
import { type Crew, crew } from './support/slice3';
import { addWorkFor, checkNow, decideItem, sendWork, updates } from './support/slice4';
import { FIRST, acceptInvitation, addPerson, signIn, uniq } from './support/world';

// What needs you, the first view after sign-in (layer1-versions-board-first-view#AC-32 to AC-39).

const DATE = String.raw`\d{1,2} [A-Z][a-z]+, \d\d:\d\d`;

// Drew, a sound designer new to the project, signs in by the invitation.
async function newcomer(c: Crew, browser: Browser): Promise<Page> {
  const email = `${uniq('drew-')}@xr.test`;
  await addPerson(c.jordan, c.project, { email, name: 'Drew Patel', roles: ['Sound designer'] });
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const drew = await context.newPage();
  await acceptInvitation(drew, email);
  return drew;
}

const group = (page: Page, stage: string, project: string) => page.getByRole('region', { name: `${stage}, ${project}` });

test('what needs you is the first view (layer1-versions-board-first-view#AC-32)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const drew = await newcomer(c, browser);
  await expect(drew).toHaveURL(/\/what-needs-you$/);
  await expect(drew.getByRole('heading', { level: 1, name: 'What needs you' })).toBeVisible();
  const nav = drew.getByRole('navigation', { name: 'Main' }).getByRole('link');
  await expect(nav).toHaveText(['What needs you', 'Projects', 'Organisations']);
  await expect(nav.first()).toHaveAttribute('aria-current', 'page');

  await c.riley.goto('/');
  await expect(c.riley).toHaveURL(/\/what-needs-you$/);
  await c.riley.getByRole('link', { name: 'Projects' }).click();
  await expect(c.riley).toHaveURL(/\/projects$/);
  await expect(c.riley.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await expect(c.riley.getByRole('listitem').filter({ hasText: c.projectName })).toBeVisible();
  await c.riley.getByRole('link', { name: 'XR Studio' }).click();
  await expect(c.riley).toHaveURL(/\/what-needs-you$/);

  const empty = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' }).then((x) => x.newPage());
  await signIn(empty, FIRST.empty);
  await expect(empty.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  await empty.goto('/what-needs-you');
  await expect(empty.getByRole('heading', { level: 1, name: 'You are not on any projects' })).toBeVisible();
  await expect(empty.getByRole('link', { name: 'Start a project' })).toBeVisible();
  await drew.context().close();
  await empty.context().close();
  await c.close();
});

test('the four lists (layer1-versions-board-first-view#AC-33, AC-34, AC-36)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const drew = await newcomer(c, browser);
  await addWorkFor(page, c.project, { title: 'Harbour ambience', handoff: 'sound-and-music', owner: 'Drew Patel' });
  await drew.goto('/what-needs-you');
  await expect(drew.getByText('What is waiting for you on all your projects, grouped by gate, oldest first. It updates as work moves; there is no need to reload.')).toBeVisible();
  await expect(drew.getByText('1 thing needs you: 1 assigned to you.')).toBeVisible();
  await expect(drew.getByRole('heading', { level: 2 })).toHaveText(['Assigned to you', 'Your stages']);
  await expect(drew.getByText('Work you own that is not waiting for review: not sent yet, or withdrawn.')).toBeVisible();
  const assigned = group(drew, 'Sound and music', c.projectName);
  await expect(assigned).toContainText('1 item.');
  await expect(assigned.getByRole('heading', { level: 4, name: 'Harbour ambience' })).toBeVisible();
  await expect(assigned).toContainText(new RegExp(`Added by jordan@xr.test, ${DATE}\\. Not sent for review yet\\.`));
  await expect(assigned).toContainText('Next step: Make it, then send it for review from its page. Morgan Ray or Sam Okafor decides it at Sound and music.');
  await assigned.getByRole('link', { name: 'Harbour ambience' }).click();
  await expect(drew).toHaveURL(new RegExp(`/projects/${c.project}/board/`));
  const work = drew.url().split('/').at(-1) ?? '';

  // Drew sends it; it waits for others, then comes back.
  const v1 = await sendWork(drew, c.project, { workId: work });
  await drew.goto('/what-needs-you');
  await expect(drew.getByText('Nothing needs you right now. 1 thing you sent is waiting for others.')).toBeVisible();
  await expect(group(drew, 'Sound and music', c.projectName)).toContainText(new RegExp(`Version 1, sent ${DATE}\\.`));
  await expect(group(drew, 'Sound and music', c.projectName)).toContainText('Next step: Nothing to do. It waits for Morgan Ray or Sam Okafor.');
  await decideItem(c.morgan, c.project, v1.itemId, 'revise', 'More gulls.');
  await drew.goto('/what-needs-you');
  await expect(drew.getByText('1 thing needs you: 1 returned to you.')).toBeVisible();
  const returned = group(drew, 'Sound and music', c.projectName);
  await expect(returned).toContainText(new RegExp(`Version 1: revision requested by Morgan Ray, ${DATE}\\.`));
  await expect(returned).toContainText('Morgan Ray: More gulls.');
  await expect(returned).toContainText('Next step: Change it as the feedback asks, then select Send a revised version on its page.');

  // Morgan decides; a blocking item is marked.
  const blocking = await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await c.morgan.goto('/what-needs-you');
  const decisions = c.morgan.getByRole('region', { name: 'For your decision' });
  await expect(decisions).toContainText('Work waiting at a gate you decide. Open an item to accept it, request a revision or reject it.');
  const g = group(c.morgan, 'Character design', c.projectName);
  await expect(g).toContainText('1 item, 1 blocking.');
  await expect(g).toContainText(new RegExp(`Version 1 from Riley Chen, ${DATE}\\.`));
  await expect(g).toContainText('Blocking Mesh and rig waits on this decision.');
  await expect(g).toContainText('Next step: Decide: accept, request a revision or reject.');
  await expect(g.getByRole('link', { name: 'Lantern Keeper character sheet' })).toHaveAttribute('href', `/projects/${c.project}/review/${blocking.itemId}`);
  await expect(c.morgan.getByText(/^\d+ things? needs? you: \d+ for your decision, \d+ blocking/)).toBeVisible();
  await drew.context().close();
  await c.close();
});

test('your stages for a newcomer (layer1-versions-board-first-view#AC-37)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const drew = await newcomer(c, browser);
  await drew.goto('/what-needs-you');
  const panel = drew.locator('details').filter({ hasText: `How work moves on ${c.projectName}` });
  await expect(panel).toHaveAttribute('open', '');
  await expect(panel).toContainText(`You are a Sound designer on ${c.projectName}. A gate is the point where a named person must accept your work before it moves on. Each of your stages has one.`);
  const table = panel.getByRole('table', { name: `Your stages on ${c.projectName} and who decides each` });
  await expect(table.getByRole('columnheader')).toHaveText(['Your stage', 'Who decides it']);
  await expect(table.getByRole('row').nth(1)).toHaveText(/Sound and music\s*Morgan Ray, the Creative approver, or Sam Okafor, the delegate/);
  await expect(panel).toContainText(
    "When a piece of work is ready, open it and select Send for review. Work assigned to you is listed above, under Assigned to you. If you expected work that is not listed, ask the project's producer, jordan@xr.test.",
  );
  // Closed once the person has sent something on the project.
  await sendWork(drew, c.project, { title: 'Bell sounds', handoff: 'sound-and-music' });
  await drew.reload();
  await expect(panel).not.toHaveAttribute('open', '');
  await drew.context().close();
  await c.close();
});

test('nothing needs you (layer1-versions-board-first-view#AC-38)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const drew = await newcomer(c, browser);
  await expect(drew.getByText('Nothing needs you right now.')).toBeVisible();
  await expect(
    drew.getByText(
      `Nothing is assigned to you yet on ${c.projectName}. Ask the project's producer, jordan@xr.test, or its director, Morgan Ray, to add your first piece of work. It will appear here, under Assigned to you, without a reload.`,
    ),
  ).toBeVisible();
  const sent = await sendWork(drew, c.project, { title: 'Bell sounds', handoff: 'sound-and-music' });
  await decideItem(c.morgan, c.project, sent.itemId, 'accept');
  await drew.goto('/what-needs-you');
  await expect(drew.getByText('Nothing needs you right now.')).toBeVisible();
  await expect(drew.getByText('Nothing is waiting for your decision, nothing you sent has come back, and no work is assigned to you. This page updates by itself when that changes.')).toBeVisible();
  await expect(drew.getByText('To see where everything stands on a project, open its Board:')).toBeVisible();
  await expect(drew.getByRole('link', { name: c.projectName })).toHaveAttribute('href', `/projects/${c.project}/board`);
  await drew.context().close();
  await c.close();
});

test('what needs you changes with no reload (layer1-versions-board-first-view#AC-39)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const drew = await newcomer(c, browser);
  const sent = await sendWork(drew, c.project, { title: 'Bell sounds', handoff: 'sound-and-music' });
  await drew.goto('/what-needs-you');
  await expect(updates(drew)).toHaveText('');
  const bell = drew.getByRole('heading', { level: 4, name: 'Bell sounds' }).getByRole('link');
  await bell.focus();

  await addWorkFor(page, c.project, { title: 'Harbour ambience', handoff: 'sound-and-music', owner: 'Drew Patel' });
  await decideItem(c.morgan, c.project, sent.itemId, 'accept');
  await checkNow(drew);
  await expect(updates(drew)).toHaveText(/^Updated \d\d:\d\d: 1 new item assigned to you\. 1 item accepted\.$/);
  await expect(drew.getByRole('listitem').filter({ hasText: 'Harbour ambience' })).toContainText('New');
  await expect(drew.getByText(/^Bell sounds: accepted by Morgan Ray at \d\d:\d\d\. It no longer needs you\.$/)).toBeVisible();
  await expect(drew).toHaveURL(/\/what-needs-you$/);

  await drew.route('**/api/v1/what-needs-you*', (route) => route.abort());
  await checkNow(drew);
  await expect(updates(drew)).toHaveText(/^Could not check for updates at \d\d:\d\d\. Trying again in a minute\. This page may be out of date; reload it to check now\.$/);
  await drew.context().close();
  await c.close();
});
