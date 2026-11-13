import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import { PNG } from '../test/support/documents';
import { apiSend, crew } from './support/slice3';
import { sql, uniq } from './support/world';

// Sending for review, the queue and decisions (layer1-gates-and-queue#AC-13 to AC-39).

async function fillSend(page: Page, item: { title: string; stage: string; whatChanged?: string; waiting?: string; file?: { name: string; mimeType: string; buffer: Buffer } }) {
  await page.getByLabel('Title').fill(item.title);
  await page.getByLabel('Stage').selectOption({ label: item.stage });
  await page.getByLabel('What changed').fill(item.whatChanged ?? 'Front and side views with the coat shortened, as asked.');
  await page.getByLabel('File').setInputFiles(item.file ?? { name: 'keeper-sheet.png', mimeType: 'image/png', buffer: Buffer.from(PNG) });
  if (item.waiting) await page.getByLabel('Is other work waiting on this decision? (optional)').selectOption({ label: item.waiting });
}

test('send for review form (layer1-gates-and-queue#AC-13, AC-14)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await c.riley.goto(`/projects/${c.project}/review`);
  await expect(c.riley.getByRole('link', { name: 'Sent by you' })).toBeVisible();
  await expect(c.riley.getByRole('link', { name: 'Everything waiting' })).toBeVisible();
  await c.riley.getByRole('link', { name: 'Send for review' }).click();
  await expect(c.riley.getByRole('heading', { name: 'Send for review' })).toBeVisible();
  const stage = c.riley.getByLabel('Stage');
  // Builds and operations has no stage sent by hand, so it has no group.
  await expect(stage.locator('optgroup')).toHaveCount(3);
  await expect(stage.locator('option').first()).toHaveText('Choose a stage');
  await expect(stage.locator('option', { hasText: 'Build for a public show' })).toHaveCount(0);
  const waiting = c.riley.getByLabel('Is other work waiting on this decision? (optional)');
  await expect(waiting.locator('option').first()).toHaveText('Nothing is waiting');
  await expect(waiting.locator('option', { hasText: 'Build for a public show' })).toHaveCount(1);
  const who = c.riley.locator('[aria-live="polite"]');
  await expect(who).toHaveText('');
  await stage.selectOption({ label: 'Character design' });
  await expect(who).toHaveText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this.');
  await stage.selectOption({ label: 'Cue list' });
  await expect(who).toHaveText('Morgan Ray, the Performance and behaviour approver, decides this.');
  await stage.selectOption({ label: 'Contracts and licence terms' });
  await expect(who).toHaveText('jordan@xr.test, who holds the contracts and licence terms approval, decides this.');
  await c.close();
});

test('send work for review (layer1-gates-and-queue#AC-15, AC-17, AC-37)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Lantern Keeper character sheet ');
  await c.riley.goto(`/projects/${c.project}/review/new`);
  await fillSend(c.riley, { title, stage: 'Character design', waiting: 'Mesh and rig' });
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  const notice = c.riley.getByRole('status');
  await expect(notice).toHaveText(`Sent for review: ${title}. It waits for Morgan Ray or Sam Okafor.`);
  await expect(notice).toBeFocused();
  await expect(c.riley).toHaveURL(new RegExp(`/projects/${c.project}/review/sent`));
  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText(`Sent ${title} for review (Character design)`)).toBeVisible();
  await expect(page.getByText('coat shortened')).toHaveCount(0);
  await c.close();
});

test('send for review errors (layer1-gates-and-queue#AC-16, AC-17)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await c.riley.goto(`/projects/${c.project}/review/new`);
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  const summary = c.riley.locator('main [role="alert"]');
  for (const m of ['Enter a title.', 'Choose the stage this work is at.', 'Say what changed.', 'Choose a file to send.']) await expect(summary).toContainText(m);
  await expect(summary).toBeFocused();
  await expect(c.riley).toHaveTitle(/^Error: Not sent/);
  await c.riley.getByLabel('Title').fill('x'.repeat(121));
  await c.riley.getByLabel('File').setInputFiles({ name: 'notes.zip', mimeType: 'application/zip', buffer: Buffer.from('PK') });
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(summary).toContainText('Keep the title to 120 characters or fewer.');
  await expect(summary).toContainText('Choose a video, image, audio, PDF, Word or 3D model file.');
  await expect(c.riley.getByLabel('Title')).toHaveValue('x'.repeat(121));
  await c.close();
});

test('identifiers in review text and files (layer1-gates-and-queue#AC-18)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Prop list ');
  await c.riley.goto(`/projects/${c.project}/review/new`);
  await fillSend(c.riley, { title, stage: 'Look and concept art', whatChanged: 'Catalogue number 046 454 286 added.' });
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(c.riley.locator('main [role="alert"]')).toContainText('046 454 286');
  await c.riley.getByRole('button', { name: 'It is none of these' }).click();
  await c.riley.getByLabel('What is it?').fill('A catalogue number');
  await c.riley.getByLabel('File').setInputFiles({ name: 'keeper-sheet.png', mimeType: 'image/png', buffer: Buffer.from(PNG) });
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(c.riley.getByRole('status')).toContainText(`Sent for review: ${title}.`);
  await c.close();
});

test('the queue shows only what you can decide (layer1-gates-and-queue#AC-20, AC-21, AC-22, AC-24)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const sheet = uniq('Sheet ');
  const pilot = uniq('Pilot ');
  const harbour = uniq('Harbour ');
  const licence = uniq('Licence ');
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByText('Nothing is waiting for your decision')).toBeVisible();
  await apiSend(c.riley, c.project, { title: harbour, handoff: 'environments' });
  await apiSend(c.riley, c.project, { title: sheet, handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await apiSend(c.riley, c.project, { title: pilot, handoff: 'character-design' });
  const licenceId = await apiSend(c.riley, c.project, { title: licence, handoff: 'contracts-and-licence-terms' });
  await sql('insert into review_recommendation (id, item_id, result, reason, at) select $1, id, $2, $3, now() from review_item where title = $4', [
    randomUUID(),
    'accept',
    'The proportions match the accepted concept art.',
    sheet,
  ]);
  await c.morgan.reload();
  await expect(c.morgan.getByText('3 items waiting for your decision, 1 blocking.')).toBeVisible();
  const groups = c.morgan.getByRole('region');
  await expect(groups.getByRole('heading', { level: 2 })).toHaveText(['Character design', 'Environments']);
  await expect(c.morgan.getByText('Creative. 2 items, 1 blocking.')).toBeVisible();
  const first = c.morgan.getByRole('region', { name: 'Character design' }).getByRole('listitem').first();
  await expect(first.getByRole('link', { name: sheet })).toBeVisible();
  await expect(first).toContainText('Character design (Creative)');
  await expect(first).toContainText('Riley Chen,');
  await expect(first).toContainText('Mesh and rig waits on this decision.');
  await expect(first).toContainText('AI recommendation, not a decision');
  await expect(first.getByRole('img', { name: /Preview of sheet\.png/ })).toBeVisible();
  await expect(c.morgan.getByRole('link', { name: licence })).toHaveCount(0);
  await page.goto(`/projects/${c.project}/review`);
  await expect(page.getByRole('link', { name: licence })).toBeVisible();
  await c.riley.goto(`/projects/${c.project}/review`);
  await expect(c.riley.getByText('You do not approve any area on this project, so nothing waits for your decision here.')).toBeVisible();
  await expect(c.riley.locator('main p').getByRole('link', { name: 'Approvers' })).toBeVisible();
  expect(licenceId).toBeTruthy();
  await c.close();
});

test('filter the queue (layer1-gates-and-queue#AC-23)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const handed = uniq('Handed ');
  const id = await apiSend(c.riley, c.project, { title: handed, handoff: 'environments' });
  await apiSend(c.riley, c.project, { title: uniq('Cues '), handoff: 'cue-list' });
  await c.morgan.request.post(`/api/v1/projects/${c.project}/review-items/${id}/hand-on`);
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByLabel('Area').locator('option')).toHaveText(['All areas', 'Creative', 'Performance and behaviour']);
  await expect(c.morgan.getByLabel('Handed to').locator('option')).toHaveText(['Anyone', 'Not handed on', 'Sam Okafor']);
  await c.morgan.getByLabel('Handed to').selectOption({ label: 'Sam Okafor' });
  await c.morgan.getByRole('button', { name: 'Apply filters' }).click();
  const line = c.morgan.locator('main').getByText('1 item waiting for your decision: handed to Sam Okafor.');
  await expect(line).toBeFocused();
  await expect(c.morgan).toHaveTitle(/^1 item waiting for your decision: handed to Sam Okafor\./);
  await c.sam.goto(`/projects/${c.project}/review`);
  await c.sam.getByLabel('Handed to').selectOption({ label: 'Handed to you' });
  await c.sam.getByRole('button', { name: 'Apply filters' }).click();
  await expect(c.sam.getByRole('link', { name: handed })).toBeVisible();
  await c.morgan.getByRole('link', { name: 'Clear filters' }).click();
  await expect(c.morgan.getByText(/^2 items waiting for your decision/)).toBeVisible();
  await c.close();
});

test("an item's page (layer1-gates-and-queue#AC-25)", async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Item ');
  const id = await apiSend(c.riley, c.project, { title, handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await c.morgan.goto(`/projects/${c.project}/review/${id}`);
  await expect(c.morgan.getByRole('heading', { name: title })).toBeVisible();
  await expect(c.morgan.getByRole('link', { name: 'Open the file' })).toBeVisible();
  await expect(c.morgan.getByText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate')).toBeVisible();
  await expect(c.morgan.getByRole('heading', { name: 'Your decision' })).toBeVisible();
  await c.riley.goto(`/projects/${c.project}/review/${id}`);
  await expect(c.riley.getByText('You sent this. It waits until Morgan Ray or Sam Okafor decides.')).toBeVisible();
  await expect(c.riley.getByRole('button', { name: 'Withdraw' })).toBeVisible();
  await expect(c.riley.getByRole('heading', { name: 'Your decision' })).toHaveCount(0);
  const file = await c.riley.request.get(`/api/v1/projects/${c.project}/review-items/${id}/file`);
  expect(file.status()).toBe(200);
  expect(file.headers()['content-type']).toBe('image/png');
  const licence = await apiSend(c.riley, c.project, { title: uniq('Licence '), handoff: 'contracts-and-licence-terms' });
  await page.goto(`/projects/${c.project}/review/${licence}`);
  await expect(page.getByText('jordan@xr.test, who holds the contracts and licence terms approval. Only jordan@xr.test can decide this.')).toBeVisible();
  await c.close();
});

test('decide on one item (layer1-gates-and-queue#AC-26, AC-27, AC-37)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const accepted = uniq('Accepted ');
  const revised = uniq('Revised ');
  const rejected = uniq('Rejected ');
  const a = await apiSend(c.riley, c.project, { title: accepted, handoff: 'character-design' });
  const r = await apiSend(c.riley, c.project, { title: revised, handoff: 'character-design' });
  const j = await apiSend(c.riley, c.project, { title: rejected, handoff: 'character-design' });

  await c.morgan.goto(`/projects/${c.project}/review/${a}`);
  await c.morgan.getByRole('button', { name: 'Accept' }).click();
  const notice = c.morgan.getByRole('status');
  await expect(notice).toHaveText(new RegExp(`^Accepted: ${accepted}\\. Recorded as your decision at \\d\\d:\\d\\d on \\d+ \\w+\\. Riley Chen sees it under Sent by you\\.$`));
  await expect(notice).toBeFocused();
  await expect(c.morgan.getByRole('link', { name: accepted })).toHaveCount(0);

  await c.morgan.goto(`/projects/${c.project}/review/${r}`);
  await c.morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(c.morgan.locator('main [role="alert"]')).toContainText('Write feedback for Riley Chen: say what to change.');
  await c.morgan.getByLabel('Feedback for Riley Chen (needed to request a revision)').fill('Warmer light in the lamp room.');
  await c.morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(c.morgan.getByRole('status')).toContainText(`Revision requested: ${revised}.`);

  await c.morgan.goto(`/projects/${c.project}/review/${j}`);
  await c.morgan.getByRole('button', { name: 'Reject' }).click();
  const dialog = c.morgan.getByRole('dialog', { name: `Reject ${rejected}?` });
  await expect(dialog.getByRole('heading')).toBeFocused();
  await expect(dialog.getByRole('button').first()).toHaveText('Go back');
  await c.morgan.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(c.morgan.getByRole('button', { name: 'Reject' })).toBeFocused();
  await c.morgan.getByRole('button', { name: 'Reject' }).click();
  await c.morgan.getByRole('dialog').getByRole('button', { name: 'Reject 1 item' }).click();
  await expect(c.morgan.getByRole('status')).toContainText(`Rejected: ${rejected}.`);

  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText(`Requested a revision of ${revised}`)).toBeVisible();
  await expect(page.getByText('Warmer light')).toHaveCount(0);
  await c.close();
});

test('a decision is final and recorded once (layer1-gates-and-queue#AC-28)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Twice ');
  const id = await apiSend(c.riley, c.project, { title, handoff: 'environments' });
  await c.morgan.goto(`/projects/${c.project}/review/${id}`);
  await c.sam.goto(`/projects/${c.project}/review/${id}`);
  await c.sam.getByRole('button', { name: 'Accept' }).click();
  await expect(c.sam.getByRole('status')).toBeVisible();
  await c.morgan.getByRole('button', { name: 'Accept' }).click();
  await expect(c.morgan.locator('main [role="alert"]')).toHaveText(
    /^Your decision was not recorded: Sam Okafor accepted this item at \d\d:\d\d on \d+ \w+, while you had it open\. It has left your queue\.$/,
  );
  await expect(c.morgan.getByRole('link', { name: 'Back to Review' })).toBeVisible();
  const rows = await sql('select count(*)::int as n from review_decision where item_id = $1', [id]);
  expect(rows.rows[0].n).toBe(1);
  await c.close();
});

test('decide on several items at once (layer1-gates-and-queue#AC-29)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const one = uniq('One ');
  const two = uniq('Two ');
  const three = uniq('Three ');
  await apiSend(c.riley, c.project, { title: one, handoff: 'character-design' });
  await apiSend(c.riley, c.project, { title: two, handoff: 'character-design' });
  await apiSend(c.riley, c.project, { title: three, handoff: 'environments' });
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByRole('group', { name: 'With the items you select' })).toBeVisible();
  await c.morgan.getByRole('button', { name: 'Accept selected' }).click();
  const none = c.morgan.getByText('Select at least one item.');
  await expect(none).toBeFocused();

  await c.morgan.getByRole('checkbox', { name: `Select ${three}` }).check();
  await c.morgan.getByRole('button', { name: 'Request revision for selected' }).click();
  const dialog = c.morgan.getByRole('dialog');
  await expect(dialog).toContainText(`${three}, from Riley Chen`);
  await dialog.getByRole('button', { name: 'Request revision of 1 item' }).click();
  await expect(dialog.getByText('Write the feedback each requester will see.')).toBeVisible();
  await dialog.getByLabel('Feedback').fill('Lower the fog.');
  await dialog.getByRole('button', { name: 'Request revision of 1 item' }).click();
  await expect(c.morgan.getByRole('status')).toHaveText('Revision requested for 1 item.');

  await c.morgan.getByRole('button', { name: 'Accept all 2 in Character design' }).click();
  await expect(c.morgan.getByRole('dialog')).toContainText(`${one}, from Riley Chen`);
  await c.morgan.getByRole('dialog').getByRole('button', { name: 'Accept 2 items' }).click();
  await expect(c.morgan.getByRole('status')).toHaveText('Accepted 2 items in Character design.');
  await c.close();
});

test('hand an item to your delegate (layer1-gates-and-queue#AC-31)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Harbour ');
  const id = await apiSend(c.riley, c.project, { title, handoff: 'environments' });
  await c.sam.goto(`/projects/${c.project}/review/${id}`);
  await expect(c.sam.getByRole('button', { name: /^Hand to/ })).toHaveCount(0);
  await c.morgan.goto(`/projects/${c.project}/review/${id}`);
  await c.morgan.getByRole('button', { name: 'Hand to Sam Okafor' }).click();
  await expect(c.morgan.getByRole('status')).toHaveText(`Handed to Sam Okafor: ${title}. It shows in Sam's queue as handed to them. You can still decide it.`);
  await expect(c.morgan.getByRole('listitem').filter({ hasText: title })).toContainText('Handed to Sam Okafor');
  await c.close();
});

test('sent by you shows every status (layer1-gates-and-queue#AC-33, AC-35)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  await c.riley.goto(`/projects/${c.project}/review/sent`);
  await expect(c.riley.getByText('You have not sent anything for review on this project.')).toBeVisible();
  const waiting = uniq('Waiting ');
  const revised = uniq('Revise ');
  const accepted = uniq('Accept ');
  await apiSend(c.riley, c.project, { title: waiting, handoff: 'character-design' });
  const r = await apiSend(c.riley, c.project, { title: revised, handoff: 'look-and-concept-art', waitingOn: 'character-design' });
  const a = await apiSend(c.riley, c.project, { title: accepted, handoff: 'character-design' });
  await c.morgan.request.post(`/api/v1/projects/${c.project}/review-items/${r}/decision`, { data: { decision: 'revise', feedback: 'Warmer light in the lamp room.' } });
  await c.sam.request.post(`/api/v1/projects/${c.project}/review-items/${a}/decision`, { data: { decision: 'accept', feedback: 'Keep the glass this colour.' } });
  await c.riley.reload();
  const table = c.riley.getByRole('table');
  await expect(table.getByRole('row', { name: new RegExp(waiting) })).toContainText('Waiting for Morgan Ray or Sam Okafor (delegate)');
  await expect(table.getByRole('row', { name: new RegExp(revised) })).toContainText('Revision requested by Morgan Ray,');
  await expect(table.getByRole('row', { name: new RegExp(revised) })).toContainText('Warmer light in the lamp room.');
  await expect(table.getByRole('row', { name: new RegExp(accepted) })).toContainText('Accepted by Sam Okafor,');
  await expect(table.getByRole('row', { name: new RegExp(accepted) })).toContainText('Keep the glass this colour.');
  await table.getByRole('row', { name: new RegExp(revised) }).getByRole('link', { name: /Send a revised version/ }).click();
  await expect(c.riley.getByLabel('Title')).toHaveValue(revised);
  await expect(c.riley.getByLabel('Stage').locator('option:checked')).toHaveText('Look and concept art');
  await expect(c.riley.getByLabel('Is other work waiting on this decision? (optional)').locator('option:checked')).toHaveText('Character design');
  await c.close();
});

test('withdraw something you sent (layer1-gates-and-queue#AC-34)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const title = uniq('Withdrawn ');
  await apiSend(c.riley, c.project, { title, handoff: 'character-design' });
  await c.riley.goto(`/projects/${c.project}/review/sent`);
  await c.riley.getByRole('button', { name: `Withdraw ${title}` }).click();
  await expect(c.riley.getByRole('status')).toHaveText(`Withdrawn: ${title}. It has left the queue of Morgan Ray and Sam Okafor. To send it again, use Send it again.`);
  await expect(c.riley.getByRole('table').getByRole('row', { name: new RegExp(title) })).toContainText('Withdrawn by you,');
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByRole('link', { name: title })).toHaveCount(0);
  await c.close();
});

test('everything waiting (layer1-gates-and-queue#AC-36)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const sheet = uniq('Sheet ');
  const licence = uniq('Licence ');
  await apiSend(c.riley, c.project, { title: sheet, handoff: 'character-design', waitingOn: 'mesh-and-rig' });
  await apiSend(c.riley, c.project, { title: licence, handoff: 'contracts-and-licence-terms' });
  await page.goto(`/projects/${c.project}/review/waiting`);
  const table = page.getByRole('table');
  await expect(table.getByRole('row', { name: new RegExp(sheet) })).toContainText('Morgan Ray or Sam Okafor (delegate)');
  await expect(table.getByRole('row', { name: new RegExp(sheet) })).toContainText('Blocking');
  await expect(table.getByRole('row', { name: new RegExp(licence) })).toContainText('You');
  await c.close();
});

test('the review API (layer1-gates-and-queue#AC-19, AC-39)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const moved = await c.sam.request.post(`/api/v1/projects/${c.project}/review-items`, {
    data: { title: 'Rehearsal build 4', handoff: 'build-for-rehearsal', whatChanged: 'Fog fix.', fileId: null, waitingOn: null },
  });
  expect(moved.status()).toBe(200);
  expect(await moved.json()).toMatchObject({ movedOn: true });
  const bad = await c.riley.request.post(`/api/v1/projects/${c.project}/review-items`, { data: { title: 3 } });
  expect(bad.status()).toBe(400);
  const approvers = await c.riley.request.get(`/api/v1/projects/${c.project}/approvers`);
  expect(approvers.status()).toBe(200);
  const refused = await c.riley.request.put(`/api/v1/projects/${c.project}/approvers/creative`, { data: { approverId: randomUUID(), delegateId: null } });
  expect(refused.status()).toBe(403);
  const id = await apiSend(c.riley, c.project, { title: uniq('Api '), handoff: 'environments' });
  const queue = await c.morgan.request.get(`/api/v1/projects/${c.project}/review-items`);
  expect(((await queue.json()) as { groups: { items: { id: string }[] }[] }).groups.flatMap((g) => g.items.map((i) => i.id))).toContain(id);
  const batch = await c.morgan.request.post(`/api/v1/projects/${c.project}/review-decisions`, { data: { itemIds: [id], decision: 'accept', feedback: '' } });
  expect(batch.status()).toBe(200);
  await c.close();
});
