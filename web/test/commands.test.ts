import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  addPerson,
  createOrganisation,
  editOrganisation,
  removePerson,
  setRoles,
  startProject,
  type Principal,
} from '../src/record/commands';

// The command layer against the test database (layer1-organisations-projects-people#AC-27).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function person(name: string): Promise<string> {
  const id = randomUUID();
  await pool.query('insert into person (id, email, name) values ($1, $2, $3)', [
    id,
    `${name.toLowerCase()}-${id}@xr.test`,
    name,
  ]);
  return id;
}

const asPerson = (personId: string): Principal => ({ type: 'person', personId, channel: 'dashboard' });
const asAgent = (personId: string): Principal => ({ type: 'agent-session', personId, channel: 'agent' });

let jordan: string;
let outsider: string;
let organisationId: string;
let projectId: string;

beforeAll(async () => {
  jordan = await person('Jordan');
  outsider = await person('Outsider');
  const org = await createOrganisation(asPerson(jordan), { name: `Org ${randomUUID()}`, stewardIds: [jordan] });
  if (!org.ok) throw new Error(`setup failed: ${JSON.stringify(org)}`);
  organisationId = org.value.id;
  const project = await startProject(asPerson(jordan), {
    name: `Project ${randomUUID()}`,
    brief: '',
    organisationId,
    ownerId: jordan,
  });
  if (!project.ok) throw new Error(`setup failed: ${JSON.stringify(project)}`);
  projectId = project.value.id;
});

afterAll(async () => {
  await pool.end();
});

describe('who can create and edit organisations and projects (layer1-organisations-projects-people#AC-27)', () => {
  it('refuses an agent session the people and organisation commands, whatever the person holds', async () => {
    const agent = asAgent(jordan);
    const results = [
      await createOrganisation(agent, { name: `Agent org ${randomUUID()}`, stewardIds: [jordan] }),
      await addPerson(agent, projectId, { email: `${randomUUID()}@xr.test`, roles: ['artist'] }),
      await setRoles(agent, projectId, jordan, { roles: ['director'] }),
      await removePerson(agent, projectId, jordan),
    ];
    for (const result of results) expect(result).toMatchObject({ ok: false, status: 403 });
    const roles = await pool.query('select role from project_role where project_id = $1 order by role', [projectId]);
    expect(roles.rows.map((r) => r.role)).toEqual(['director', 'producer']);
  });

  it('starts a project only in an organisation the person looks after or has projects in', async () => {
    const refused = await startProject(asPerson(outsider), {
      name: `Sneaky ${randomUUID()}`,
      brief: '',
      organisationId,
      ownerId: outsider,
    });
    expect(refused).toMatchObject({ ok: false, status: 403 });
  });

  it('edits an organisation only for people who look after it', async () => {
    const refused = await editOrganisation(asPerson(outsider), organisationId, {
      name: 'Taken over',
      stewardIds: [outsider],
    });
    expect(refused).toMatchObject({ ok: false, status: 403 });
    const allowed = await editOrganisation(asPerson(jordan), organisationId, {
      name: `Renamed ${randomUUID()}`,
      stewardIds: [jordan],
    });
    expect(allowed.ok).toBe(true);
  });
});
