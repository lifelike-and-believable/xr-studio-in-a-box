import { expect, test } from '@playwright/test';
import { crew, setArea } from './support/slice3';
import { addWorkFor, checkNow, decideItem, sendWork, updates } from './support/slice4';
import { addPerson, uniq } from './support/world';

// The board, adding work and its owner (layer1-versions-board-first-view#AC-5 to AC-17, AC-43).

const DATE = String.raw`\d{1,2} [A-Z][a-z]+, \d\d:\d\d`;

test('board tab sits after review (layer1-versions-board-first-view#AC-5)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await c.riley.goto(`/projects/${c.project}`);
  const tabs = c.riley.getByRole('navigation', { name: 'Project' }).getByRole('link');
  await expect(tabs).toHaveText(['Overview', 'Review', 'Board', 'Facts', 'People', 'Approvers']);
  await tabs.getByText('Board').click();
  await expect(c.riley).toHaveURL(new RegExp(`/projects/${c.project}/board$`));
  await expect(c.riley.getByRole('link', { name: 'Board' })).toHaveAttribute('aria-current', 'page');
  await c.close();
});

test('an empty board (layer1-versions-board-first-view#AC-7, AC-9)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await c.riley.goto(`/projects/${c.project}/board`);
  await expect(c.riley.getByText('Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work.')).toBeVisible();
  await expect(c.riley.getByRole('heading', { level: 2 })).toHaveText(['Creative', 'Performance and behaviour', 'Builds and operations', 'Business']);
  await expect(c.riley.getByRole('heading', { level: 3 })).toHaveCount(19);
  await expect(c.riley.getByText('No work yet.')).toHaveCount(19);
  await expect(c.riley.getByText('Builds reach these stages from the build pipeline in a later release.')).toBeVisible();
  const look = c.riley.getByRole('region', { name: 'Look and concept art' });
  await expect(look).toContainText('Decided by: Morgan Ray, the Creative approver, with Sam Okafor as delegate.');
  await expect(c.riley.getByRole('region', { name: 'Cue list' })).toContainText('Decided by: Morgan Ray, the Performance and behaviour approver.');
  await expect(c.riley.getByRole('region', { name: 'Contracts and licence terms' })).toContainText(
    'Decided by: jordan@xr.test, who holds the contracts and licence terms approval.',
  );
  await expect(c.riley.getByRole('link', { name: 'Add work' })).toHaveCount(0);
  await c.close();
});

test('the board lists every stage with its work (layer1-versions-board-first-view#AC-6, AC-7, AC-8)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const sheet = await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  const concept = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art' });
  await decideItem(c.morgan, c.project, concept.itemId, 'revise', 'Go back to the first stairs.');
  const lamp = await sendWork(c.riley, c.project, { title: 'Lamp room interior', handoff: 'environments' });
  await decideItem(c.morgan, c.project, lamp.itemId, 'accept');
  await addWorkFor(page, c.project, { title: 'Lantern Keeper mesh and rig', handoff: 'mesh-and-rig', owner: 'Sam Okafor' });

  await page.goto(`/projects/${c.project}/board`);
  await expect(page.getByText('Every stage and piece of work on this project, with its owner and its state. States change by themselves as work is sent, decided and handed on.')).toBeVisible();
  await expect(page.getByText('4 pieces of work: 1 blocked, 1 waiting for review, 1 in progress, 1 done.')).toBeVisible();

  const character = page.getByRole('region', { name: 'Character design' });
  await expect(character).toContainText('Stage: Waiting for review. 1 piece of work: 1 waiting for review.');
  const table = character.getByRole('table', { name: 'Work at Character design' });
  await expect(table.getByRole('columnheader')).toHaveText(['Work', 'Owner', 'State', 'Latest version']);
  const sheetRow = table.getByRole('row', { name: /Lantern Keeper character sheet/ });
  await expect(sheetRow.getByRole('link', { name: 'Lantern Keeper character sheet' })).toHaveAttribute('href', `/projects/${c.project}/board/${sheet.workId}`);
  await expect(sheetRow).toContainText('Riley Chen');
  await expect(sheetRow).toContainText('Waiting for review');
  await expect(sheetRow).toContainText('Waiting for Morgan Ray or Sam Okafor.');
  await expect(sheetRow).toContainText('Blocking Mesh and rig waits on this decision.');
  await expect(sheetRow).toContainText(/Version 1, sent \d{1,2} [A-Z][a-z]+/);

  const mesh = page.getByRole('region', { name: 'Mesh and rig' });
  await expect(mesh).toContainText('Stage: Blocked. 1 piece of work: 1 blocked.');
  await expect(mesh.getByRole('row', { name: /Lantern Keeper mesh and rig/ })).toContainText(
    'Waits on Lantern Keeper character sheet (Character design), which is waiting for Morgan Ray or Sam Okafor. Not sent for review yet.',
  );
  await expect(mesh.getByRole('row', { name: /Lantern Keeper mesh and rig/ })).toContainText('No versions yet');
  await expect(page.getByRole('region', { name: 'Look and concept art' }).getByRole('row', { name: /Lighthouse concept/ })).toContainText(
    new RegExp(`In progress.*Version 1: revision requested by Morgan Ray, ${DATE}\\.`),
  );
  await expect(page.getByRole('region', { name: 'Environments' }).getByRole('row', { name: /Lamp room interior/ })).toContainText(
    new RegExp(`Done.*Version 1: accepted by Morgan Ray, ${DATE}\\.`),
  );
  await c.close();
});

test('states and their detail lines (layer1-versions-board-first-view#AC-8)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const handed = await sendWork(c.riley, c.project, { title: 'Harbour at night', handoff: 'environments' });
  await c.morgan.request.post(`/api/v1/projects/${c.project}/review-items/${handed.itemId}/hand-on`);
  const withdrawn = await sendWork(c.riley, c.project, { title: 'Ferry pilot', handoff: 'character-design' });
  await c.riley.request.post(`/api/v1/projects/${c.project}/review-items/${withdrawn.itemId}/withdraw`);
  const rejected = await sendWork(c.riley, c.project, { title: 'Tide poster', handoff: 'visual-effects' });
  await decideItem(c.morgan, c.project, rejected.itemId, 'reject', 'Not for this show.');

  await page.goto(`/projects/${c.project}/board`);
  await expect(page.getByRole('row', { name: /Harbour at night/ })).toContainText('Waiting for Sam Okafor (handed on by Morgan Ray).');
  await expect(page.getByRole('row', { name: /Ferry pilot/ })).toContainText(new RegExp(`Version 1: withdrawn by Riley Chen, ${DATE}\\.`));
  await expect(page.getByRole('row', { name: /Tide poster/ })).toContainText(new RegExp(`Version 1: rejected by Morgan Ray, ${DATE}\\.`));

  // An owner who leaves the project.
  await addPerson(page, c.project, { email: `${uniq('alex-')}@xr.test`, name: 'Alex Kim', roles: ['Show operator'] });
  await addWorkFor(page, c.project, { title: 'Opening cue list', handoff: 'cue-list', owner: 'Alex Kim' });
  await page.goto(`/projects/${c.project}/people`);
  await page.getByRole('link', { name: 'Change roles or remove Alex Kim' }).click();
  await page.getByRole('button', { name: 'Remove Alex Kim from the project' }).click();
  await page.getByRole('button', { name: 'Remove Alex Kim' }).click();
  await expect(page.getByRole('status')).toContainText('Alex Kim removed');
  await page.goto(`/projects/${c.project}/board`);
  await expect(page.getByRole('row', { name: /Opening cue list/ })).toContainText('Alex Kim (no longer on the project)');
  await c.close();
});

test('blocked work only (layer1-versions-board-first-view#AC-10)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await page.goto(`/projects/${c.project}/board?show=blocked`);
  const show = page.getByRole('navigation', { name: 'Show' });
  await expect(show.getByRole('link', { name: 'Blocked work only' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('Nothing is blocked.')).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'All work' }).last()).toBeVisible();

  await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await addWorkFor(page, c.project, { title: 'Lantern Keeper mesh and rig', handoff: 'mesh-and-rig', owner: 'Sam Okafor' });
  await addWorkFor(page, c.project, { title: 'Harbour ambience', handoff: 'sound-and-music', owner: 'Riley Chen' });
  await page.goto(`/projects/${c.project}/board`);
  await expect(show.getByRole('link', { name: 'All work' })).toHaveAttribute('aria-current', 'page');
  await show.getByRole('link', { name: 'Blocked work only' }).click();
  await expect(page).toHaveURL(/\?show=blocked$/);
  await expect(page.getByText('1 piece of work is blocked.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Mesh and rig']);
  await expect(page.getByRole('row', { name: /Harbour ambience/ })).toHaveCount(0);
  await c.close();
});

test('the board changes with no reload (layer1-versions-board-first-view#AC-11)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const sheet = await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await addWorkFor(page, c.project, { title: 'Lantern Keeper mesh and rig', handoff: 'mesh-and-rig', owner: 'Sam Okafor' });
  await page.goto(`/projects/${c.project}/board?show=blocked`);
  await expect(updates(page)).toHaveText('');
  const mesh = page.getByRole('row', { name: /Lantern Keeper mesh and rig/ });
  await mesh.getByRole('link').focus();

  // A second session decides; the first page changes in place.
  await decideItem(c.morgan, c.project, sheet.itemId, 'accept');
  await checkNow(page);
  await expect(updates(page)).toHaveText(/^Updated \d\d:\d\d: Lantern Keeper mesh and rig is now In progress\.$/);
  await expect(mesh).toContainText(/Changed \d\d:\d\d/);
  await expect(mesh).toContainText('In progress');
  await expect(mesh.getByRole('link')).toBeFocused();
  await expect(page).toHaveURL(/\?show=blocked$/);

  // A failed check says so and keeps the page.
  await page.route('**/api/v1/projects/*/board*', (route) => route.abort());
  await checkNow(page);
  await expect(updates(page)).toHaveText(/^Could not check for updates at \d\d:\d\d\. Trying again in a minute\. The board may be out of date; reload the page to check now\.$/);
  await expect(mesh).toBeVisible();
  await c.close();
});

test('add work (layer1-versions-board-first-view#AC-12, AC-13, AC-41)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await page.goto(`/projects/${c.project}/board`);
  await page.getByRole('link', { name: 'Add work' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${c.project}/board/new$`));
  await expect(page.getByRole('heading', { name: 'Add work' })).toBeVisible();
  await expect(page.getByText('Put a piece of work on the board before anyone sends it, so its owner sees it under What needs you.')).toBeVisible();
  const stage = page.getByLabel('Stage');
  await expect(stage.locator('option').first()).toHaveText('Choose a stage');
  await expect(stage.locator('optgroup')).toHaveCount(3);
  const who = page.locator('main [aria-live="polite"]').first();
  await expect(who).toHaveText('');
  await stage.selectOption({ label: 'Sound and music' });
  await expect(who).toHaveText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this.');
  await expect(page.getByText('The person who makes it. They see it under What needs you.')).toBeVisible();
  const owner = page.getByLabel('Owner');
  await expect(owner.locator('option').first()).toHaveText('Choose a person');
  await expect(owner.locator('option')).toHaveText(['Choose a person', 'jordan@xr.test', 'Morgan Ray', 'Riley Chen', 'Sam Okafor']);
  const title = uniq('Harbour ambience ').replace(/\d/g, 'x');
  await page.getByLabel('Title').fill(title);
  await owner.selectOption({ label: 'Riley Chen' });
  await page.getByRole('button', { name: 'Add work' }).click();
  const notice = page.getByRole('status').filter({ hasText: 'Added' });
  await expect(notice).toHaveText(`Added ${title} to Sound and music, owned by Riley Chen. It shows under What needs you for Riley.`);
  await expect(notice).toBeFocused();
  await expect(page).toHaveURL(new RegExp(`/projects/${c.project}/board/[0-9a-f-]{36}`));
  await expect(page.getByRole('main')).toContainText(new RegExp(`Added by\\s*jordan@xr.test, ${DATE}`));
  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText(`Added work ${title} (Sound and music) for Riley Chen`)).toBeVisible();
  await c.close();
});

test('add work errors (layer1-versions-board-first-view#AC-14)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await page.goto(`/projects/${c.project}/board/new`);
  await page.getByRole('button', { name: 'Add work' }).click();
  const summary = page.locator('main [role="alert"]');
  for (const m of ['Enter a title.', 'Choose the stage this work is at.', 'Choose who owns this work.']) await expect(summary).toContainText(m);
  await expect(summary).toBeFocused();
  await page.getByLabel('Title').fill('x'.repeat(121));
  await page.getByLabel('Stage').selectOption({ label: 'Environments' });
  await page.getByRole('button', { name: 'Add work' }).click();
  await expect(summary).toContainText('Keep the title to 120 characters or fewer.');
  await expect(page.getByLabel('Stage')).toHaveValue('environments');
  // A confirmed title is logged, so the number is one slice 2's whole-database check does not look for.
  await page.getByLabel('Title').fill('Payee 555 444 333');
  await page.getByLabel('Owner').selectOption({ label: 'Riley Chen' });
  await page.getByRole('button', { name: 'Add work' }).click();
  await expect(summary).toContainText('555 444 333');
  await page.getByRole('button', { name: /^It is (not a|none of these)/ }).click();
  await page.getByLabel('What is it?').fill('A catalogue number');
  await page.getByRole('button', { name: 'Add work' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added' })).toBeVisible();
  await c.close();
});

test('change the owner and remove work (layer1-versions-board-first-view#AC-15, AC-16, AC-41)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const work = await addWorkFor(page, c.project, { title: 'Harbour children character sheet', handoff: 'character-design', owner: 'Sam Okafor' });
  await page.goto(`/projects/${c.project}/board/${work}`);
  await page.getByLabel('Owner').selectOption({ label: 'Riley Chen' });
  await page.getByRole('button', { name: 'Change owner' }).click();
  const notice = page.getByRole('status').filter({ hasText: 'now owns' });
  await expect(notice).toHaveText('Riley Chen now owns Harbour children character sheet. It shows under What needs you for Riley.');
  await expect(notice).toBeFocused();

  const remove = page.getByRole('button', { name: 'Remove Harbour children character sheet' });
  await remove.click();
  const dialog = page.getByRole('dialog', { name: 'Remove Harbour children character sheet from the board?' });
  await expect(dialog).toContainText('It has no versions, so nothing else is lost. Riley Chen no longer sees it under What needs you. The removal is recorded in Activity.');
  await expect(dialog.getByRole('button')).toHaveText(['Go back', 'Remove Harbour children character sheet']);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(remove).toBeFocused();
  await remove.click();
  await dialog.getByRole('button', { name: 'Remove Harbour children character sheet' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${c.project}/board`));
  await expect(page.getByRole('status').filter({ hasText: 'Removed' })).toHaveText('Removed Harbour children character sheet from the board.');

  const sent = await sendWork(c.riley, c.project, { title: 'Lamp room', handoff: 'environments' });
  await page.goto(`/projects/${c.project}/board/${sent.workId}`);
  await expect(page.getByRole('button', { name: 'Remove Lamp room' })).toHaveCount(0);
  const refused = await page.request.delete(`/api/v1/projects/${c.project}/work/${sent.workId}`);
  expect(refused.status()).toBe(409);
  expect(((await refused.json()) as { message: string }).message).toMatch(/^Not removed: Riley Chen sent version 1 at \d\d:\d\d\. Work with versions stays on the board\.$/);

  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText('Changed the owner of Harbour children character sheet to Riley Chen')).toBeVisible();
  await expect(page.getByText('Removed work Harbour children character sheet')).toBeVisible();
  await c.close();
});

test('only directors and producers plan work (layer1-versions-board-first-view#AC-17)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const work = await addWorkFor(page, c.project, { title: 'Bell sounds', handoff: 'sound-and-music', owner: 'Riley Chen' });
  for (const p of [c.riley, c.sam]) {
    await p.goto(`/projects/${c.project}/board`);
    await expect(p.getByRole('link', { name: 'Add work' })).toHaveCount(0);
    await p.goto(`/projects/${c.project}/board/${work}`);
    await expect(p.getByRole('button', { name: 'Change owner' })).toHaveCount(0);
    await expect(p.getByRole('button', { name: 'Remove Bell sounds' })).toHaveCount(0);
    await p.goto(`/projects/${c.project}/board/new`);
    await expect(p.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  }
  const refused = await c.riley.request.post(`/api/v1/projects/${c.project}/work`, { data: { title: 'Mine', handoff: 'environments', ownerId: 'x' } });
  expect(refused.status()).toBe(403);
  await c.morgan.goto(`/projects/${c.project}/board`);
  await expect(c.morgan.getByRole('link', { name: 'Add work' })).toBeVisible();
  await c.close();
});

test('the slice 4 API (layer1-versions-board-first-view#AC-43)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const sent = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art' });
  expect(sent.version).toBe(1);
  const next = await c.riley.request.post(`/api/v1/projects/${c.project}/review-items`, {
    data: { title: '', handoff: '', whatChanged: 'x', fileId: null, waitingOn: null, workId: sent.workId },
  });
  expect(next.status()).toBe(400);
  const boardJson = (await (await c.sam.request.get(`/api/v1/projects/${c.project}/board`)).json()) as { stamp: string; work: { id: string; state: string }[] };
  expect(boardJson.stamp).toBeTruthy();
  expect(boardJson.work).toEqual([expect.objectContaining({ id: sent.workId, state: 'waiting' })]);
  const workJson = await c.sam.request.get(`/api/v1/projects/${c.project}/work/${sent.workId}`);
  expect(workJson.ok()).toBe(true);
  const owner = await page.request.put(`/api/v1/projects/${c.project}/work/${sent.workId}/owner`, { data: { ownerId: 'nobody' } });
  expect(owner.status()).toBe(400);
  const bad = await c.riley.request.post(`/api/v1/projects/${c.project}/review-items/${sent.itemId}/feedback`, { data: { words: 1 } });
  expect(bad.status()).toBe(400);
  expect((await c.riley.request.get('/api/v1/what-needs-you')).ok()).toBe(true);
  expect((await browser.newContext({ baseURL: 'http://127.0.0.1:3100' }).then((x) => x.request.get('/api/v1/what-needs-you'))).status()).toBe(401);
  await setArea(page, c.project, 'creative', 'Morgan Ray', null);
  await c.close();
});
