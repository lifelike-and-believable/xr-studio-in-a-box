import 'server-only';
import { RoleIdSchema, permissionsFor, sortRoles, usesDashboard, type Permission, type RoleId } from '@xr/contracts';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { organisation, organisationSteward, person, project, projectRole, projectRoleRemoved } from '../db/schema';
import { DASHBOARD_ROLES, organisationsToStartIn, ownersIn, rolesOf } from './commands';
import { isId } from './ids';
import { displayName } from './principal';

// Reads for the dashboard. Every list is built from the person's own assignments on the server,
// so nothing they may not see reaches the browser (docs-your-projects).

const toRoles = (values: string[]): RoleId[] => sortRoles(values.map((v) => RoleIdSchema.parse(v)));

export type ProjectSummary = {
  id: string;
  name: string;
  organisationId: string;
  organisation: string;
  roles: RoleId[];
  owner: boolean;
};

// Projects on which the person has a role that uses the dashboard (AC-13).
export async function projectsFor(personId: string): Promise<ProjectSummary[]> {
  const rows = await db()
    .select({
      id: project.id,
      name: project.name,
      organisationId: organisation.id,
      organisation: organisation.name,
      ownerId: project.ownerId,
      role: projectRole.role,
    })
    .from(projectRole)
    .innerJoin(project, eq(project.id, projectRole.projectId))
    .innerJoin(organisation, eq(organisation.id, project.organisationId))
    .where(eq(projectRole.personId, personId))
    .orderBy(organisation.name, project.name);
  const byId = new Map<string, ProjectSummary>();
  for (const r of rows) {
    const entry = byId.get(r.id) ?? {
      id: r.id,
      name: r.name,
      organisationId: r.organisationId,
      organisation: r.organisation,
      roles: [],
      owner: r.ownerId === personId,
    };
    entry.roles = toRoles([...entry.roles, r.role]);
    byId.set(r.id, entry);
  }
  return [...byId.values()].filter((p) => usesDashboard(p.roles));
}

// A person whose roles (for example Performer) do not use the dashboard anywhere (AC-16).
export async function hasOnlyNonDashboardRoles(personId: string): Promise<boolean> {
  const rows = await db().select({ role: projectRole.role }).from(projectRole).where(eq(projectRole.personId, personId));
  return rows.length > 0 && !usesDashboard(toRoles(rows.map((r) => r.role)));
}

export type ProjectView =
  | { state: 'open'; project: typeof project.$inferSelect; organisation: string; roles: RoleId[]; can: Set<Permission> }
  | { state: 'access-removed' }
  | { state: 'not-available' };

// The same answer for a page that does not exist and one the person may not see; only someone
// who had a role there and lost it is told so (AC-16).
export async function projectFor(personId: string, projectId: string): Promise<ProjectView> {
  if (!isId(projectId)) return { state: 'not-available' };
  const rows = await db()
    .select({ project, organisation: organisation.name })
    .from(project)
    .innerJoin(organisation, eq(organisation.id, project.organisationId))
    .where(eq(project.id, projectId))
    .limit(1);
  const found = rows[0];
  if (!found) return { state: 'not-available' };
  const roles = toRoles(await rolesOf(db(), projectId, personId));
  const can = permissionsFor(roles);
  if (can.has('open-project')) return { state: 'open', project: found.project, organisation: found.organisation, roles, can };
  const removed = await db()
    .select({ at: projectRoleRemoved.removedAt })
    .from(projectRoleRemoved)
    .where(and(eq(projectRoleRemoved.projectId, projectId), eq(projectRoleRemoved.personId, personId)))
    .limit(1);
  return removed.length > 0 ? { state: 'access-removed' } : { state: 'not-available' };
}

export type PersonOnProject = {
  id: string;
  display: string;
  email: string;
  roles: RoleId[];
  owner: boolean;
  status: 'Signed in' | 'Invited, not signed in yet' | 'No dashboard access';
};

export async function peopleOn(projectId: string): Promise<PersonOnProject[]> {
  const owner = (await db().select({ ownerId: project.ownerId }).from(project).where(eq(project.id, projectId)).limit(1))[0];
  const rows = await db()
    .select({ person, role: projectRole.role })
    .from(projectRole)
    .innerJoin(person, eq(person.id, projectRole.personId))
    .where(eq(projectRole.projectId, projectId))
    .orderBy(person.createdAt);
  const byId = new Map<string, PersonOnProject>();
  for (const r of rows) {
    const entry = byId.get(r.person.id) ?? {
      id: r.person.id,
      display: displayName(r.person),
      email: r.person.email,
      roles: [],
      owner: owner?.ownerId === r.person.id,
      status: 'Signed in' as const,
    };
    entry.roles = toRoles([...entry.roles, r.role]);
    entry.status = !usesDashboard(entry.roles)
      ? 'No dashboard access'
      : r.person.firstSignedInAt
        ? 'Signed in'
        : 'Invited, not signed in yet';
    byId.set(r.person.id, entry);
  }
  return [...byId.values()];
}

export function managers(people: PersonOnProject[]): PersonOnProject[] {
  return people.filter((p) => permissionsFor(p.roles).has('manage-people'));
}

// "Jordan Lee", "Jordan Lee or Morgan Ray", "A, B or C".
export function orList(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`;
}

export type OrganisationSummary = { id: string; name: string; you: 'Look after it' | 'On its projects' };

export async function organisationsFor(personId: string): Promise<OrganisationSummary[]> {
  const stewarded = await db()
    .select({ id: organisation.id, name: organisation.name })
    .from(organisationSteward)
    .innerJoin(organisation, eq(organisation.id, organisationSteward.organisationId))
    .where(eq(organisationSteward.personId, personId));
  const result = new Map<string, OrganisationSummary>(stewarded.map((o) => [o.id, { ...o, you: 'Look after it' as const }]));
  for (const p of await projectsFor(personId)) {
    if (!result.has(p.organisationId)) result.set(p.organisationId, { id: p.organisationId, name: p.organisation, you: 'On its projects' });
  }
  return [...result.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export type OrganisationView = {
  id: string;
  name: string;
  stewards: { id: string; display: string }[];
  looksAfter: boolean;
  projects: { id: string; name: string }[];
};

export async function organisationFor(personId: string, organisationId: string): Promise<OrganisationView | null> {
  if (!isId(organisationId)) return null;
  const visible = await organisationsFor(personId);
  const mine = visible.find((o) => o.id === organisationId);
  if (!mine) return null;
  const stewards = await db()
    .select({ person })
    .from(organisationSteward)
    .innerJoin(person, eq(person.id, organisationSteward.personId))
    .where(eq(organisationSteward.organisationId, organisationId));
  const looksAfter = mine.you === 'Look after it';
  const projects = looksAfter
    ? await db()
        .select({ id: project.id, name: project.name })
        .from(project)
        .where(eq(project.organisationId, organisationId))
        .orderBy(project.name)
    : (await projectsFor(personId)).filter((p) => p.organisationId === organisationId).map(({ id, name }) => ({ id, name }));
  return {
    id: organisationId,
    name: mine.name,
    stewards: stewards.map((s) => ({ id: s.person.id, display: displayName(s.person) })),
    looksAfter,
    projects,
  };
}

export type Choice = { id: string; label: string };

// Organisations offered on **Start a project**, each with its possible owners (AC-19).
export async function startChoices(me: { id: string; display: string }) {
  const ids = [...(await organisationsToStartIn(db(), me.id))];
  const orgs = ids.length
    ? await db()
        .select({ id: organisation.id, name: organisation.name })
        .from(organisation)
        .where(sql`${organisation.id} in ${ids}`)
        .orderBy(organisation.name)
    : [];
  const choices: { id: string; name: string; owners: Choice[] }[] = [];
  for (const org of orgs) {
    const ownerIds = [...(await ownersIn(db(), me.id, org.id))].filter((id) => id !== me.id);
    const others = ownerIds.length
      ? await db().select().from(person).where(sql`${person.id} in ${ownerIds}`)
      : [];
    choices.push({
      ...org,
      owners: [
        { id: me.id, label: `${me.display} (you)` },
        ...others.map((p) => ({ id: p.id, label: displayName(p) })).sort((a, b) => a.label.localeCompare(b.label)),
      ],
    });
  }
  return choices;
}

// People who may be ticked under **Looked after by**: the person and people on their projects.
// Only dashboard roles count on both sides, so a performer or collaborator is never offered and
// never makes someone a colleague (as in projectsFor).
export async function stewardChoices(me: { id: string; display: string }, extra: string[] = []): Promise<Choice[]> {
  const rows = await db().execute<{ person_id: string }>(sql`
    select distinct other.person_id from project_role mine
    join project_role other on other.project_id = mine.project_id
    where mine.person_id = ${me.id} and other.person_id <> ${me.id}
      and mine.role in ${DASHBOARD_ROLES} and other.role in ${DASHBOARD_ROLES}`);
  const ids = [...new Set([...rows.rows.map((r) => r.person_id), ...extra.filter((id) => id !== me.id)])];
  const others = ids.length ? await db().select().from(person).where(sql`${person.id} in ${ids}`) : [];
  return [
    { id: me.id, label: `${me.display} (you)` },
    ...others.map((p) => ({ id: p.id, label: displayName(p) })).sort((a, b) => a.label.localeCompare(b.label)),
  ];
}

export async function personOn(projectId: string, personId: string) {
  if (!isId(projectId)) return { people: [], target: undefined };
  const people = await peopleOn(projectId);
  return { people, target: people.find((p) => p.id === personId) };
}
