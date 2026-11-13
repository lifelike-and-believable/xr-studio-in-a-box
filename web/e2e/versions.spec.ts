import { expect, test } from '@playwright/test';
import { PNG, pdfWithPages } from '../test/support/documents';
import { crew } from './support/slice3';
import { addWorkFor, decideItem, feedbackOn, sendWork } from './support/slice4';

// A piece of work's page, feedback, sending a revised version, compare and restore
// (layer1-versions-board-first-view#AC-18 to AC-31).

const DATE = String.raw`\d{1,2} [A-Z][a-z]+, \d\d:\d\d`;

test("a piece of work's page (layer1-versions-board-first-view#AC-18, AC-19, AC-20)", async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art', whatChanged: 'First pass from the brief.' });
  await decideItem(c.morgan, c.project, v1.itemId, 'accept', 'Good start. Try warmer light in the lamp room.');
  const v2 = await sendWork(c.riley, c.project, { workId: v1.workId, whatChanged: 'Warmer light in the lamp room; stairs moved to the sea side.', fileName: 'lighthouse-v2.png' });
  await feedbackOn(c.sam, c.project, v2.itemId, "The sea-side stairs will need a second rig for the keeper's climb.");
  await decideItem(c.morgan, c.project, v2.itemId, 'revise', 'The first version was clearer. Go back to version 1.');

  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}`);
  const main = c.riley.getByRole('main');
  await expect(main.getByRole('heading', { level: 2, name: 'Lighthouse concept' })).toBeVisible();
  await expect(main).toContainText('Look and concept art (Creative)');
  await expect(main).toContainText('Riley Chen (you)');
  await expect(main).toContainText(new RegExp(`In progress\\. Version 2: revision requested by Morgan Ray, ${DATE}\\.`));
  await expect(main).toContainText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate');

  const latest = c.riley.getByRole('region', { name: 'Version 2, the latest' });
  await expect(latest.getByRole('link', { name: 'Open the file' })).toBeVisible();
  await expect(latest).toContainText('Warmer light in the lamp room; stairs moved to the sea side.');
  await expect(latest).toContainText(new RegExp(`Revision requested by Morgan Ray, ${DATE}`));
  const thread = c.riley.getByRole('region', { name: 'Feedback on version 2' }).getByRole('listitem');
  await expect(thread).toHaveCount(2);
  await expect(thread.nth(0)).toContainText(new RegExp(`^Sam Okafor, ${DATE}`));
  await expect(thread.nth(1)).toContainText('Revision requested');
  await expect(thread.nth(1)).toContainText('The first version was clearer. Go back to version 1.');

  const versions = c.riley.getByRole('table', { name: 'Every version of this work, newest first' });
  await expect(versions.getByRole('columnheader')).toHaveText(['Version', 'Sent', 'What changed', 'Decision', 'Actions']);
  await expect(versions.getByRole('link', { name: 'Version 2 (latest)' })).toHaveAttribute('href', `/projects/${c.project}/review/${v2.itemId}`);
  await expect(versions.getByRole('row', { name: /Version 1/ })).toContainText(new RegExp(`Accepted by Morgan Ray, ${DATE}`));
  await c.close();
});

test('actions follow the state (layer1-versions-board-first-view#AC-21)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const work = await addWorkFor(page, c.project, { title: 'Harbour ambience', handoff: 'sound-and-music', owner: 'Riley Chen' });
  await c.riley.goto(`/projects/${c.project}/board/${work}`);
  await expect(c.riley.getByText('Make it, then send it for review. It does not move on until Morgan Ray or Sam Okafor accepts it.')).toBeVisible();
  await expect(c.riley.getByRole('link', { name: 'Send for review' })).toHaveAttribute('href', `/projects/${c.project}/review/new?work=${work}`);
  await expect(c.riley.getByText('No versions yet. The first one is made when someone sends this work for review.')).toBeVisible();
  await expect(c.riley.getByText(/Add feedback/)).toHaveCount(0);

  const v1 = await sendWork(c.riley, c.project, { workId: work });
  await c.riley.goto(`/projects/${c.project}/board/${work}`);
  await expect(c.riley.getByRole('button', { name: 'Withdraw version 1' })).toBeVisible();
  await expect(c.riley.getByRole('link', { name: 'Compare versions' })).toBeVisible();
  await expect(c.riley.getByRole('main')).toContainText('Waiting for review. Version 1 is waiting for Morgan Ray or Sam Okafor.');
  await c.sam.goto(`/projects/${c.project}/board/${work}`);
  await expect(c.sam.getByRole('button', { name: 'Withdraw version 1' })).toHaveCount(0);

  await decideItem(c.morgan, c.project, v1.itemId, 'accept');
  await sendWork(c.riley, c.project, { workId: work });
  await c.riley.goto(`/projects/${c.project}/board/${work}`);
  await expect(c.riley.getByText('Version 2 is waiting for review. To restore an earlier version, withdraw version 2 first.')).toBeVisible();
  await expect(c.riley.getByRole('button', { name: 'Restore version 1' })).toHaveCount(0);
  await c.riley.getByRole('button', { name: 'Withdraw version 2' }).click();
  await c.riley.goto(`/projects/${c.project}/board/${work}`);
  await expect(c.riley.getByRole('link', { name: 'Send a revised version' })).toBeVisible();
  await expect(c.riley.getByRole('button', { name: 'Restore version 1' })).toBeVisible();
  await c.close();
});

test('give feedback on a version (layer1-versions-board-first-view#AC-22, AC-41)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Ferry pilot character sheet', handoff: 'character-design' });
  await c.sam.goto(`/projects/${c.project}/board/${v1.workId}`);
  await expect(c.sam.getByText('Everyone on the project who uses the dashboard can read it. It cannot be edited or removed afterwards.')).toBeVisible();
  await c.sam.getByLabel('Add feedback on version 1').fill('The cap hides the face from the back rows.');
  await c.sam.getByRole('button', { name: 'Add feedback' }).click();
  const notice = c.sam.getByRole('status').filter({ hasText: 'Feedback added.' });
  await expect(notice).toBeFocused();
  await expect(c.sam.getByRole('region', { name: 'Feedback on version 1' }).getByRole('listitem')).toContainText([new RegExp(`Sam Okafor, ${DATE}.*The cap hides the face`)]);
  // Adding feedback decides nothing.
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByRole('link', { name: 'Ferry pilot character sheet' })).toBeVisible();
  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText('Added feedback on Ferry pilot character sheet, version 1')).toBeVisible();
  await expect(page.getByText('The cap hides the face')).toHaveCount(0);
  await c.close();
});

test('feedback errors (layer1-versions-board-first-view#AC-23)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Bell sounds', handoff: 'sound-and-music' });
  await c.sam.goto(`/projects/${c.project}/board/${v1.workId}`);
  await c.sam.getByRole('button', { name: 'Add feedback' }).click();
  const summary = c.sam.locator('main [role="alert"]');
  await expect(summary).toContainText('Feedback not added');
  await expect(summary).toContainText('Write your feedback before adding it.');
  await expect(summary).toBeFocused();
  await c.sam.getByLabel('Add feedback on version 1').fill('x'.repeat(2001));
  await c.sam.getByRole('button', { name: 'Add feedback' }).click();
  await expect(summary).toContainText('Keep feedback to 2,000 characters or fewer.');
  await expect(c.sam.getByLabel('Add feedback on version 1')).toHaveValue('x'.repeat(2001));
  await c.sam.getByLabel('Add feedback on version 1').fill('Pay the composer to 046 454 286.');
  await c.sam.getByRole('button', { name: 'Add feedback' }).click();
  await expect(summary).toContainText('046 454 286');
  await expect(c.sam.getByRole('button', { name: /^It is (not a|none of these)/ })).toBeVisible();
  await c.close();
});

test("a later version's review page (layer1-versions-board-first-view#AC-25)", async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Lantern Keeper character sheet', handoff: 'character-design' });
  await decideItem(c.morgan, c.project, v1.itemId, 'revise', 'Shorten the coat; it will catch on the lighthouse stairs.');
  const v2 = await sendWork(c.riley, c.project, { workId: v1.workId, whatChanged: 'Front and side views with the coat shortened, as asked.' });
  await feedbackOn(c.sam, c.project, v2.itemId, 'The shorter coat works for the rig.');
  await c.morgan.goto(`/projects/${c.project}/review/${v2.itemId}`);
  await expect(c.morgan.getByText('Version 2 of 2.')).toBeVisible();
  await expect(c.morgan.getByRole('link', { name: 'See every version and compare' })).toHaveAttribute('href', `/projects/${c.project}/board/${v1.workId}`);
  await expect(c.morgan.getByRole('main')).toContainText(new RegExp(`Revision requested by Morgan Ray, ${DATE}: "Shorten the coat; it will catch on the lighthouse stairs\\."`));
  await expect(c.morgan.getByRole('region', { name: 'Feedback on version 2' })).toContainText('The shorter coat works for the rig.');
  await c.morgan.getByLabel('Add feedback on version 2').fill('Looks right from the back rows.');
  await c.morgan.getByRole('button', { name: 'Add feedback' }).click();
  await expect(c.morgan.getByRole('status').filter({ hasText: 'Feedback added.' })).toBeVisible();
  await expect(c.morgan.getByRole('heading', { name: 'Your decision' })).toBeVisible();
  await c.morgan.goto(`/projects/${c.project}/review`);
  await expect(c.morgan.getByRole('main')).toContainText(/Lantern Keeper character sheet\s*Version 2/);
  await c.morgan.goto(`/projects/${c.project}/review/waiting`);
  await expect(c.morgan.getByRole('main')).toContainText(/Lantern Keeper character sheet\s*Version 2/);
  await c.close();
});

test('send a revised version (layer1-versions-board-first-view#AC-26, AC-27)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art', waitingOn: 'mesh-and-rig' });
  await decideItem(c.morgan, c.project, v1.itemId, 'revise', 'The stairs are hard to read.');
  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}`);
  await c.riley.getByRole('link', { name: 'Send a revised version' }).click();
  await expect(c.riley).toHaveURL(new RegExp(`/projects/${c.project}/review/new\\?work=${v1.workId}$`));
  await expect(c.riley.getByRole('heading', { name: 'Send a revised version' })).toBeVisible();
  const main = c.riley.getByRole('main');
  await expect(main).toContainText(/Work\s*Lighthouse concept/);
  await expect(main).toContainText(/Stage\s*Look and concept art \(Creative\)/);
  await expect(main).toContainText(/This will be\s*Version 2/);
  await expect(main).toContainText(/Decided by\s*Morgan Ray, the Creative approver, or Sam Okafor, the delegate/);
  await expect(main).toContainText('Morgan Ray asked, on version 1:');
  await expect(main).toContainText('The stairs are hard to read.');
  await expect(c.riley.getByLabel('Title')).toHaveCount(0);
  await expect(c.riley.getByLabel('Is other work waiting on this decision? (optional)')).toHaveValue('mesh-and-rig');
  await c.riley.getByLabel('What changed').fill('Stairs moved back.');
  await c.riley.getByLabel('File').setInputFiles({ name: 'lighthouse-v2.png', mimeType: 'image/png', buffer: Buffer.from(PNG) });
  await c.riley.getByRole('button', { name: 'Send for review' }).click();
  const notice = c.riley.getByRole('status').filter({ hasText: 'Sent for review' });
  await expect(notice).toHaveText('Sent for review: Lighthouse concept, version 2. It waits for Morgan Ray or Sam Okafor.');
  await expect(notice).toBeFocused();
  await expect(c.riley).toHaveURL(new RegExp(`/projects/${c.project}/board/${v1.workId}`));

  // Send it again in Sent by you opens the same form, on the latest version only.
  const other = await sendWork(c.riley, c.project, { title: 'Tide poster', handoff: 'visual-effects' });
  await decideItem(c.morgan, c.project, other.itemId, 'reject', 'Not for this show.');
  await c.riley.goto(`/projects/${c.project}/review/sent`);
  await expect(c.riley.getByRole('link', { name: /Send it again/ })).toHaveAttribute('href', `/projects/${c.project}/review/new?work=${other.workId}`);
  await expect(c.riley.getByRole('link', { name: /Send a revised version/ })).toHaveCount(0);
  await c.close();
});

test('compare two versions (layer1-versions-board-first-view#AC-28, AC-29)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art', whatChanged: 'First pass from the brief.' });
  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}/compare`);
  await expect(c.riley.getByRole('heading', { name: 'Compare versions of Lighthouse concept' })).toBeVisible();
  await expect(c.riley.getByText('Lighthouse concept has one version so far. You can compare versions once a second one is sent.')).toBeVisible();
  await expect(c.riley.getByRole('link', { name: 'Back to Lighthouse concept' })).toBeVisible();

  await decideItem(c.morgan, c.project, v1.itemId, 'accept', 'Good start.');
  const v2 = await sendWork(c.riley, c.project, { workId: v1.workId, whatChanged: 'Warmer light.' });
  await decideItem(c.morgan, c.project, v2.itemId, 'revise', 'Go back to version 1.');
  await sendWork(c.riley, c.project, { workId: v1.workId, whatChanged: 'Third try.' }).then((v3) =>
    c.riley.request.post(`/api/v1/projects/${c.project}/review-items/${v3.itemId}/withdraw`),
  );
  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}`);
  await c.riley.getByRole('link', { name: 'Compare versions' }).click();
  await expect(c.riley.getByRole('heading', { level: 3 })).toHaveText(['Version 2', 'Version 3']);
  await c.riley.getByLabel('Compare version').selectOption('1');
  await c.riley.getByLabel('with version').selectOption('2');
  await c.riley.getByRole('button', { name: 'Compare' }).click();
  await expect(c.riley).toHaveURL(/compare\?a=1&b=2$/);
  const first = c.riley.getByRole('region', { name: 'Version 1' });
  await expect(first.getByRole('link', { name: 'Open the file, version 1' })).toBeVisible();
  await expect(first).toContainText('First pass from the brief.');
  await expect(first).toContainText(new RegExp(`Accepted by Morgan Ray, ${DATE}`));
  await expect(first).toContainText('Good start.');
  await expect(first.getByRole('button', { name: 'Restore version 1' })).toBeVisible();
  await expect(c.riley.getByRole('region', { name: 'Version 2' })).toContainText('Go back to version 1.');

  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}/compare?a=2&b=2`);
  const error = c.riley.getByText('Choose two different versions.');
  await expect(error).toBeVisible();
  await expect(c.riley.locator(':focus')).toContainText('Choose two different versions.');
  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}/compare?a=7&b=1`);
  await expect(c.riley.getByRole('heading', { level: 3 })).toHaveText(['Version 2', 'Version 3']);

  await c.riley.setViewportSize({ width: 700, height: 900 });
  const one = await c.riley.getByRole('region', { name: 'Version 2' }).boundingBox();
  const two = await c.riley.getByRole('region', { name: 'Version 3' }).boundingBox();
  expect((one?.y ?? 0) < (two?.y ?? 0)).toBe(true);
  await c.riley.setViewportSize({ width: 1280, height: 800 });
  await c.close();
});

test('restore an earlier version (layer1-versions-board-first-view#AC-30, AC-41)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art', whatChanged: 'First pass.' });
  await decideItem(c.morgan, c.project, v1.itemId, 'accept', 'Good start.');
  const v2 = await sendWork(c.riley, c.project, { workId: v1.workId, whatChanged: 'Warmer light.' });
  await decideItem(c.morgan, c.project, v2.itemId, 'revise', 'Go back to version 1.');

  await c.riley.goto(`/projects/${c.project}/board/${v1.workId}`);
  const restore = c.riley.getByRole('button', { name: 'Restore version 1' });
  await restore.click();
  const dialog = c.riley.getByRole('dialog', { name: 'Restore version 1 of Lighthouse concept?' });
  await expect(dialog.getByRole('heading')).toBeFocused();
  await expect(dialog).toContainText(
    "Version 1's file is sent for review again as version 3, at Look and concept art. It waits for Morgan Ray or Sam Okafor. Version 2 is kept, with its feedback.",
  );
  await expect(dialog).toContainText('Morgan Ray and Sam Okafor see this. Say why you are going back.');
  await expect(dialog.getByLabel('What changed')).toHaveValue('Restored version 1.');
  await expect(dialog.getByRole('button')).toHaveText(['Go back', 'Restore version 1']);
  await dialog.getByRole('button', { name: 'Go back' }).click();
  await expect(restore).toBeFocused();
  await restore.click();
  await dialog.getByLabel('What changed').fill('Restored version 1. Morgan asked to go back.');
  await dialog.getByRole('button', { name: 'Restore version 1' }).click();
  const notice = c.riley.getByRole('status').filter({ hasText: 'Restored' });
  await expect(notice).toHaveText('Restored version 1 as version 3. It waits for Morgan Ray or Sam Okafor. Versions 1 and 2 are kept, with their feedback.');
  await expect(notice).toBeFocused();
  await expect(c.riley.getByRole('region', { name: 'Version 3, the latest' })).toContainText(/Restored from\s*Version 1/);
  const rows = c.riley.getByRole('table', { name: 'Every version of this work, newest first' }).getByRole('row');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(3)).toContainText('Accepted by Morgan Ray');
  await page.goto(`/projects/${c.project}/activity?area=review`);
  await expect(page.getByText('Restored Lighthouse concept version 1 as version 3')).toBeVisible();
  await c.close();
});

test('restore conflicts and identifier checks (layer1-versions-board-first-view#AC-31)', async ({ page, browser }) => {
  const c = await crew(page, browser);
  const v1 = await sendWork(c.riley, c.project, { title: 'Sail plan', handoff: 'environments' });
  await decideItem(c.morgan, c.project, v1.itemId, 'revise', 'More wind.');
  const v2 = await sendWork(c.riley, c.project, { workId: v1.workId });
  await c.riley.request.post(`/api/v1/projects/${c.project}/review-items/${v2.itemId}/withdraw`);
  await c.sam.goto(`/projects/${c.project}/board/${v1.workId}`);
  await c.sam.getByRole('button', { name: 'Restore version 1' }).click();
  // Riley sends version 3 while Sam's confirmation is open.
  await sendWork(c.riley, c.project, { workId: v1.workId });
  await c.sam.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(c.sam.getByRole('main')).toContainText(
    /Not restored: Riley Chen sent version 3 at \d\d:\d\d, and it is waiting for review\. Withdraw it first to restore an earlier version\./,
  );

  // A PDF that matches a format added since it was sent is held, not sent.
  // Jordan's organisation keeps its formats between runs, so this run's format has a literal prefix
  // of its own (letters other than A are literal in a pattern), and seven digits no starter matches.
  // The number starts the text: spaces are dropped when matching, and a letter before the prefix
  // would run into it.
  const prefix = Array.from({ length: 4 }, () => 'BCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)]).join('');
  const pdf = Buffer.from(pdfWithPages([`${prefix}-4567890 is the prop number.`]));
  const up = (await (
    await c.riley.request.post(`/api/v1/projects/${c.project}/uploads`, {
      data: { requestId: crypto.randomUUID(), title: 'props.pdf', fileName: 'props.pdf', mediaType: 'application/pdf', size: pdf.length, purpose: 'review' },
    })
  ).json()) as { uploadId: string; uploadUrl: string };
  await c.riley.request.put(up.uploadUrl, { data: pdf, headers: { 'content-type': 'application/pdf' } });
  const file = (await (await c.riley.request.post(`/api/v1/projects/${c.project}/uploads/${up.uploadId}/register`)).json()) as { fileId: string };
  const sent = (await (
    await c.riley.request.post(`/api/v1/projects/${c.project}/review-items`, {
      data: { title: 'Prop list', handoff: 'environments', whatChanged: 'List.', fileId: file.fileId, waitingOn: null },
    })
  ).json()) as { itemId: string; workId: string };
  await decideItem(c.morgan, c.project, sent.itemId, 'revise', 'Shorter.');
  const later = await sendWork(c.riley, c.project, { workId: sent.workId });
  await c.riley.request.post(`/api/v1/projects/${c.project}/review-items/${later.itemId}/withdraw`);
  const org = (await (await page.request.get(`/api/v1/projects/${c.project}`)).json()) as { organisationId: string };
  const added = await page.request.post(`/api/v1/organisations/${org.organisationId}/identifier-formats`, {
    data: { name: `Prop number ${prefix}`, pattern: `${prefix}-#######` },
  });
  expect(added.ok(), await added.text()).toBe(true);
  await c.riley.goto(`/projects/${c.project}/board/${sent.workId}`);
  await c.riley.getByRole('button', { name: 'Restore version 1' }).click();
  const dialog = c.riley.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Restore version 1' }).click();
  await expect(dialog).toContainText('props.pdf is held, not sent: its text looks like it has a');
  await dialog.getByRole('button', { name: /^It is not a .*, add props\.pdf$/ }).click();
  await dialog.getByLabel('What is it?').fill('A prop number');
  await dialog.getByRole('button', { name: 'Restore version 1' }).click();
  await expect(c.riley.getByRole('status').filter({ hasText: 'Restored' })).toContainText('Restored version 1 as version 3.');
  await c.close();
});
