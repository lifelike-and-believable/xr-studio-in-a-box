import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createOrganisation,
  editOrganisation,
  removePerson,
  setRoles,
  startProject,
  type Principal,
} from '../src/record/commands';
import { canSignIn } from '../src/record/eligibility';
import { sendLimited } from '../src/record/mail';
import { organisationFor, projectFor } from '../src/record/queries';
import { safeReturn, signInRequestById } from '../src/record/sign-in';

// Race, id and eligibility checks on the record (layer1-organisations-projects-people). Each test
// makes its own people and projects, so it does not depend on what other tests left behind.
process.env.MAIL_CAPTURE_DIR ??= mkdtempSync(path.join(tmpdir(), 'xr-mail-unit-'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const asPerson = (personId: string): Principal => ({ type: 'person', personId, channel: 'dashboard' });

async function person(name: string, opts: { account?: boolean; signedIn?: boolean } = {}): Promise<string> {
  const id = randomUUID();
  const email = `${name.toLowerCase()}-${id}@xr.test`;
  let authUserId: string | null = null;
  if (opts.account) {
    authUserId = randomUUID();
    await pool.query('insert into auth_user (id, name, email, email_verified) values ($1, $2, $3, true)', [authUserId, name, email]);
  }
  await pool.query('insert into person (id, email, name, auth_user_id, first_signed_in_at) values ($1, $2, $3, $4, $5)', [
    id,
    email,
    name,
    authUserId,
    opts.signedIn ? new Date() : null,
  ]);
  return id;
}

async function projectWith(owner: string): Promise<string> {
  const org = await createOrganisation(asPerson(owner), { name: `Org ${randomUUID()}`, stewardIds: [owner] });
  if (!org.ok) throw new Error(`setup failed: ${JSON.stringify(org)}`);
  const started = await startProject(asPerson(owner), { name: `P ${randomUUID()}`, brief: '', organisationId: org.value.id, ownerId: owner });
  if (!started.ok) throw new Error(`setup failed: ${JSON.stringify(started)}`);
  return started.value.id;
}

async function give(projectId: string, personId: string, roles: string[]) {
  for (const role of roles) {
    await pool.query('insert into project_role (project_id, person_id, role) values ($1, $2, $3)', [projectId, personId, role]);
  }
}

async function managers(projectId: string): Promise<number> {
  const rows = await pool.query(
    "select count(distinct person_id)::int as n from project_role where project_id = $1 and role in ('director', 'producer')",
    [projectId],
  );
  return rows.rows[0].n;
}

beforeAll(async () => {
  await pool.query('select 1');
});

afterAll(async () => {
  await pool.end();
});

describe('return addresses stay on this site (layer1-organisations-projects-people#AC-4)', () => {
  it('keeps a path on this site, with its query and fragment', () => {
    expect(safeReturn('/projects/abc?tab=people#top')).toBe('/projects/abc?tab=people#top');
  });

  it.each([
    ['//evil.example'],
    ['/\\evil.example'],
    ['/\t/evil.example'],
    ['/\n/evil.example'],
    ['/\r//evil.example'],
    ['\\\\evil.example'],
    ['https://evil.example/'],
    ['javascript:alert(1)'],
    [''],
  ])('refuses %j', (next) => {
    expect(safeReturn(next)).toBe('/');
  });
});

describe('the last person who can manage people stays, even at the same moment (layer1-organisations-projects-people#AC-33)', () => {
  it('lets only one of two managers remove the other at once', async () => {
    const a = await person('A');
    const b = await person('B');
    const projectId = await projectWith(a);
    await give(projectId, b, ['director']);
    const results = await Promise.all([removePerson(asPerson(a), projectId, b), removePerson(asPerson(b), projectId, a)]);
    // The second waits for the first: by then it is either the last manager (409) or no longer on
    // the project at all (403). Either way it changes nothing.
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok)).toEqual([expect.objectContaining({ ok: false })]);
    expect(await managers(projectId)).toBe(1);
  });

  it('lets only one of two managers take the other off Director and Producer at once', async () => {
    const a = await person('A');
    const b = await person('B');
    const projectId = await projectWith(a);
    await give(projectId, b, ['director']);
    // Each also drops their own manager role, so both changes together would leave nobody.
    const results = await Promise.all([
      setRoles(asPerson(a), projectId, a, { roles: ['artist'] }),
      setRoles(asPerson(b), projectId, b, { roles: ['artist'] }),
    ]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(await managers(projectId)).toBe(1);
  });
});

describe('a double submit makes one record (layer1-organisations-projects-people#AC-26)', () => {
  it('creates one organisation when the same name is sent twice at once', async () => {
    const me = await person('Org');
    const name = `Twice ${randomUUID()}`;
    const results = await Promise.all([
      createOrganisation(asPerson(me), { name, stewardIds: [me] }),
      createOrganisation(asPerson(me), { name, stewardIds: [me] }),
    ]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok)).toEqual([expect.objectContaining({ status: 409 })]);
    const rows = await pool.query('select count(*)::int as n from organisation where name = $1', [name]);
    expect(rows.rows[0].n).toBe(1);
  });

  it('starts one project and one default organisation when sent twice at once (layer1-organisations-projects-people#AC-21)', async () => {
    const me = await person('Solo');
    const name = `Default ${randomUUID()}`;
    const input = { name, brief: '', organisationId: null, ownerId: me };
    const results = await Promise.all([startProject(asPerson(me), input), startProject(asPerson(me), input)]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    const refused = results.find((r) => !r.ok);
    expect(refused).toMatchObject({ status: 409, fields: { name: `There is already a project called ${name} in ${name}. Choose a different name.` } });
    const orgs = await pool.query('select count(*)::int as n from organisation where name = $1', [name]);
    expect(orgs.rows[0].n).toBe(1);
  });
});

describe('a malformed id is not available, never a failure (layer1-organisations-projects-people#AC-16)', () => {
  it('answers each read and command with not available', async () => {
    const me = await person('Ids');
    const bad = 'not-an-id';
    expect(await projectFor(me, bad)).toEqual({ state: 'not-available' });
    expect(await organisationFor(me, bad)).toBeNull();
    expect(await signInRequestById(bad)).toBeUndefined();
    expect(await removePerson(asPerson(me), bad, me)).toMatchObject({ ok: false, status: 404 });
    expect(await setRoles(asPerson(me), bad, bad, { roles: ['artist'] })).toMatchObject({ ok: false, status: 404 });
    expect(await editOrganisation(asPerson(me), bad, { name: 'X', stewardIds: [me] })).toMatchObject({ ok: false, status: 404 });
    expect(await startProject(asPerson(me), { name: 'X', brief: '', organisationId: bad, ownerId: me })).toMatchObject({
      ok: false,
      status: 403,
    });
  });
});

describe('one email a minute, even for requests at once (layer1-organisations-projects-people#AC-3)', () => {
  it('sends one of two sign-in emails asked for at the same moment', async () => {
    const address = `once-${randomUUID()}@xr.test`;
    const content = { subject: 'Your XR Studio sign-in link', text: 'test' };
    const results = await Promise.all([sendLimited(address, 'sign-in', content), sendLimited(address, 'sign-in', content)]);
    expect(results.sort()).toEqual(['limited', 'sent']);
  });
});

describe('who may be sent a sign-in link (layer1-organisations-projects-people#AC-1)', () => {
  it('does not admit someone who only looks after an organisation', async () => {
    const steward = await person('Steward', { account: true });
    const other = await person('Other');
    const projectId = await projectWith(other);
    const org = await pool.query('select organisation_id from project where id = $1', [projectId]);
    await pool.query('insert into organisation_steward (organisation_id, person_id) values ($1, $2)', [org.rows[0].organisation_id, steward]);
    const email = (await pool.query('select email from person where id = $1', [steward])).rows[0].email;
    expect(await canSignIn(email)).toBe(false);
  });
});

describe('losing and regaining dashboard access (layer1-organisations-projects-people#AC-16, AC-30)', () => {
  it('records access removed when the last dashboard role goes, and clears it when one returns', async () => {
    const jordan = await person('Jordan');
    const riley = await person('Riley', { account: true, signedIn: true });
    const projectId = await projectWith(jordan);
    await give(projectId, riley, ['artist']);
    const removed = () =>
      pool.query('select count(*)::int as n from project_role_removed where project_id = $1 and person_id = $2', [projectId, riley]);
    expect((await setRoles(asPerson(jordan), projectId, riley, { roles: ['performer'] })).ok).toBe(true);
    expect((await removed()).rows[0].n).toBe(1);
    expect(await projectFor(riley, projectId)).toEqual({ state: 'access-removed' });
    expect((await setRoles(asPerson(jordan), projectId, riley, { roles: ['artist'] })).ok).toBe(true);
    expect((await removed()).rows[0].n).toBe(0);
  });

  it('invites a performer given a dashboard role, so they can sign in', async () => {
    const jordan = await person('Jordan');
    const kai = await person('Kai');
    const projectId = await projectWith(jordan);
    await give(projectId, kai, ['performer']);
    const result = await setRoles(asPerson(jordan), projectId, kai, { roles: ['artist'] });
    expect(result).toMatchObject({ ok: true, value: { invitation: { personId: kai, needsAccount: true, roles: ['artist'] } } });
  });

  it('invites an owner who has never signed in', async () => {
    const jordan = await person('Jordan');
    const kai = await person('Kai');
    const projectId = await projectWith(jordan);
    await give(projectId, kai, ['artist']);
    const org = (await pool.query('select organisation_id from project where id = $1', [projectId])).rows[0].organisation_id;
    const result = await startProject(asPerson(jordan), { name: `Owned ${randomUUID()}`, brief: '', organisationId: org, ownerId: kai });
    expect(result).toMatchObject({ ok: true, value: { ownerInvitation: { personId: kai, needsAccount: true } } });
  });
});

describe('Looked after by offers only people on the dashboard (layer1-organisations-projects-people#AC-18)', () => {
  it('refuses a steward who is on a project only as a performer', async () => {
    const jordan = await person('Jordan');
    const kai = await person('Kai');
    const projectId = await projectWith(jordan);
    await give(projectId, kai, ['performer']);
    const result = await createOrganisation(asPerson(jordan), { name: `With Kai ${randomUUID()}`, stewardIds: [jordan, kai] });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });
});
