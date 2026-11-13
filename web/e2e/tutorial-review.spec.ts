import { expect, test, type Page } from '@playwright/test';
import { PNG } from '../test/support/documents';
import { FIRST, acceptInvitation, addPerson, signIn, startProject, uniq } from './support/world';

// Runs docs/tutorials/layer1-gates-and-queue.md (tutorial-layer1-gates-and-queue) step by step
// against the built app, so a tutorial that no longer matches the product fails. Step numbers
// below are the tutorial's.

const png = (name: string) => ({ name, mimeType: 'image/png', buffer: Buffer.from(PNG) });

async function send(page: Page, project: string, item: { title: string; stage: string; whatChanged: string; file: string; waiting?: string }) {
  await page.goto(`/projects/${project}/review`);
  await page.getByRole('link', { name: 'Send for review' }).click();
  await page.getByLabel('Title').fill(item.title);
  await page.getByLabel('Stage').selectOption({ label: item.stage });
  await page.getByLabel('What changed').fill(item.whatChanged);
  await page.getByLabel('File').setInputFiles(png(item.file));
  if (item.waiting) await page.getByLabel('Is other work waiting on this decision? (optional)').selectOption({ label: item.waiting });
  await page.getByRole('button', { name: 'Send for review' }).click();
}

test('tutorial: name approvers, send work for review and decide on it (tutorial-layer1-gates-and-queue)', async ({ page, browser }) => {
  test.setTimeout(240_000);
  const name = uniq('The Lantern Keeper ');
  const sheet = 'Lantern Keeper character sheet';
  const harbour = 'Harbour at night, lighting pass';
  const props = 'Prop list';

  // Step 1: start the project and bring in Morgan, Riley and Sam.
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, name);
  const emails = { morgan: `${uniq('morgan-')}@xr.test`, riley: `${uniq('riley-')}@xr.test`, sam: `${uniq('sam-')}@xr.test` };
  await addPerson(page, project, { email: emails.morgan, name: 'Morgan Ray', roles: ['Director'] });
  await addPerson(page, project, { email: emails.riley, name: 'Riley Chen', roles: ['Artist'] });
  await addPerson(page, project, { email: emails.sam, name: 'Sam Okafor', roles: ['Technical artist'] });
  const browse = async (address: string) => {
    const p = await (await browser.newContext({ baseURL: 'http://127.0.0.1:3100' })).newPage();
    await acceptInvitation(p, address);
    return p;
  };
  const morgan = await browse(emails.morgan);
  const riley = await browse(emails.riley);
  const sam = await browse(emails.sam);

  // Step 2: who approves what, at the start.
  await page.goto(`/projects/${project}`);
  await page.getByRole('navigation', { name: 'Project' }).getByRole('link', { name: 'Approvers' }).click();
  const areas = page.getByRole('table', { name: 'Approver and delegate for each area' });
  for (const row of ['Creative', 'Performance and behaviour', 'Builds and operations', 'Business']) {
    await expect(areas.getByRole('row', { name: new RegExp(`^${row}`) }).getByRole('cell').nth(1)).toHaveText(FIRST.jordan);
    await expect(areas.getByRole('row', { name: new RegExp(`^${row}`) }).getByRole('cell').nth(2)).toHaveText('None');
  }

  // Step 3: Morgan approves Creative, with Sam as delegate.
  await page.getByRole('link', { name: 'Change Creative' }).click();
  await page.getByLabel('Approver').selectOption({ label: 'Morgan Ray' });
  await page.getByLabel('Delegate (optional)').selectOption({ label: 'Sam Okafor' });
  await page.getByRole('button', { name: 'Save Creative' }).click();
  await expect(page.getByRole('status')).toHaveText('Creative saved: Morgan Ray approves it, with Sam Okafor as delegate. Items already waiting in Creative now wait for them.');

  // Step 4: Performance and behaviour, with a mistake first.
  await page.getByRole('link', { name: 'Change Performance and behaviour' }).click();
  await page.getByLabel('Approver').selectOption({ label: 'Morgan Ray' });
  await page.getByLabel('Delegate (optional)').selectOption({ label: 'Morgan Ray' });
  await page.getByRole('button', { name: 'Save Performance and behaviour' }).click();
  await expect(page.locator('main [role="alert"]')).toContainText('Choose someone other than the approver as delegate, or No delegate.');
  await page.getByLabel('Delegate (optional)').selectOption({ label: 'No delegate' });
  await page.getByRole('button', { name: 'Save Performance and behaviour' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Performance and behaviour saved: Morgan Ray approves it, with no delegate. Items already waiting in Performance and behaviour now wait for them.',
  );

  // Step 5: Morgan holds publishing and marketing.
  await page.getByRole('link', { name: 'Change Publishing and marketing' }).click();
  await page.getByLabel('Holder').selectOption({ label: 'Morgan Ray' });
  await page.getByRole('button', { name: 'Save publishing and marketing' }).click();
  await expect(page.getByRole('status')).toHaveText('Publishing and marketing saved: Morgan Ray holds it.');

  // Step 6: Riley sends the character sheet, with mesh and rig waiting on it.
  await riley.goto(`/projects/${project}/review/new`);
  await riley.getByLabel('Stage').selectOption({ label: 'Character design' });
  await expect(riley.locator('[aria-live="polite"]')).toHaveText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this.');
  await send(riley, project, { title: sheet, stage: 'Character design', whatChanged: 'Front and side views with the coat shortened, as asked.', file: 'keeper-sheet.png', waiting: 'Mesh and rig' });
  await expect(riley.getByRole('status')).toHaveText(`Sent for review: ${sheet}. It waits for Morgan Ray or Sam Okafor.`);

  // Step 7: and the harbour lighting.
  await send(riley, project, { title: harbour, stage: 'Environments', whatChanged: 'Lamps warmer; fog lowered so the stage edge shows.', file: 'harbour-night.png' });
  await expect(riley.getByRole('status')).toContainText(`Sent for review: ${harbour}.`);

  // Step 8: a catalogue number that looks like a tax number.
  await send(riley, project, { title: props, stage: 'Look and concept art', whatChanged: 'Catalogue number 046 454 286 added for the lantern.', file: 'props.png' });
  await expect(riley.locator('main [role="alert"]')).toContainText('046 454 286');
  await riley.getByRole('button', { name: 'It is none of these' }).click();
  await riley.getByLabel('What is it?').fill('A catalogue number');
  await riley.getByLabel('File').setInputFiles(png('props.png'));
  await riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(riley.getByRole('status')).toContainText(`Sent for review: ${props}.`);

  // Step 9: Morgan's queue.
  await morgan.goto(`/projects/${project}/review`);
  await expect(morgan.getByText('3 items waiting for your decision, 1 blocking.')).toBeVisible();
  await expect(morgan.getByRole('region').getByRole('heading', { level: 2 })).toHaveText(['Character design', 'Environments', 'Look and concept art']);
  await expect(morgan.getByRole('region', { name: 'Character design' })).toContainText('Mesh and rig waits on this decision.');

  // Step 10: Morgan hands the harbour lighting to Sam.
  await morgan.getByRole('link', { name: harbour }).click();
  await morgan.getByRole('button', { name: 'Hand to Sam Okafor' }).click();
  await expect(morgan.getByRole('status')).toHaveText(`Handed to Sam Okafor: ${harbour}. It shows in Sam's queue as handed to them. You can still decide it.`);
  await morgan.getByLabel('Handed to').selectOption({ label: 'Sam Okafor' });
  await morgan.getByRole('button', { name: 'Apply filters' }).click();
  await expect(morgan.locator('main').getByText('1 item waiting for your decision: handed to Sam Okafor.')).toBeFocused();

  // Step 11: Sam accepts it.
  await sam.goto(`/projects/${project}/review`);
  await sam.getByLabel('Handed to').selectOption({ label: 'Handed to you' });
  await sam.getByRole('button', { name: 'Apply filters' }).click();
  await sam.getByRole('link', { name: harbour }).click();
  await sam.getByLabel('Feedback for Riley Chen (needed to request a revision)').fill('Good. Keep the fog at this height.');
  await sam.getByRole('button', { name: 'Accept' }).click();
  await expect(sam.getByRole('status')).toHaveText(new RegExp(`^Accepted: ${harbour}\\. Recorded as your decision at \\d\\d:\\d\\d on \\d+ \\w+\\. Riley Chen sees it under Sent by you\\.$`));

  // Step 12: Morgan asks for a revision of the character sheet.
  await morgan.goto(`/projects/${project}/review`);
  await morgan.getByRole('link', { name: sheet }).click();
  await expect(morgan.getByText('Morgan Ray, the Creative approver, or Sam Okafor, the delegate')).toBeVisible();
  await morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(morgan.locator('main [role="alert"]')).toContainText('Write feedback for Riley Chen: say what to change.');
  await morgan.getByLabel('Feedback for Riley Chen (needed to request a revision)').fill('Warmer light in the lamp room, and keep the stairs readable from the audience side.');
  await morgan.getByRole('button', { name: 'Request revision' }).click();
  await expect(morgan.getByRole('status')).toContainText(`Revision requested: ${sheet}.`);

  // Step 13: and rejects the prop list.
  await morgan.getByRole('link', { name: props }).click();
  await morgan.getByRole('button', { name: 'Reject' }).click();
  const dialog = morgan.getByRole('dialog', { name: `Reject ${props}?` });
  await dialog.getByLabel('Feedback (optional)').fill('Use the props from the brief.');
  await dialog.getByRole('button', { name: 'Reject 1 item' }).click();
  await expect(morgan.getByRole('status')).toContainText(`Rejected: ${props}.`);
  await expect(morgan.getByText('Nothing is waiting for your decision')).toBeVisible();

  // Step 14: Riley reads the decisions, sends a revised version, then withdraws it.
  await riley.goto(`/projects/${project}/review/sent`);
  const rows = riley.getByRole('table');
  await expect(rows.getByRole('row', { name: new RegExp(harbour) })).toContainText('Accepted by Sam Okafor');
  await expect(rows.getByRole('row', { name: new RegExp(harbour) })).toContainText('Good. Keep the fog at this height.');
  await expect(rows.getByRole('row', { name: new RegExp(sheet) })).toContainText('Revision requested by Morgan Ray');
  await expect(rows.getByRole('row', { name: new RegExp(props) })).toContainText('Rejected by Morgan Ray');
  await rows.getByRole('row', { name: new RegExp(sheet) }).getByRole('link', { name: /Send a revised version/ }).click();
  await expect(riley.getByLabel('Title')).toHaveValue(sheet);
  await riley.getByLabel('What changed').fill('Lamp room warmer; stairs lit from the audience side.');
  await riley.getByLabel('File').setInputFiles(png('keeper-sheet-2.png'));
  await riley.getByRole('button', { name: 'Send for review' }).click();
  await expect(riley.getByRole('status')).toContainText(`Sent for review: ${sheet}.`);
  await riley.getByRole('button', { name: `Withdraw ${sheet}` }).click();
  await expect(riley.getByRole('status')).toHaveText(`Withdrawn: ${sheet}. It has left the queue of Morgan Ray and Sam Okafor. To send it again, use Send it again.`);

  // Step 15: several at once.
  await send(riley, project, { title: 'Bell sounds, take 1', stage: 'Sound and music', whatChanged: 'First take.', file: 'bells-1.png' });
  await expect(riley.getByRole('status')).toContainText('Sent for review: Bell sounds, take 1.');
  await send(riley, project, { title: 'Bell sounds, take 2', stage: 'Sound and music', whatChanged: 'Second take.', file: 'bells-2.png' });
  await expect(riley.getByRole('status')).toContainText('Sent for review: Bell sounds, take 2.');
  await morgan.goto(`/projects/${project}/review`);
  await morgan.getByRole('button', { name: 'Accept all 2 in Sound and music' }).click();
  await morgan.getByRole('dialog').getByRole('button', { name: 'Accept 2 items' }).click();
  await expect(morgan.getByRole('status')).toHaveText('Accepted 2 items in Sound and music.');

  // Step 16: everything waiting, and a protected approval.
  await send(riley, project, { title: 'Licence for the harbour recordings', stage: 'Contracts and licence terms', whatChanged: 'The recordist’s licence, signed.', file: 'licence.png' });
  await expect(riley.getByRole('status')).toContainText(`It waits for ${FIRST.jordan}.`);
  await page.goto(`/projects/${project}/review/waiting`);
  await expect(page.getByRole('table').getByRole('row', { name: /Licence for the harbour recordings/ })).toContainText('You');

  // Step 17: Sam cannot be removed while delegate for Creative.
  await page.goto(`/projects/${project}/people`);
  await page.getByRole('link', { name: 'Change roles or remove Sam Okafor' }).click();
  await page.getByRole('button', { name: 'Remove Sam Okafor from the project' }).click();
  await expect(page.getByRole('heading', { name: 'Sam Okafor cannot be removed yet' })).toBeVisible();
  await expect(page.getByText('Sam is the delegate for Creative. Give those to someone else on Approvers first, so that no item waits for a person who has left.')).toBeVisible();

  // Step 18: the activity.
  await page.goto(`/projects/${project}/activity`);
  await page.getByLabel('Area').selectOption({ label: 'Review' });
  await page.getByRole('button', { name: 'Apply filters' }).click();
  for (const what of [`Sent ${sheet} for review (Character design)`, `Handed ${harbour} to Sam Okafor`, `Accepted ${harbour}`, `Rejected ${props}`, `Withdrew ${sheet}`]) {
    await expect(page.getByRole('cell', { name: what, exact: true }).first()).toBeVisible();
  }
  await expect(page.getByText('Warmer light in the lamp room')).toHaveCount(0);
  for (const p of [morgan, riley, sam]) await p.context().close();
});
