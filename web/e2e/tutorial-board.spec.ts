import { expect, test, type Page } from '@playwright/test';
import { PNG } from '../test/support/documents';
import { FIRST, acceptInvitation, addPerson, signIn, startProject, uniq } from './support/world';

// Runs docs/tutorials/layer1-versions-board-first-view.md (tutorial-layer1-versions-board-first-view)
// step by step against the built app, so a tutorial that no longer matches the product fails. Step
// numbers below are the tutorial's.

const png = (name: string) => ({ name, mimeType: 'image/png', buffer: Buffer.from(PNG) });
const sheet = 'Lantern Keeper character sheet';
const rig = 'Lantern Keeper mesh and rig';

async function addWork(page: Page, project: string, title: string, stage: string, owner: string) {
  await page.goto(`/projects/${project}/board`);
  await page.getByRole('link', { name: 'Add work' }).click();
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Stage').selectOption({ label: stage });
  await page.getByLabel('Owner').selectOption({ label: owner });
  await page.getByRole('button', { name: 'Add work' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added' })).toBeVisible();
}

const checkNow = (page: Page) => page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));

test('tutorial: put work on the board, give feedback on versions, and see what needs you (tutorial-layer1-versions-board-first-view)', async ({ page, browser }) => {
  test.setTimeout(240_000);
  const name = uniq('The Lantern Keeper ');

  // Step 1: start the project, bring in Morgan, Riley and Sam, and name the Creative approver.
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, name);
  const emails = { morgan: `${uniq('morgan-')}@xr.test`, riley: `${uniq('riley-')}@xr.test`, sam: `${uniq('sam-')}@xr.test`, drew: `${uniq('drew-')}@xr.test` };
  await addPerson(page, project, { email: emails.morgan, name: 'Morgan Ray', roles: ['Director'] });
  await addPerson(page, project, { email: emails.riley, name: 'Riley Chen', roles: ['Artist'] });
  await addPerson(page, project, { email: emails.sam, name: 'Sam Okafor', roles: ['Technical artist'] });
  const browse = async (address: string) => {
    const p = await (await browser.newContext({ baseURL: 'http://127.0.0.1:3100' })).newPage();
    await acceptInvitation(p, address);
    await expect(p).toHaveURL(/\/what-needs-you$/);
    return p;
  };
  const morgan = await browse(emails.morgan);
  const riley = await browse(emails.riley);
  const sam = await browse(emails.sam);
  await page.goto(`/projects/${project}/approvers/creative`);
  await page.getByLabel('Approver').selectOption({ label: 'Morgan Ray' });
  await page.getByLabel('Delegate (optional)').selectOption({ label: 'Sam Okafor' });
  await page.getByRole('button', { name: 'Save Creative' }).click();
  await expect(page.getByRole('status')).toContainText('Creative saved');

  // Step 2: the empty board.
  await page.goto(`/projects/${project}`);
  await page.getByRole('navigation', { name: 'Project' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByText('Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Look and concept art' })).toContainText('Decided by: Morgan Ray, the Creative approver, with Sam Okafor as delegate. No work yet.');

  // Step 3: Drew's first task.
  await addPerson(page, project, { email: emails.drew, name: 'Drew Patel', roles: ['Sound designer'] });
  await page.goto(`/projects/${project}/board`);
  await page.getByRole('link', { name: 'Add work' }).click();
  await page.getByLabel('Title').fill('Harbour ambience');
  await page.getByLabel('Stage').selectOption({ label: 'Sound and music' });
  await expect(page.getByText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this.')).toBeVisible();
  await page.getByLabel('Owner').selectOption({ label: 'Drew Patel (invited, not signed in yet)' });
  await page.getByRole('button', { name: 'Add work' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added' })).toHaveText('Added Harbour ambience to Sound and music, owned by Drew Patel. It shows under What needs you for Drew.');

  // Step 4: Drew finds the first task.
  const drew = await browse(emails.drew);
  await expect(drew.getByText('1 thing needs you: 1 assigned to you.')).toBeVisible();
  const assigned = drew.getByRole('region', { name: `Sound and music, ${name}` });
  await expect(assigned.getByRole('heading', { level: 4, name: 'Harbour ambience' })).toBeVisible();
  await expect(assigned).toContainText('Next step: Make it, then send it for review from its page. Morgan Ray or Sam Okafor decides it at Sound and music.');
  const panel = drew.locator('details').filter({ hasText: `How work moves on ${name}` });
  await expect(panel).toHaveAttribute('open', '');
  await expect(panel).toContainText(`You are a Sound designer on ${name}.`);
  await expect(panel).toContainText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate');
  await assigned.getByRole('link', { name: 'Harbour ambience' }).click();
  await expect(drew.getByText('Make it, then send it for review. It does not move on until Morgan Ray or Sam Okafor accepts it.')).toBeVisible();
  await expect(drew.getByRole('link', { name: 'Send for review' })).toBeVisible();

  // Step 5: Riley sends the character sheet; the rig waits on it.
  await riley.goto(`/projects/${project}/review`);
  await riley.getByRole('link', { name: 'Send for review' }).click();
  await riley.getByLabel('Title').fill(sheet);
  await riley.getByLabel('Stage').selectOption({ label: 'Character design' });
  await riley.getByLabel('What changed').fill('Front and side views, long coat.');
  await riley.getByLabel('File').setInputFiles(png('keeper-sheet-1.png'));
  await riley.getByLabel('Is other work waiting on this decision? (optional)').selectOption({ label: 'Mesh and rig' });
  await riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(riley.getByRole('status')).toContainText(`Sent for review: ${sheet}.`);

  // Step 6: the rig on the board, blocked.
  await addWork(page, project, rig, 'Mesh and rig', 'Sam Okafor');
  await page.goto(`/projects/${project}/board`);
  await expect(page.getByText('3 pieces of work: 1 blocked, 1 waiting for review, 1 in progress.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Mesh and rig' }).getByRole('row', { name: new RegExp(rig) })).toContainText(
    `Waits on ${sheet} (Character design), which is waiting for Morgan Ray or Sam Okafor. Not sent for review yet.`,
  );
  await expect(page.getByRole('region', { name: 'Character design' }).getByRole('row', { name: new RegExp(sheet) })).toContainText('Blocking Mesh and rig waits on this decision.');
  await page.getByRole('navigation', { name: 'Show' }).getByRole('link', { name: 'Blocked work only' }).click();
  await expect(page.getByText('1 piece of work is blocked.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Mesh and rig']);

  // Step 7: Sam's feedback on version 1.
  await sam.goto(`/projects/${project}/board`);
  await sam.getByRole('link', { name: sheet }).click();
  await sam.getByLabel('Add feedback on version 1').fill('The long coat will catch on the lighthouse stairs.');
  await sam.getByRole('button', { name: 'Add feedback' }).click();
  await expect(sam.getByRole('status').filter({ hasText: 'Feedback added.' })).toBeVisible();
  await expect(sam.getByRole('region', { name: 'Feedback on version 1' })).toContainText('Sam Okafor');
  await expect(sam.getByRole('main')).toContainText('Waiting for review. Version 1 is waiting for Morgan Ray or Sam Okafor.');

  // Step 8: Morgan decides from What needs you.
  await morgan.goto('/what-needs-you');
  const decide = morgan.getByRole('region', { name: `Character design, ${name}` });
  await expect(decide).toContainText('1 item, 1 blocking.');
  await expect(decide).toContainText('Blocking Mesh and rig waits on this decision.');
  await decide.getByRole('link', { name: sheet }).click();
  await expect(morgan.getByRole('region', { name: 'Feedback on version 1' })).toContainText('The long coat will catch on the lighthouse stairs.');
  await morgan.getByLabel('Feedback for Riley Chen (needed to request a revision)').fill('Shorten the coat, as Sam says.');
  await morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(morgan.getByRole('status')).toContainText(`Revision requested: ${sheet}.`);

  // Step 9: the board changes without a reload.
  await checkNow(page);
  await expect(page.locator('[data-updates]')).toHaveText(/^Updated \d\d:\d\d: Lantern Keeper mesh and rig is now In progress\.$/);
  await expect(page.getByRole('row', { name: new RegExp(rig) })).toContainText(/Changed \d\d:\d\d/);

  // Step 10: Riley sends a revised version.
  await riley.goto('/what-needs-you');
  const returned = riley.getByRole('region', { name: `Character design, ${name}` });
  await expect(returned).toContainText(/Version 1: revision requested by Morgan Ray, /);
  await expect(returned).toContainText('Morgan Ray: Shorten the coat, as Sam says.');
  await returned.getByRole('link', { name: sheet }).click();
  await riley.getByRole('link', { name: 'Send a revised version' }).click();
  await expect(riley.getByRole('main')).toContainText(/This will be\s*Version 2/);
  await expect(riley.getByRole('main')).toContainText('Morgan Ray asked, on version 1:');
  await expect(riley.getByLabel('Is other work waiting on this decision? (optional)')).toHaveValue('mesh-and-rig');
  await riley.getByLabel('What changed').fill('Coat shortened to the knee.');
  await riley.getByLabel('File').setInputFiles(png('keeper-sheet-2.png'));
  await riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(riley.getByRole('status').filter({ hasText: 'Sent for review' })).toHaveText(`Sent for review: ${sheet}, version 2. It waits for Morgan Ray or Sam Okafor.`);

  // Step 11: Morgan reviews version 2.
  await morgan.goto('/what-needs-you');
  await morgan.getByRole('region', { name: `Character design, ${name}` }).getByRole('link', { name: sheet }).click();
  await expect(morgan.getByText('Version 2 of 2.')).toBeVisible();
  await expect(morgan.getByRole('main')).toContainText('Shorten the coat, as Sam says.');
  await morgan.getByLabel('Feedback for Riley Chen (needed to request a revision)').fill('The long coat read better from the back rows. Go back to version 1.');
  await morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(morgan.getByRole('status')).toContainText(`Revision requested: ${sheet}.`);

  // Step 12: Riley compares and restores version 1.
  await riley.reload();
  await riley.getByRole('link', { name: 'Compare versions' }).click();
  await expect(riley.getByRole('region', { name: 'Version 1' })).toContainText('Front and side views, long coat.');
  await expect(riley.getByRole('region', { name: 'Version 2' })).toContainText('Go back to version 1.');
  await riley.getByRole('region', { name: 'Version 1' }).getByRole('button', { name: 'Restore version 1' }).click();
  const dialog = riley.getByRole('dialog', { name: `Restore version 1 of ${sheet}?` });
  await expect(dialog).toContainText("Version 1's file is sent for review again as version 3, at Character design. It waits for Morgan Ray or Sam Okafor. Version 2 is kept, with its feedback.");
  await expect(dialog.getByLabel('What changed')).toHaveValue('Restored version 1.');
  await dialog.getByLabel('What changed').fill('Restored version 1. Morgan asked for the long coat.');
  await dialog.getByRole('button', { name: 'Restore version 1' }).click();
  await expect(riley.getByRole('status').filter({ hasText: 'Restored' })).toHaveText(
    'Restored version 1 as version 3. It waits for Morgan Ray or Sam Okafor. Versions 1 and 2 are kept, with their feedback.',
  );
  await expect(riley.getByRole('table', { name: 'Every version of this work, newest first' }).getByRole('row')).toHaveCount(4);
  await expect(riley.getByRole('region', { name: 'Version 3, the latest' })).toContainText(/Restored from\s*Version 1/);

  // Step 13: Morgan accepts version 3; the board shows it done.
  await morgan.goto('/what-needs-you');
  await morgan.getByRole('region', { name: `Character design, ${name}` }).getByRole('link', { name: sheet }).click();
  await morgan.getByRole('button', { name: 'Accept' }).click();
  await expect(morgan.getByRole('status')).toContainText(`Accepted: ${sheet}.`);
  await page.goto(`/projects/${project}/board`);
  await expect(page.getByRole('row', { name: new RegExp(sheet) })).toContainText(/Done.*Version 3: accepted by Morgan Ray, /);

  // Step 14: change an owner, then remove work added by mistake.
  await addWork(page, project, 'Harbour children character sheet', 'Character design', 'Sam Okafor');
  await page.getByLabel('Owner').selectOption({ label: 'Riley Chen' });
  await page.getByRole('button', { name: 'Change owner' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'now owns' })).toHaveText('Riley Chen now owns Harbour children character sheet. It shows under What needs you for Riley.');
  await page.getByRole('button', { name: 'Remove Harbour children character sheet' }).click();
  const remove = page.getByRole('dialog', { name: 'Remove Harbour children character sheet from the board?' });
  await expect(remove.getByRole('button')).toHaveText(['Go back', 'Remove Harbour children character sheet']);
  await remove.getByRole('button', { name: 'Remove Harbour children character sheet' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Removed' })).toHaveText('Removed Harbour children character sheet from the board.');

  // Step 15: the activity.
  await page.goto(`/projects/${project}/activity`);
  await page.getByLabel('Area').selectOption({ label: 'Review' });
  await page.getByRole('button', { name: 'Apply filters' }).click();
  for (const entry of [
    'Added work Harbour ambience (Sound and music) for Drew Patel',
    `Added feedback on ${sheet}, version 1`,
    `Restored ${sheet} version 1 as version 3`,
    'Changed the owner of Harbour children character sheet to Riley Chen',
    'Removed work Harbour children character sheet',
  ]) {
    await expect(page.getByText(entry, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('Shorten the coat')).toHaveCount(0);
  for (const p of [morgan, riley, sam, drew]) await p.context().close();
});
