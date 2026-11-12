import { expect, type Browser, type Page } from '@playwright/test';
import { FIRST, acceptInvitation, addPerson, createOrganisation, signIn, startProject, uniq } from './world';

// Shared set-up for the slice 2 end-to-end tests (layer1-facts-identifiers-activity): Jordan
// looks after an organisation and directs a project in it, Riley is an Artist and Tess a
// Technical artist on that project.

export type Team = {
  jordan: Page;
  riley: Page;
  tess: Page;
  org: string;
  orgName: string;
  project: string;
  projectName: string;
  rileyEmail: string;
  close: () => Promise<void>;
};

async function invitee(browser: Browser, address: string, timezoneId?: string) {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3100', timezoneId });
  const page = await context.newPage();
  await acceptInvitation(page, address);
  return page;
}

export async function team(page: Page, browser: Browser, opts: { rileyTimezone?: string } = {}): Promise<Team> {
  await signIn(page, FIRST.jordan);
  const orgName = uniq('Harbourfront ');
  const org = await createOrganisation(page, orgName);
  const projectName = uniq('Lantern ');
  const project = await startProject(page, projectName, { organisation: orgName });
  const rileyEmail = `${uniq('riley-')}@xr.test`;
  const tessEmail = `${uniq('tess-')}@xr.test`;
  await addPerson(page, project, { email: rileyEmail, name: 'Riley Chen', roles: ['Artist'] });
  await addPerson(page, project, { email: tessEmail, name: 'Tess Park', roles: ['Technical artist'] });
  const riley = await invitee(browser, rileyEmail, opts.rileyTimezone);
  const tess = await invitee(browser, tessEmail);
  return {
    jordan: page,
    riley,
    tess,
    org,
    orgName,
    project,
    projectName,
    rileyEmail,
    close: async () => {
      await riley.context().close();
      await tess.context().close();
    },
  };
}

// Opens a fact's edit page from Facts and saves one text value.
export async function saveText(page: Page, project: string, fact: string, text: string) {
  await page.goto(`/projects/${project}/facts/${fact}/edit`);
  await page.getByRole('textbox', { name: new RegExp(`^${fact.replace('-', ' ')}$`, 'i') }).fill(text);
  await page.getByRole('button', { name: new RegExp(`^Save ${fact.replace('-', ' ')}$`, 'i') }).click();
  await expect(page.getByRole('status')).toBeVisible();
}

export async function saveOrgText(page: Page, org: string, fact: string, label: string, text: string) {
  await page.goto(`/organisations/${org}/facts/${fact}/edit`);
  await page.getByRole('textbox', { name: label, exact: true }).fill(text);
  await page.getByRole('button', { name: `Save ${label.toLowerCase()}` }).click();
  await expect(page.getByRole('status')).toBeVisible();
}

// The error summary, told apart from the route announcer Next.js adds with role alert.
export const errorSummary = (page: Page) => page.locator('.summary[role="alert"]');
