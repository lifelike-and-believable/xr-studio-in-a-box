import { randomUUID } from 'node:crypto';
import { expect, type Page } from '@playwright/test';
import { PNG } from '../../test/support/documents';

// Shared steps for the slice 4 end-to-end tests (layer1-versions-board-first-view), on top of the
// slice 3 crew: Jordan (Director and Producer, owner), Morgan (Director, Creative approver), Riley
// (Artist) and Sam (Technical artist, Creative delegate).

const api = (project: string) => `/api/v1/projects/${project}`;

async function reviewFile(page: Page, project: string, fileName = 'sheet.png') {
  const asked = await page.request.post(`${api(project)}/uploads`, {
    data: { requestId: randomUUID(), title: fileName, fileName, mediaType: 'image/png', size: PNG.length, purpose: 'review' },
  });
  expect(asked.ok(), await asked.text()).toBe(true);
  const { uploadId, uploadUrl } = (await asked.json()) as { uploadId: string; uploadUrl: string };
  const put = await page.request.put(uploadUrl, { data: Buffer.from(PNG), headers: { 'content-type': 'image/png' } });
  expect(put.ok()).toBe(true);
  const registered = await page.request.post(`${api(project)}/uploads/${uploadId}/register`);
  return ((await registered.json()) as { fileId: string }).fileId;
}

export type SentVersion = { itemId: string; workId: string; version: number };

// Sends new work (with a title and stage) or the next version of a piece of work.
export async function sendWork(
  page: Page,
  project: string,
  item: { title?: string; handoff?: string; workId?: string; waitingOn?: string; whatChanged?: string; fileName?: string },
): Promise<SentVersion> {
  const fileId = await reviewFile(page, project, item.fileName);
  const sent = await page.request.post(`${api(project)}/review-items`, {
    data: {
      title: item.title ?? '',
      handoff: item.handoff ?? '',
      whatChanged: item.whatChanged ?? 'Front and side views.',
      fileId,
      waitingOn: item.waitingOn ?? null,
      workId: item.workId ?? null,
    },
  });
  expect(sent.ok(), await sent.text()).toBe(true);
  return (await sent.json()) as SentVersion;
}

export async function decideItem(page: Page, project: string, itemId: string, decision: 'accept' | 'revise' | 'reject', feedback = '') {
  const r = await page.request.post(`${api(project)}/review-items/${itemId}/decision`, { data: { decision, feedback } });
  expect(r.ok(), await r.text()).toBe(true);
}

export async function feedbackOn(page: Page, project: string, itemId: string, text: string) {
  const r = await page.request.post(`${api(project)}/review-items/${itemId}/feedback`, { data: { text } });
  expect(r.ok(), await r.text()).toBe(true);
}

export async function personId(page: Page, project: string, name: string): Promise<string> {
  const people = (await (await page.request.get(`${api(project)}/people`)).json()) as { id: string; display: string }[];
  const found = people.find((p) => p.display === name);
  if (!found) throw new Error(`no ${name} on the project`);
  return found.id;
}

export async function addWorkFor(page: Page, project: string, item: { title: string; handoff: string; owner: string }): Promise<string> {
  const r = await page.request.post(`${api(project)}/work`, {
    data: { title: item.title, handoff: item.handoff, ownerId: await personId(page, project, item.owner) },
  });
  expect(r.ok(), await r.text()).toBe(true);
  return ((await r.json()) as { workId: string }).workId;
}

// The polite region that reports updates, present and empty from page load.
export const updates = (page: Page) => page.locator('[data-updates]');

// Pages check for changes every 15 seconds, and at once when the tab becomes visible again; the
// tests use the second so that they need not wait.
export async function checkNow(page: Page) {
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
}
