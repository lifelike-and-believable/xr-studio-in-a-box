import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import {
  EmailSchema,
  joinLabels,
  permissionsFor,
  RoleIdSchema,
  usesDashboard,
  type Permission,
  type RoleId,
} from '@xr/contracts';
import { and, eq, inArray, isNull, ne, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  invitation,
  organisation,
  organisationSteward,
  person,
  project,
  projectRole,
  projectRoleRemoved,
} from '../db/schema';
import { newId } from './ids';
import { displayName, type Principal } from './principal';

export type { Principal } from './principal';

// The command layer: every write in slice 1 goes through one of these functions
// (layer1-organisations-projects-people#AC-37). Each takes the principal, reads its roles from
// the record for this call, checks permissions, and writes in one transaction. Slice 2 adds the
// activity log entry and the identifier scan inside each transaction, at the marked place.

export type Refusal = {
  ok: false;
  status: 400 | 403 | 404 | 409;
  message?: string;
  fields?: Record<string, string>;
  personId?: string;
};
export type Result<T> = { ok: true; value: T } | Refusal;

const refuse = (status: Refusal['status'], extra: Omit<Refusal, 'ok' | 'status'> = {}): Refusal => ({
  ok: false,
  status,
  ...extra,
});
const forbidden = () => refuse(403, { message: 'Not allowed.' });

// Agents only draft in later slices; in slice 1 every command refuses an agent session, whatever
// roles the person it acts for holds (layer1-organisations-projects-people#AC-27).
const isAgent = (p: Principal) => p.type !== 'person';

type Tx = Parameters<Parameters<ReturnType<typeof db>['transaction']>[0]>[0];
type Reader = ReturnType<typeof db> | Tx;

export const LAST_MANAGER =
  'You are the only person on this project who can add people and change roles, so this role stays until you give someone else the Director or Producer role.';

export async function rolesOf(reader: Reader, projectId: string, personId: string): Promise<RoleId[]> {
  const rows = await reader
    .select({ role: projectRole.role })
    .from(projectRole)
    .where(and(eq(projectRole.projectId, projectId), eq(projectRole.personId, personId)));
  return rows.map((r) => RoleIdSchema.parse(r.role));
}

async function can(reader: Reader, projectId: string, personId: string, permission: Permission) {
  return permissionsFor(await rolesOf(reader, projectId, personId)).has(permission);
}

async function stewardsOf(reader: Reader, organisationId: string): Promise<string[]> {
  const rows = await reader
    .select({ personId: organisationSteward.personId })
    .from(organisationSteward)
    .where(eq(organisationSteward.organisationId, organisationId));
  return rows.map((r) => r.personId);
}

// People who share a project with this person (offered under "Looked after by").
async function colleaguesOf(reader: Reader, personId: string): Promise<Set<string>> {
  const rows = await reader.execute<{ person_id: string }>(sql`
    select distinct other.person_id from project_role mine
    join project_role other on other.project_id = mine.project_id
    where mine.person_id = ${personId}`);
  return new Set(rows.rows.map((r) => r.person_id));
}

// Organisations a person may start projects in: those they look after or have projects in.
export async function organisationsToStartIn(reader: Reader, personId: string): Promise<Set<string>> {
  const rows = await reader.execute<{ id: string }>(sql`
    select organisation_id as id from organisation_steward where person_id = ${personId}
    union
    select p.organisation_id from project p join project_role r on r.project_id = p.id where r.person_id = ${personId}`);
  return new Set(rows.rows.map((r) => r.id));
}

// Possible owners in an organisation: the person, and people on that organisation's projects.
export async function ownersIn(reader: Reader, personId: string, organisationId: string | null): Promise<Set<string>> {
  const owners = new Set([personId]);
  if (!organisationId) return owners;
  const rows = await reader.execute<{ person_id: string }>(sql`
    select distinct r.person_id from project_role r join project p on p.id = r.project_id
    where p.organisation_id = ${organisationId}`);
  for (const r of rows.rows) owners.add(r.person_id);
  return owners;
}

async function managersLeft(reader: Reader, projectId: string, without: string, newRoles: RoleId[]): Promise<number> {
  const rows = await reader
    .select({ personId: projectRole.personId })
    .from(projectRole)
    .where(
      and(
        eq(projectRole.projectId, projectId),
        ne(projectRole.personId, without),
        inArray(projectRole.role, ['director', 'producer']),
      ),
    );
  const others = new Set(rows.map((r) => r.personId)).size;
  return others + (permissionsFor(newRoles).has('manage-people') ? 1 : 0);
}

function uniqueViolation(error: unknown): boolean {
  const code = (error as { code?: unknown; cause?: { code?: unknown } } | null)?.code ??
    (error as { cause?: { code?: unknown } } | null)?.cause?.code;
  return code === '23505';
}

const ORG_NAME = 'Enter the organisation name.';
const PROJECT_NAME = 'Enter the project name.';
const OWNER_GONE = 'The person you chose can no longer own a project here. Choose another owner.';
const orgTaken = (name: string) => `You already look after an organisation called ${name}. Choose a different name.`;
const projectTaken = (name: string, org: string) =>
  `There is already a project called ${name} in ${org}. Choose a different name.`;

async function stewardNameTaken(reader: Reader, personId: string, name: string, except?: string) {
  const rows = await reader.execute<{ id: string }>(sql`
    select o.id from organisation o join organisation_steward s on s.organisation_id = o.id
    where s.person_id = ${personId} and lower(o.name) = lower(${name})
    ${except ? sql`and o.id <> ${except}` : sql``}
    limit 1`);
  return rows.rows.length > 0;
}

function checkStewards(stewardIds: string[], allowed: Set<string>) {
  const ids = [...new Set(stewardIds)];
  if (ids.length === 0) return { ok: false as const, message: 'An organisation always has at least one person looking after it.' };
  if (ids.some((id) => !allowed.has(id))) return { ok: false as const, message: 'Choose people from your projects.' };
  return { ok: true as const, ids };
}

export async function createOrganisation(
  principal: Principal,
  input: { name: string; stewardIds: string[] },
): Promise<Result<{ id: string }>> {
  if (isAgent(principal)) return forbidden();
  const name = input.name.trim();
  if (!name) return refuse(400, { fields: { name: ORG_NAME } });
  return db().transaction(async (tx) => {
    if (await stewardNameTaken(tx, principal.personId, name)) return refuse(409, { fields: { name: orgTaken(name) } });
    const allowed = await colleaguesOf(tx, principal.personId);
    allowed.add(principal.personId);
    const stewards = checkStewards(input.stewardIds.length ? input.stewardIds : [principal.personId], allowed);
    if (!stewards.ok) return refuse(400, { fields: { stewardIds: stewards.message } });
    const id = newId();
    await tx.insert(organisation).values({ id, name });
    await tx.insert(organisationSteward).values(stewards.ids.map((personId) => ({ organisationId: id, personId })));
    // Slice 2: activity log entry and identifier scan.
    return { ok: true as const, value: { id } };
  });
}

export async function editOrganisation(
  principal: Principal,
  organisationId: string,
  input: { name: string; stewardIds: string[] },
): Promise<Result<{ id: string }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    const current = await stewardsOf(tx, organisationId);
    if (!current.includes(principal.personId)) return forbidden();
    const name = input.name.trim();
    if (!name) return refuse(400, { fields: { name: ORG_NAME } });
    if (await stewardNameTaken(tx, principal.personId, name, organisationId)) {
      return refuse(409, { fields: { name: orgTaken(name) } });
    }
    const allowed = await colleaguesOf(tx, principal.personId);
    for (const id of [principal.personId, ...current]) allowed.add(id);
    const stewards = checkStewards(input.stewardIds, allowed);
    if (!stewards.ok) return refuse(400, { fields: { stewardIds: stewards.message } });
    await tx.update(organisation).set({ name }).where(eq(organisation.id, organisationId));
    await tx.delete(organisationSteward).where(eq(organisationSteward.organisationId, organisationId));
    await tx.insert(organisationSteward).values(stewards.ids.map((personId) => ({ organisationId, personId })));
    return { ok: true as const, value: { id: organisationId } };
  });
}

export async function startProject(
  principal: Principal,
  input: { name: string; brief: string; organisationId: string | null; ownerId: string },
): Promise<Result<{ id: string; organisationId: string; ownerId: string }>> {
  if (isAgent(principal)) return forbidden();
  const name = input.name.trim();
  if (!name) return refuse(400, { fields: { name: PROJECT_NAME } });
  try {
    return await db().transaction(async (tx) => {
      const me = principal.personId;
      const startable = await organisationsToStartIn(tx, me);
      let organisationId = input.organisationId;
      let orgName: string;
      if (organisationId) {
        if (!startable.has(organisationId)) return forbidden();
        const owners = await ownersIn(tx, me, organisationId);
        if (!owners.has(input.ownerId)) return refuse(409, { fields: { ownerId: OWNER_GONE } });
        const org = await tx.select().from(organisation).where(eq(organisation.id, organisationId)).limit(1);
        orgName = org[0]?.name ?? '';
        const taken = await tx
          .select({ id: project.id })
          .from(project)
          .where(and(eq(project.organisationId, organisationId), sql`lower(${project.name}) = lower(${name})`))
          .limit(1);
        if (taken.length > 0) return refuse(409, { fields: { name: projectTaken(name, orgName) } });
      } else {
        // On no organisation yet: one with the project's name is made, and the person looks after
        // it (layer1-organisations-projects-people#AC-21).
        if (startable.size > 0) return refuse(400, { fields: { organisationId: 'Choose an organisation.' } });
        if (input.ownerId !== me) return refuse(409, { fields: { ownerId: OWNER_GONE } });
        organisationId = newId();
        orgName = name;
        await tx.insert(organisation).values({ id: organisationId, name });
        await tx.insert(organisationSteward).values({ organisationId, personId: me });
      }
      const id = newId();
      await tx.insert(project).values({ id, organisationId, name, brief: input.brief.trim(), ownerId: input.ownerId });
      const roles = [
        { projectId: id, personId: input.ownerId, role: 'director' },
        { projectId: id, personId: input.ownerId, role: 'producer' },
      ];
      // Someone else as owner: the starter keeps Producer (layer1-organisations-projects-people#AC-20).
      if (input.ownerId !== me) roles.push({ projectId: id, personId: me, role: 'producer' });
      await tx.insert(projectRole).values(roles);
      return { ok: true as const, value: { id, organisationId, ownerId: input.ownerId } };
    });
  } catch (error) {
    // Two submits at once: the unique index lets only one project of that name in.
    if (uniqueViolation(error)) return refuse(409, { fields: { name: projectTaken(name, '') } });
    throw error;
  }
}

export async function editProject(
  principal: Principal,
  projectId: string,
  input: { name: string; brief: string },
): Promise<Result<{ id: string }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    if (!(await can(tx, projectId, principal.personId, 'edit-project'))) return forbidden();
    const name = input.name.trim();
    if (!name) return refuse(400, { fields: { name: PROJECT_NAME } });
    const rows = await tx
      .select({ organisationId: project.organisationId, orgName: organisation.name })
      .from(project)
      .innerJoin(organisation, eq(organisation.id, project.organisationId))
      .where(eq(project.id, projectId))
      .limit(1);
    const here = rows[0];
    if (!here) return refuse(404);
    const taken = await tx
      .select({ id: project.id })
      .from(project)
      .where(
        and(eq(project.organisationId, here.organisationId), sql`lower(${project.name}) = lower(${name})`, ne(project.id, projectId)),
      )
      .limit(1);
    if (taken.length > 0) return refuse(409, { fields: { name: projectTaken(name, here.orgName) } });
    await tx.update(project).set({ name, brief: input.brief.trim() }).where(eq(project.id, projectId));
    return { ok: true as const, value: { id: projectId } };
  });
}

export const INVITATION_DAYS = 7;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// A new invitation stops every earlier one for that person and project
// (approver's decision, 2026-11-12; layer1-organisations-projects-people#AC-31).
async function issueInvitation(tx: Tx, personId: string, projectId: string): Promise<string> {
  await tx
    .update(invitation)
    .set({ replacedAt: new Date() })
    .where(
      and(eq(invitation.personId, personId), eq(invitation.projectId, projectId), isNull(invitation.usedAt), isNull(invitation.replacedAt)),
    );
  const token = randomBytes(32).toString('base64url');
  const now = Date.now();
  await tx.insert(invitation).values({
    id: newId(),
    personId,
    projectId,
    tokenHash: hashToken(token),
    createdAt: new Date(now),
    expiresAt: new Date(now + INVITATION_DAYS * 24 * 3600 * 1000),
  });
  return token;
}

export type AddedPerson = {
  personId: string;
  display: string;
  email: string;
  roles: RoleId[];
  // What they get: an invitation, an "added" email (already uses XR Studio), or nothing.
  outcome: 'invitation' | 'added' | 'none';
  invitationToken?: string;
  needsAccount: boolean;
};

export async function addPerson(
  principal: Principal,
  projectId: string,
  input: { email: string; name?: string; roles: RoleId[] },
): Promise<Result<AddedPerson>> {
  if (isAgent(principal)) return forbidden();
  const fields: Record<string, string> = {};
  const email = EmailSchema.safeParse(input.email);
  if (!email.success) fields.email = 'Enter an email address, like name@example.com.';
  const roles = [...new Set(input.roles)];
  if (roles.length === 0) fields.roles = 'Choose at least one role.';
  return db().transaction(async (tx) => {
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    if (!email.success || roles.length === 0) return refuse(400, { fields });
    const address = email.data;
    const name = input.name?.trim() || null;
    const found = await tx.select().from(person).where(sql`lower(${person.email}) = ${address}`).limit(1);
    let target = found[0];
    if (target) {
      const already = await rolesOf(tx, projectId, target.id);
      if (already.length > 0) {
        const who = displayName(target);
        return refuse(409, {
          fields: { email: `${who} is already on this project. Use Change roles or remove for ${who} to change what they can do.` },
          personId: target.id,
        });
      }
      if (!target.name && name) {
        await tx.update(person).set({ name }).where(eq(person.id, target.id));
        target = { ...target, name };
      }
    } else {
      const id = newId();
      await tx.insert(person).values({ id, email: address, name });
      target = { id, email: address, name, authUserId: null, firstSignedInAt: null, createdAt: new Date() };
    }
    await tx.insert(projectRole).values(roles.map((role) => ({ projectId, personId: target.id, role })));
    await tx
      .delete(projectRoleRemoved)
      .where(and(eq(projectRoleRemoved.projectId, projectId), eq(projectRoleRemoved.personId, target.id)));
    const base = { personId: target.id, display: displayName(target), email: target.email, roles };
    if (!usesDashboard(roles)) return { ok: true as const, value: { ...base, outcome: 'none' as const, needsAccount: false } };
    if (target.authUserId && target.firstSignedInAt) {
      return { ok: true as const, value: { ...base, outcome: 'added' as const, needsAccount: false } };
    }
    const token = await issueInvitation(tx, target.id, projectId);
    return {
      ok: true as const,
      value: { ...base, outcome: 'invitation' as const, invitationToken: token, needsAccount: !target.authUserId },
    };
  });
}

export async function setRoles(
  principal: Principal,
  projectId: string,
  personId: string,
  input: { roles: RoleId[] },
): Promise<Result<{ display: string; roles: RoleId[] }>> {
  if (isAgent(principal)) return forbidden();
  const roles = [...new Set(input.roles)];
  return db().transaction(async (tx) => {
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const current = await rolesOf(tx, projectId, personId);
    if (current.length === 0) return refuse(404);
    if (roles.length === 0) return refuse(400, { fields: { roles: 'Choose at least one role.' } });
    if ((await managersLeft(tx, projectId, personId, roles)) === 0) return refuse(409, { message: LAST_MANAGER });
    await tx.delete(projectRole).where(and(eq(projectRole.projectId, projectId), eq(projectRole.personId, personId)));
    await tx.insert(projectRole).values(roles.map((role) => ({ projectId, personId, role })));
    const who = await tx.select().from(person).where(eq(person.id, personId)).limit(1);
    return { ok: true as const, value: { display: who[0] ? displayName(who[0]) : '', roles } };
  });
}

export async function removePerson(
  principal: Principal,
  projectId: string,
  personId: string,
): Promise<Result<{ display: string; project: string }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const current = await rolesOf(tx, projectId, personId);
    if (current.length === 0) return refuse(404);
    if ((await managersLeft(tx, projectId, personId, [])) === 0) return refuse(409, { message: LAST_MANAGER });
    await tx.delete(projectRole).where(and(eq(projectRole.projectId, projectId), eq(projectRole.personId, personId)));
    await tx
      .insert(projectRoleRemoved)
      .values({ projectId, personId })
      .onConflictDoUpdate({ target: [projectRoleRemoved.projectId, projectRoleRemoved.personId], set: { removedAt: new Date() } });
    await tx
      .update(invitation)
      .set({ replacedAt: new Date() })
      .where(and(eq(invitation.personId, personId), eq(invitation.projectId, projectId), isNull(invitation.usedAt)));
    const who = await tx.select().from(person).where(eq(person.id, personId)).limit(1);
    const proj = await tx.select({ name: project.name }).from(project).where(eq(project.id, projectId)).limit(1);
    return { ok: true as const, value: { display: who[0] ? displayName(who[0]) : '', project: proj[0]?.name ?? '' } };
  });
}

// A fresh 7-day invitation for someone who has not signed in yet. The caller sends it, and the
// one-a-minute limit is checked first so a refused resend leaves the earlier link working.
export async function reissueInvitation(
  principal: Principal,
  projectId: string,
  personId: string,
): Promise<Result<{ display: string; email: string; token: string; roles: RoleId[] }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const roles = await rolesOf(tx, projectId, personId);
    const who = (await tx.select().from(person).where(eq(person.id, personId)).limit(1))[0];
    if (!who || roles.length === 0 || !usesDashboard(roles) || who.firstSignedInAt) return refuse(404);
    const token = await issueInvitation(tx, personId, projectId);
    return { ok: true as const, value: { display: displayName(who), email: who.email, token, roles } };
  });
}

export function rolesText(roles: RoleId[]): string {
  return joinLabels(roles);
}
