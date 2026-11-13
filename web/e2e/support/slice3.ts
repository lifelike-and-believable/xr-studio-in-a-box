import { randomUUID } from 'node:crypto';
import { expect, type Browser, type Page } from '@playwright/test';
import { PNG } from '../../test/support/documents';
import { FIRST, acceptInvitation, addPerson, signIn, startProject, uniq } from './world';

// Shared set-up for the slice 3 end-to-end tests (layer1-gates-and-queue): Jordan owns the
// project (Director and Producer), Morgan is its Director, Riley an Artist and Sam a Technical
// artist. Morgan approves Creative with Sam as delegate, and Performance and behaviour.

export type Crew = {
  jordan: Page;
  morgan: Page;
  riley: Page;
  sam: Page;
  project: string;
  projectName: string;
  close: () => Promise<void>;
};

async function invitee(browser: Browser, address: string) {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100' });
  const page = await context.newPage();
  await acceptInvitation(page, address);
  return page;
}

// The auth library allows 120 sign-ins a minute from one address, which the whole suite run in
// one go can reach. So Morgan, Riley and Sam sign in once, by their first invitation, and are added
// to each later test's new project as people who already use XR Studio; Jordan's session is kept
// too. Every test still gets a project of its own.
type Signed = { emails: { morgan: string; riley: string; sam: string }; morgan: Page; riley: Page; sam: Page };
let signed: Signed | undefined;
let jordanCookies: Awaited<ReturnType<ReturnType<Page['context']>['cookies']>> | undefined;

export async function crew(page: Page, browser: Browser, opts: { approvers?: boolean } = { approvers: true }): Promise<Crew> {
  if (jordanCookies) await page.context().addCookies(jordanCookies);
  else {
    await signIn(page, FIRST.jordan);
    jordanCookies = await page.context().cookies();
  }
  const projectName = uniq('Lantern ');
  const project = await startProject(page, projectName);
  const emails = signed?.emails ?? { morgan: `${uniq('morgan-')}@xr.test`, riley: `${uniq('riley-')}@xr.test`, sam: `${uniq('sam-')}@xr.test` };
  await addPerson(page, project, { email: emails.morgan, name: 'Morgan Ray', roles: ['Director'] });
  await addPerson(page, project, { email: emails.riley, name: 'Riley Chen', roles: ['Artist'] });
  await addPerson(page, project, { email: emails.sam, name: 'Sam Okafor', roles: ['Technical artist'] });
  signed ??= { emails, morgan: await invitee(browser, emails.morgan), riley: await invitee(browser, emails.riley), sam: await invitee(browser, emails.sam) };
  const { morgan, riley, sam } = signed;
  if (opts.approvers !== false) {
    await setArea(page, project, 'creative', 'Morgan Ray', 'Sam Okafor');
    await setArea(page, project, 'performance-and-behaviour', 'Morgan Ray', null);
  }
  return {
    jordan: page,
    morgan,
    riley,
    sam,
    project,
    projectName,
    // The three sessions are kept for the next test (see above).
    close: async () => undefined,
  };
}

export async function setArea(page: Page, project: string, area: string, approver: string, delegate: string | null) {
  const response = await page.request.put(`/api/v1/projects/${project}/approvers/${area}`, {
    data: { approverId: await personId(page, project, approver), delegateId: delegate ? await personId(page, project, delegate) : null },
  });
  expect(response.ok(), await response.text()).toBe(true);
}

async function personId(page: Page, project: string, name: string): Promise<string> {
  const response = await page.request.get(`/api/v1/projects/${project}/people`);
  const people = (await response.json()) as { id: string; display: string }[];
  const found = people.find((p) => p.display === name);
  if (!found) throw new Error(`no ${name} on the project`);
  return found.id;
}

// Uploads a small image as a review file and sends it, all through the API.
export async function apiSend(page: Page, project: string, item: { title: string; handoff: string; waitingOn?: string; whatChanged?: string }) {
  const asked = await page.request.post(`/api/v1/projects/${project}/uploads`, {
    data: { requestId: randomUUID(), title: item.title, fileName: 'sheet.png', mediaType: 'image/png', size: PNG.length, purpose: 'review' },
  });
  expect(asked.ok(), await asked.text()).toBe(true);
  const { uploadId, uploadUrl } = (await asked.json()) as { uploadId: string; uploadUrl: string };
  const put = await page.request.put(uploadUrl, { data: Buffer.from(PNG), headers: { 'content-type': 'image/png' } });
  expect(put.ok()).toBe(true);
  const registered = await page.request.post(`/api/v1/projects/${project}/uploads/${uploadId}/register`);
  const file = (await registered.json()) as { fileId: string };
  const sent = await page.request.post(`/api/v1/projects/${project}/review-items`, {
    data: { title: item.title, handoff: item.handoff, whatChanged: item.whatChanged ?? 'Front and side views.', fileId: file.fileId, waitingOn: item.waitingOn ?? null },
  });
  expect(sent.ok(), await sent.text()).toBe(true);
  return ((await sent.json()) as { itemId: string }).itemId;
}
