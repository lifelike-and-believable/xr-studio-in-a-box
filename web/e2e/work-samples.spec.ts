import { expect, test } from '@playwright/test';
import { PNG, docxWith, pdfWithPages } from '../test/support/documents';
import { errorSummary, team } from './support/slice2';
import { FIRST, createOrganisation, signIn, startProject, uniq } from './support/world';

// Work samples (docs-project-facts#add-and-remove-work-samples, docs-identifier-filter#a-document-that-is-held).

const png = (name: string) => ({ name, mimeType: 'image/png', buffer: Buffer.from(PNG) });
const pdf = (name: string, pages: string[]) => ({ name, mimeType: 'application/pdf', buffer: Buffer.from(pdfWithPages(pages)) });

async function addSample(page: import('@playwright/test').Page, title: string, file: { name: string; mimeType: string; buffer: Buffer }) {
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('File').setInputFiles(file);
  await page.getByRole('button', { name: 'Add work sample' }).click();
}

test('work samples page and who may open it (layer1-facts-identifiers-activity#AC-9)', async ({ page, browser }) => {
  const t = await team(page, browser);
  await page.goto(`/projects/${t.project}/facts`);
  await page.getByRole('link', { name: 'Add work samples' }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${t.project}/facts/work-samples$`));
  await expect(page.getByRole('heading', { name: 'Work samples' })).toBeVisible();
  await expect(page.getByRole('link', { name: `${t.orgName}'s facts` })).toHaveAttribute('href', `/organisations/${t.org}`);
  await expect(page.getByRole('heading', { name: 'Add a work sample' })).toBeVisible();
  await addSample(page, 'Lantern test', png('lantern.png'));
  const table = page.getByRole('table', { name: `Work samples for ${t.projectName}` });
  await expect(table.getByRole('row').filter({ hasText: 'Lantern test' })).toContainText('lantern.png');
  await expect(table.getByRole('row').filter({ hasText: 'Lantern test' }).getByRole('button', { name: 'Remove Lantern test' })).toBeVisible();

  await t.riley.goto(`/projects/${t.project}/facts`);
  await expect(t.riley.locator('.fact').filter({ has: t.riley.getByRole('heading', { name: 'Work samples' }) })).toContainText('Lantern test');
  await t.riley.goto(`/projects/${t.project}/facts/work-samples`);
  await expect(t.riley.getByRole('heading', { name: 'This page is not available' })).toBeVisible();
  await t.close();
});

test('add a work sample with progress (layer1-facts-identifiers-activity#AC-10)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Upload '));
  await page.goto(`/projects/${project}/facts/work-samples`);
  await expect(page.getByLabel('File')).toHaveAccessibleDescription(
    'Video, images, audio, a PDF or a Word document (.docx), up to 2 GB. Text in PDFs and Word documents is checked for bank details and tax numbers; scanned PDFs, video, images and audio are not checked.',
  );
  // Hold the bytes back for a moment so the upload state can be seen.
  let release: () => void = () => undefined;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route('**/api/v1/storage/**', async (route) => {
    await held;
    await route.continue();
  });
  await addSample(page, 'Rehearsal photo', png('rehearsal.png'));
  await expect(page.getByRole('button', { name: 'Uploading' })).toBeDisabled();
  await expect(page.locator('progress')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop uploading' })).toBeVisible();
  release();
  await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'Rehearsal photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add work sample' })).toBeEnabled();
});

test('work sample errors and an interrupted upload (layer1-facts-identifiers-activity#AC-11)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Errors '));
  await page.goto(`/projects/${project}/facts/work-samples`);
  await page.getByRole('button', { name: 'Add work sample' }).click();
  await expect(errorSummary(page)).toBeFocused();
  await expect(errorSummary(page)).toContainText('Enter a title for the work sample.');
  await expect(errorSummary(page)).toContainText('Choose a file to add.');

  await addSample(page, 'Notes', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') });
  await expect(errorSummary(page)).toContainText('Choose a video, image, audio, PDF or Word file.');
  await expect(page.getByLabel('Title')).toHaveValue('Notes');

  // A file named like an image whose bytes are not one is refused when registered.
  await addSample(page, 'Fake', { name: 'fake.png', mimeType: 'image/png', buffer: Buffer.from('not really a png') });
  await expect(errorSummary(page)).toContainText('Choose a video, image, audio, PDF or Word file.');

  await page.route('**/api/v1/storage/**', (route) => route.abort('connectionreset'));
  await addSample(page, 'Lantern test', png('lantern.png'));
  await expect(errorSummary(page)).toContainText('The upload of lantern.png stopped before it finished. Choose the file again to try again.');
  await expect(page.getByLabel('Title')).toHaveValue('Lantern test');
  await expect(page.getByRole('table')).toHaveCount(0);
});

test('remove a work sample and restore it from an earlier version (layer1-facts-identifiers-activity#AC-12)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Remove '));
  await page.goto(`/projects/${project}/facts/work-samples`);
  await addSample(page, 'Lantern test', png('lantern.png'));
  await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'Lantern test' })).toBeVisible();
  await addSample(page, 'Second sample', png('second.png'));
  await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'Second sample' })).toBeVisible();

  const remove = page.getByRole('button', { name: 'Remove Lantern test' });
  await remove.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button')).toHaveText(['Keep Lantern test', 'Remove Lantern test']);
  await dialog.getByRole('button', { name: 'Keep Lantern test' }).click();
  await expect(remove).toBeFocused();
  await remove.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove Lantern test' }).click();
  await expect(page.getByRole('status')).toHaveText('Lantern test removed from the work samples. It stays in the earlier versions of Work samples.');
  await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'Lantern test' })).toHaveCount(0);

  // Version 1 had only Lantern test; restoring it brings it back and drops the later sample.
  await page.goto(`/projects/${project}/facts/work-samples/history`);
  await page.getByRole('link', { name: 'Compare with current: version 1' }).click();
  await expect(page.locator('del').filter({ hasText: 'Second sample' }).or(page.locator('ins').filter({ hasText: 'Second sample' })).first()).toBeVisible();
  await page.getByRole('button', { name: 'Restore version 1' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restore version 1' }).click();
  await expect(page.getByRole('status')).toHaveText('Work samples restored to version 1, saved as version 4. Earlier versions are kept.');
  const samples = page.locator('.fact').filter({ has: page.getByRole('heading', { name: 'Work samples' }) });
  await expect(samples).toContainText('Lantern test');
  await expect(samples).not.toContainText('Second sample');
});

test('a PDF or Word document holding an identifier is held, and can be confirmed (layer1-facts-identifiers-activity#AC-25)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Held '));
  await page.goto(`/projects/${project}/facts/work-samples`);
  await addSample(page, 'Grant letter', pdf('grant-letter.pdf', ['A letter.', 'GST 123456789 RT0001']));
  await expect(errorSummary(page)).toBeFocused();
  await expect(errorSummary(page).getByRole('heading')).toHaveText('Not added: grant-letter.pdf looks like it has a GST/HST number');
  await expect(errorSummary(page)).toContainText('Page 2 of grant-letter.pdf has text matching the format for a GST/HST number');
  await expect(errorSummary(page)).toContainText(/It is held until \d\d:\d\d on \d{1,2} [A-Z][a-z]+, then deleted/);
  await expect(page.getByRole('button', { name: 'Upload a different file' })).toBeVisible();
  await expect(page.getByLabel('Or choose a different file')).toBeVisible();
  await page.getByRole('button', { name: 'It is not a GST/HST number, add grant-letter.pdf' }).click();
  await expect(page.getByLabel('What is it?')).toBeVisible();
  await page.getByLabel('What is it?').fill('Example number in a sample letter');
  await page.getByRole('button', { name: 'Confirm and add grant-letter.pdf' }).click();
  await expect(page.getByRole('status')).toContainText('Grant letter added');
  await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'Grant letter' })).toBeVisible();

  await addSample(page, 'Plan', {
    name: 'plan.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    buffer: Buffer.from(docxWith({ body: 'Plan', header: 'Account 00123-004-1234567' })),
  });
  await expect(errorSummary(page)).toContainText('plan.docx has text matching the format for a bank account number');
});

test('held uploads are listed, deleted on time, and logged (layer1-facts-identifiers-activity#AC-26)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const project = await startProject(page, uniq('Listed '));
  await page.goto(`/projects/${project}/facts/work-samples`);
  await addSample(page, 'Scan', pdf('scan.pdf', ['SIN 046 454 286']));
  await expect(errorSummary(page)).toBeVisible();
  await page.goto(`/projects/${project}/facts/work-samples`);
  await expect(page.getByText(/^Held: scan\.pdf\. Not added: its text looks like it has a Social Insurance Number or a Business Number\. It will be deleted at \d\d:\d\d on \d{1,2} [A-Z][a-z]+ unless you confirm it is not a Social Insurance Number or a Business Number\.$/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm scan.pdf is not a Social Insurance Number or a Business Number' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete scan.pdf now' }).click();
  await expect(page.getByText(/^Held: scan\.pdf/)).toHaveCount(0);
  await page.goto(`/projects/${project}/activity`);
  await expect(page.getByRole('table')).toContainText('Deleted scan.pdf, held because its text looked like it had a Social Insurance Number or a Business Number');

  // The job route needs its secret.
  const refused = await page.request.get('/api/v1/jobs/held-uploads');
  expect(refused.status()).toBe(401);
});

test('standard work samples (layer1-facts-identifiers-activity#AC-17)', async ({ page }) => {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Samples Org ');
  const org = await createOrganisation(page, orgName);
  await page.goto(`/organisations/${org}`);
  await page.getByRole('link', { name: 'Add standard work samples' }).click();
  await expect(page).toHaveURL(new RegExp(`/organisations/${org}/work-samples$`));
  await expect(page.getByRole('heading', { name: 'Standard work samples' })).toBeVisible();
  await addSample(page, 'Company showreel', png('showreel.png'));
  await expect(page.getByRole('table', { name: `Standard work samples for ${orgName}` }).getByRole('row').filter({ hasText: 'Company showreel' })).toBeVisible();
  await page.goto(`/organisations/${org}`);
  await expect(page.getByRole('link', { name: 'Open standard work samples' })).toBeVisible();
  await page.goto(`/organisations/${org}/activity`);
  await expect(page.getByRole('table')).toContainText('Added the standard work sample "Company showreel" (version 1)');
});
