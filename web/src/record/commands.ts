import 'server-only';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import {
  EmailSchema,
  MAX_SAMPLE_BYTES,
  SAMPLE_SIZE_ERROR,
  SAMPLE_TYPE_ERROR,
  STARTER_FORMATS,
  WorkSamplesValue,
  acceptedSampleType,
  checkPattern,
  factNoun,
  factTexts,
  findIdentifiers,
  formatList,
  formatNoun,
  isOrganisationFact,
  isProjectFact,
  isWorkSamples,
  parseFactInput,
  type Fact,
  type FactValue,
  type FormatSpec,
  joinLabels,
  permissionsFor,
  ROLE_IDS,
  RoleIdSchema,
  usesDashboard,
  type Permission,
  type RoleId,
} from '@xr/contracts';
import { and, asc, desc, eq, inArray, isNull, lt, ne, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { db } from '../db/client';
import {
  activityEntry,
  factVersion,
  identifierConfirmation,
  identifierFormat,
  invitation,
  organisation,
  organisationSteward,
  person,
  project,
  projectRole,
  projectRoleRemoved,
  storedFile,
  upload,
} from '../db/schema';
import { docxText, kindOf, pdfPages } from '../storage/document-text';
import { newStorageKey, readAll, readStart, removeStored, sha256Of, signUpload, storedSize } from '../storage/storage';
import { isId, newId } from './ids';
import { displayName, type Principal } from './principal';

export type { Principal } from './principal';

// The command layer: every write goes through one of these functions
// (layer1-organisations-projects-people#AC-37, layer1-facts-identifiers-activity#AC-40). Each
// takes the principal, reads its roles from the record for this call, checks permissions, and
// writes in one transaction with its activity entry (layer1-facts-identifiers-activity#AC-33).

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
const notFound = () => refuse(404);

// Roles that open the dashboard. Colleagues, organisations to start in and steward choices count
// only these, as the project list does.
export const DASHBOARD_ROLES: RoleId[] = ROLE_IDS.filter((role) => usesDashboard([role]));

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

// Serialises every change to a project's people (layer1-organisations-projects-people#AC-33):
// two removals or role changes that would each leave one manager cannot both pass the
// last-manager check under READ COMMITTED.
async function lockProject(tx: Tx, projectId: string): Promise<boolean> {
  const rows = await tx.execute<{ id: string }>(sql`select id from project where id = ${projectId} for update`);
  return rows.rows.length > 0;
}

// Serialises one person's creates, so a double submit cannot make two organisations of the same
// name or two default organisations (AC-26).
async function lockPerson(tx: Tx, personId: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`person:${personId}`}))`);
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
    where mine.person_id = ${personId}
      and mine.role in ${DASHBOARD_ROLES} and other.role in ${DASHBOARD_ROLES}`);
  return new Set(rows.rows.map((r) => r.person_id));
}

// Organisations a person may start projects in: those they look after or have projects in.
export async function organisationsToStartIn(reader: Reader, personId: string): Promise<Set<string>> {
  const rows = await reader.execute<{ id: string }>(sql`
    select organisation_id as id from organisation_steward where person_id = ${personId}
    union
    select p.organisation_id from project p join project_role r on r.project_id = p.id
    where r.person_id = ${personId} and r.role in ${DASHBOARD_ROLES}`);
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
  if (!input.stewardIds.every(isId)) return refuse(400, { fields: { stewardIds: 'Choose people from your projects.' } });
  return db().transaction(async (tx) => {
    await lockPerson(tx, principal.personId);
    if (await stewardNameTaken(tx, principal.personId, name)) return refuse(409, { fields: { name: orgTaken(name) } });
    const allowed = await colleaguesOf(tx, principal.personId);
    allowed.add(principal.personId);
    const stewards = checkStewards(input.stewardIds.length ? input.stewardIds : [principal.personId], allowed);
    if (!stewards.ok) return refuse(400, { fields: { stewardIds: stewards.message } });
    const id = newId();
    await tx.insert(organisation).values({ id, name });
    await tx.insert(organisationSteward).values(stewards.ids.map((personId) => ({ organisationId: id, personId })));
    await seedStarterFormats(tx, id);
    await log(tx, { kind: 'organisation', id }, principal.personId, 'Organisation', 'Created the organisation');
    return { ok: true as const, value: { id } };
  });
}

export async function editOrganisation(
  principal: Principal,
  organisationId: string,
  input: { name: string; stewardIds: string[] },
): Promise<Result<{ id: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(organisationId) || !input.stewardIds.every(isId)) return notFound();
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
    await log(tx, { kind: 'organisation', id: organisationId }, principal.personId, 'Organisation', "Changed the organisation's name and who looks after it");
    return { ok: true as const, value: { id: organisationId } };
  });
}

// An invitation the caller sends once the command has committed: the person gets an account if
// they have none (ensureAccount), then the invitation email (layer1-organisations-projects-people#AC-30).
export type PendingInvitation = {
  personId: string;
  email: string;
  display: string;
  token: string;
  needsAccount: boolean;
  roles: RoleId[];
};

async function invitationFor(
  tx: Tx,
  projectId: string,
  who: typeof person.$inferSelect,
  roles: RoleId[],
): Promise<PendingInvitation | undefined> {
  if (!usesDashboard(roles) || who.firstSignedInAt) return undefined;
  const token = await issueInvitation(tx, who.id, projectId);
  return { personId: who.id, email: who.email, display: displayName(who), token, needsAccount: !who.authUserId, roles };
}

export async function startProject(
  principal: Principal,
  input: { name: string; brief: string; organisationId: string | null; ownerId: string },
): Promise<Result<{ id: string; organisationId: string; ownerId: string; ownerInvitation?: PendingInvitation }>> {
  if (isAgent(principal)) return forbidden();
  const name = input.name.trim();
  if (!name) return refuse(400, { fields: { name: PROJECT_NAME } });
  if (input.organisationId !== null && !isId(input.organisationId)) return forbidden();
  if (!isId(input.ownerId)) return refuse(409, { fields: { ownerId: OWNER_GONE } });
  try {
    return await db().transaction(async (tx) => {
      const me = principal.personId;
      // A double submit waits here, then finds the first submit's project (AC-26).
      await lockPerson(tx, me);
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
        if (startable.size > 0) {
          // The second of two submits from someone on no organisation: the first made the
          // default organisation and its project, so this one is the duplicate it is.
          const twin = await tx
            .select({ orgName: organisation.name })
            .from(project)
            .innerJoin(organisation, eq(organisation.id, project.organisationId))
            .where(and(sql`${project.organisationId} in ${[...startable]}`, sql`lower(${project.name}) = lower(${name})`))
            .limit(1);
          if (twin[0]) return refuse(409, { fields: { name: projectTaken(name, twin[0].orgName) } });
          return refuse(400, { fields: { organisationId: 'Choose an organisation.' } });
        }
        // On no organisation yet: one with the project's name is made, and the person looks after
        // it (layer1-organisations-projects-people#AC-21).
        if (input.ownerId !== me) return refuse(409, { fields: { ownerId: OWNER_GONE } });
        organisationId = newId();
        orgName = name;
        await tx.insert(organisation).values({ id: organisationId, name });
        await tx.insert(organisationSteward).values({ organisationId, personId: me });
        await seedStarterFormats(tx, organisationId);
        await log(tx, { kind: 'organisation', id: organisationId }, me, 'Organisation', 'Created the organisation');
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
      await log(tx, { kind: 'project', id }, me, 'Project', 'Started the project');
      // An owner who has never signed in (for example someone added only as a performer) gets an
      // account and an invitation, so the owner can open the project (AC-30).
      let ownerInvitation: PendingInvitation | undefined;
      if (input.ownerId !== me) {
        const owner = (await tx.select().from(person).where(eq(person.id, input.ownerId)).limit(1))[0];
        if (owner) ownerInvitation = await invitationFor(tx, id, owner, ['director', 'producer']);
      }
      return { ok: true as const, value: { id, organisationId, ownerId: input.ownerId, ownerInvitation } };
    });
  } catch (error) {
    // Two submits at once: the unique index lets only one project of that name in.
    if (uniqueViolation(error)) {
      const org = input.organisationId
        ? (await db().select({ name: organisation.name }).from(organisation).where(eq(organisation.id, input.organisationId)).limit(1))[0]
        : undefined;
      return refuse(409, { fields: { name: projectTaken(name, org?.name ?? name) } });
    }
    throw error;
  }
}

export async function editProject(
  principal: Principal,
  projectId: string,
  input: { name: string; brief: string },
): Promise<Result<{ id: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(projectId)) return notFound();
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
    await log(tx, { kind: 'project', id: projectId }, principal.personId, 'Project', "Changed the project's name and brief");
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
  if (!isId(projectId)) return notFound();
  return db().transaction(async (tx) => {
    if (!(await lockProject(tx, projectId))) return notFound();
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
    await log(tx, { kind: 'project', id: projectId }, principal.personId, 'People', `Added ${base.display} as ${joinLabels(roles)}`);
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
): Promise<Result<{ display: string; roles: RoleId[]; invitation?: PendingInvitation }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(projectId) || !isId(personId)) return notFound();
  const roles = [...new Set(input.roles)];
  return db().transaction(async (tx) => {
    if (!(await lockProject(tx, projectId))) return notFound();
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const current = await rolesOf(tx, projectId, personId);
    if (current.length === 0) return notFound();
    if (roles.length === 0) return refuse(400, { fields: { roles: 'Choose at least one role.' } });
    if ((await managersLeft(tx, projectId, personId, roles)) === 0) return refuse(409, { message: LAST_MANAGER });
    await tx.delete(projectRole).where(and(eq(projectRole.projectId, projectId), eq(projectRole.personId, personId)));
    await tx.insert(projectRole).values(roles.map((role) => ({ projectId, personId, role })));
    // Losing every dashboard role is told as "access removed"; regaining one clears it (AC-16).
    const removedKey = and(eq(projectRoleRemoved.projectId, projectId), eq(projectRoleRemoved.personId, personId));
    if (usesDashboard(roles)) {
      await tx.delete(projectRoleRemoved).where(removedKey);
    } else if (usesDashboard(current)) {
      await tx
        .insert(projectRoleRemoved)
        .values({ projectId, personId })
        .onConflictDoUpdate({ target: [projectRoleRemoved.projectId, projectRoleRemoved.personId], set: { removedAt: new Date() } });
    }
    const who = (await tx.select().from(person).where(eq(person.id, personId)).limit(1))[0];
    // Gaining a dashboard role (for example a performer made an artist) brings an account and an
    // invitation, as adding them with that role would have (AC-30).
    const invitation = who && !usesDashboard(current) ? await invitationFor(tx, projectId, who, roles) : undefined;
    await log(tx, { kind: 'project', id: projectId }, principal.personId, 'People', `Changed ${who ? displayName(who) : ''}'s roles to ${joinLabels(roles)}`);
    return { ok: true as const, value: { display: who ? displayName(who) : '', roles, invitation } };
  });
}

export async function removePerson(
  principal: Principal,
  projectId: string,
  personId: string,
): Promise<Result<{ display: string; project: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(projectId) || !isId(personId)) return notFound();
  return db().transaction(async (tx) => {
    if (!(await lockProject(tx, projectId))) return notFound();
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const current = await rolesOf(tx, projectId, personId);
    if (current.length === 0) return notFound();
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
    await log(tx, { kind: 'project', id: projectId }, principal.personId, 'People', `Removed ${who[0] ? displayName(who[0]) : ''} from the project`);
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
  if (!isId(projectId) || !isId(personId)) return notFound();
  return db().transaction(async (tx) => {
    if (!(await lockProject(tx, projectId))) return notFound();
    if (!(await can(tx, projectId, principal.personId, 'manage-people'))) return forbidden();
    const roles = await rolesOf(tx, projectId, personId);
    const who = (await tx.select().from(person).where(eq(person.id, personId)).limit(1))[0];
    if (!who || roles.length === 0 || !usesDashboard(roles) || who.firstSignedInAt) return refuse(404);
    const token = await issueInvitation(tx, personId, projectId);
    await log(tx, { kind: 'project', id: projectId }, principal.personId, 'People', `Sent ${displayName(who)} a new invitation link`);
    return { ok: true as const, value: { display: displayName(who), email: who.email, token, roles } };
  });
}

// The first time a person signs in is recorded once, for the People list's status (AC-28). It
// is a system write made on the person's own request, not an action on anyone's behalf.
export async function recordFirstSignIn(personId: string): Promise<void> {
  if (!isId(personId)) return;
  await db()
    .update(person)
    .set({ firstSignedInAt: new Date() })
    .where(and(eq(person.id, personId), isNull(person.firstSignedInAt)));
}

export function rolesText(roles: RoleId[]): string {
  return joinLabels(roles);
}

// ---------------------------------------------------------------------------------------------
// Slice 2: facts, work samples, the identifier filter and the activity log
// (layer1-facts-identifiers-activity).

export type Owner = { kind: 'project' | 'organisation'; id: string };
export type ActivityArea = 'Project' | 'Facts' | 'People' | 'Organisation' | 'Organisation facts' | 'Identifier formats';

const ownerColumns = (owner: Owner) =>
  owner.kind === 'project' ? { projectId: owner.id, organisationId: null } : { projectId: null, organisationId: owner.id };

// The one place an activity entry is written, inside the command's transaction (AC-33). Entries
// are built from the command's words and the names of what changed, never from values (AC-39).
async function log(tx: Tx, owner: Owner, actor: string | null, area: ActivityArea, what: string): Promise<void> {
  await tx.insert(activityEntry).values({
    id: newId(),
    ...ownerColumns(owner),
    at: new Date(),
    actorPersonId: actor,
    actorKind: actor ? 'person' : 'system',
    area,
    what,
  });
}

async function seedStarterFormats(tx: Tx, organisationId: string): Promise<void> {
  await tx.insert(identifierFormat).values(
    STARTER_FORMATS.map((f, i) => ({
      id: newId(),
      organisationId,
      name: f.name,
      kind: f.kind,
      isOn: true,
      starter: true,
      position: i + 1,
    })),
  );
}

// The project's organisation for project facts, the organisation itself for its own facts.
async function organisationOf(reader: Reader, owner: Owner): Promise<{ id: string; name: string } | null> {
  if (!isId(owner.id)) return null;
  if (owner.kind === 'organisation') {
    const rows = await reader.select({ id: organisation.id, name: organisation.name }).from(organisation).where(eq(organisation.id, owner.id)).limit(1);
    return rows[0] ?? null;
  }
  const rows = await reader
    .select({ id: organisation.id, name: organisation.name })
    .from(project)
    .innerJoin(organisation, eq(organisation.id, project.organisationId))
    .where(eq(project.id, owner.id))
    .limit(1);
  return rows[0] ?? null;
}

// Project facts and work samples: the Director or Producer. Organisation facts, standard work
// samples and the format list: the people who look after the organisation (AC-4, AC-18, AC-31).
async function mayEdit(reader: Reader, owner: Owner, personId: string): Promise<boolean> {
  if (owner.kind === 'project') return can(reader, owner.id, personId, 'edit-facts');
  return (await stewardsOf(reader, owner.id)).includes(personId);
}

const factFits = (owner: Owner, fact: string): fact is Fact =>
  owner.kind === 'project' ? isProjectFact(fact) : isOrganisationFact(fact);

const factsArea = (owner: Owner): ActivityArea => (owner.kind === 'project' ? 'Facts' : 'Organisation facts');
const samplesFact = (owner: Owner): Fact => (owner.kind === 'project' ? 'work-samples' : 'standard-work-samples');
const sampleNoun = (owner: Owner) => (owner.kind === 'project' ? 'work sample' : 'standard work sample');

// Serialises saves of one fact, so version numbers are taken in turn and a save made meanwhile
// is always seen (AC-8).
async function lockFact(tx: Tx, owner: Owner, fact: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`fact:${owner.id}:${fact}`}))`);
}

const ownerIs = (owner: Owner, table: { projectId: AnyPgColumn; organisationId: AnyPgColumn }) =>
  owner.kind === 'project' ? eq(table.projectId, owner.id) : eq(table.organisationId, owner.id);

export async function currentVersion(reader: Reader, owner: Owner, fact: string) {
  const rows = await reader
    .select()
    .from(factVersion)
    .where(and(ownerIs(owner, factVersion), eq(factVersion.fact, fact)))
    .orderBy(desc(factVersion.number))
    .limit(1);
  return rows[0] ?? null;
}

async function writeVersion(
  tx: Tx,
  owner: Owner,
  fact: string,
  value: FactValue,
  personId: string,
  extra: { restoredFrom?: number | null; confirmationId?: string | null } = {},
): Promise<number> {
  const current = await currentVersion(tx, owner, fact);
  const number = (current?.number ?? 0) + 1;
  await tx.insert(factVersion).values({
    id: newId(),
    ...ownerColumns(owner),
    fact,
    number,
    value,
    savedBy: personId,
    savedAt: new Date(),
    restoredFrom: extra.restoredFrom ?? null,
    confirmationId: extra.confirmationId ?? null,
  });
  return number;
}

// --- The identifier filter (AC-19 to AC-26)

export type HeldFormat = { id: string; name: string; noun: string };
export type HeldMatch = { field: string; text: string; formats: HeldFormat[] };

async function formatsOn(reader: Reader, organisationId: string): Promise<(FormatSpec & { noun: string })[]> {
  const rows = await reader
    .select()
    .from(identifierFormat)
    .where(and(eq(identifierFormat.organisationId, organisationId), eq(identifierFormat.isOn, true), isNull(identifierFormat.removedAt)))
    .orderBy(asc(identifierFormat.position), asc(identifierFormat.addedAt));
  return rows.map((f) => {
    const spec: FormatSpec = { id: f.id, name: f.name, kind: f.kind as FormatSpec['kind'], pattern: f.pattern };
    return { ...spec, noun: formatNoun(spec) };
  });
}

// A keyed hash of the matching text, so a confirmation can be matched later without the text
// itself being stored (AC-23).
function textHash(normalised: string): string {
  const key = process.env.BETTER_AUTH_SECRET;
  if (!key) throw new Error('BETTER_AUTH_SECRET is not set');
  return createHmac('sha256', `identifier-confirmation:${key}`).update(normalised).digest('hex');
}

type Found = HeldMatch & { normalised: string };

function scan(texts: { field: string; text: string }[], formats: (FormatSpec & { noun: string })[]): Found[] {
  return texts.flatMap(({ field, text }) =>
    findIdentifiers(text, formats).map((m) => ({
      field,
      text: m.text,
      normalised: m.normalised,
      formats: m.formatIds.map((id) => {
        const f = formats.find((x) => x.id === id);
        return { id, name: f?.name ?? '', noun: f?.noun ?? '' };
      }),
    })),
  );
}

// Matches not covered by an earlier confirmation of that exact text, for those formats, in that
// fact (AC-24); and a confirmation that covered one, recorded on the version (AC-32).
async function uncovered(reader: Reader, owner: Owner, fact: string, found: Found[]): Promise<{ held: Found[]; coveredBy: string | null }> {
  const held: Found[] = [];
  let coveredBy: string | null = null;
  for (const match of found) {
    const rows = await reader
      .select({ id: identifierConfirmation.id, formatIds: identifierConfirmation.formatIds })
      .from(identifierConfirmation)
      .where(
        and(
          ownerIs(owner, identifierConfirmation),
          eq(identifierConfirmation.fact, fact),
          eq(identifierConfirmation.textHash, textHash(match.normalised)),
        ),
      );
    const cover = rows.find((r) => {
      const ids = z.array(z.string()).safeParse(r.formatIds);
      return ids.success && match.formats.every((f) => ids.data.includes(f.id));
    });
    if (cover) coveredBy ??= cover.id;
    else held.push(match);
  }
  return { held, coveredBy };
}

const publicMatch = ({ field, text, formats }: Found): HeldMatch => ({ field, text, formats });
const nounsOf = (matches: { formats: HeldFormat[] }[]) => [...new Set(matches.flatMap((m) => m.formats.map((f) => f.noun)))];

const ANSWER_EMPTY = 'Say in a few words what the number is.';
const ANSWER_LONG = 'Keep your answer to 100 characters or fewer.';

function checkAnswer(answer: string, formats: (FormatSpec & { noun: string })[]): { answer: string } | { error: string } {
  const trimmed = answer.trim();
  if (!trimmed) return { error: ANSWER_EMPTY };
  if (trimmed.length > 100) return { error: ANSWER_LONG };
  const found = scan([{ field: 'answer', text: trimmed }], formats);
  if (found.length > 0) {
    return { error: `Your answer also looks like ${formatList(nounsOf(found))}. Say what it is in words, without the number.` };
  }
  return { answer: trimmed };
}

// --- Facts (AC-2 to AC-8, AC-14, AC-16, AC-20 to AC-24)

export type FactConflict = { version: number; by: string; at: Date; values: FactValue };

type FactRefusal = Refusal & { held?: HeldMatch[]; conflict?: FactConflict };
type FactResult<T> = { ok: true; value: T } | FactRefusal;

async function conflictWith(tx: Tx, owner: Owner, fact: string, baseVersion: number): Promise<FactConflict | null> {
  const current = await currentVersion(tx, owner, fact);
  if ((current?.number ?? 0) === baseVersion || !current) return null;
  const who = (await tx.select().from(person).where(eq(person.id, current.savedBy)).limit(1))[0];
  return { version: current.number, by: who ? displayName(who) : '', at: current.savedAt, values: current.value as FactValue };
}

export async function saveFact(
  principal: Principal,
  owner: Owner,
  fact: string,
  input: { values: Record<string, string>; baseVersion: number },
): Promise<FactResult<{ version: number }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !factFits(owner, fact) || isWorkSamples(fact)) return notFound();
  return db().transaction(async (tx) => {
    const org = await organisationOf(tx, owner);
    if (!org) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    const parsed = parseFactInput(fact, input.values);
    if (!parsed.ok) return refuse(400, { fields: parsed.fields });
    await lockFact(tx, owner, fact);
    const conflict = await conflictWith(tx, owner, fact, input.baseVersion);
    if (conflict) return { ...refuse(409, { message: 'Someone else saved this fact.' }), conflict };
    const { held, coveredBy } = await uncovered(tx, owner, fact, scan(factTexts(fact, parsed.value), await formatsOn(tx, org.id)));
    if (held.length > 0) return { ...refuse(400, { message: 'Not saved.' }), held: held.map(publicMatch) };
    const version = await writeVersion(tx, owner, fact, parsed.value, principal.personId, { confirmationId: coveredBy });
    await log(tx, owner, principal.personId, factsArea(owner), `Saved the ${factNoun(fact)} (version ${version})`);
    return { ok: true as const, value: { version } };
  });
}

// Restoring writes a new version equal to the earlier one; no version is changed or removed, and
// the restored text is checked like any save (AC-7).
export async function restoreFact(
  principal: Principal,
  owner: Owner,
  fact: string,
  version: number,
): Promise<FactResult<{ version: number; restoredFrom: number }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !factFits(owner, fact) || !Number.isInteger(version)) return notFound();
  return db().transaction(async (tx) => {
    const org = await organisationOf(tx, owner);
    if (!org) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    await lockFact(tx, owner, fact);
    const earlier = (
      await tx
        .select()
        .from(factVersion)
        .where(and(ownerIs(owner, factVersion), eq(factVersion.fact, fact), eq(factVersion.number, version)))
        .limit(1)
    )[0];
    if (!earlier) return notFound();
    const value = earlier.value as FactValue;
    const { held, coveredBy } = await uncovered(tx, owner, fact, scan(factTexts(fact, value), await formatsOn(tx, org.id)));
    if (held.length > 0) return { ...refuse(400, { message: 'Not saved.' }), held: held.map(publicMatch) };
    const saved = await writeVersion(tx, owner, fact, value, principal.personId, { restoredFrom: version, confirmationId: coveredBy });
    await log(tx, owner, principal.personId, factsArea(owner), `Restored the ${factNoun(fact)} to version ${version}, saved as version ${saved}`);
    return { ok: true as const, value: { version: saved, restoredFrom: version } };
  });
}

// Confirm and save: the version, the confirmations and the entry in one transaction (AC-23).
export async function confirmFact(
  principal: Principal,
  owner: Owner,
  fact: string,
  input: { values: Record<string, string>; baseVersion: number; answer: string; restoreFrom?: number },
): Promise<FactResult<{ version: number; confirmed: HeldMatch[] }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !factFits(owner, fact) || isWorkSamples(fact)) return notFound();
  return db().transaction(async (tx) => {
    const org = await organisationOf(tx, owner);
    if (!org) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    const parsed = parseFactInput(fact, input.values);
    if (!parsed.ok) return refuse(400, { fields: parsed.fields });
    const formats = await formatsOn(tx, org.id);
    const answer = checkAnswer(input.answer, formats);
    if ('error' in answer) return refuse(400, { fields: { answer: answer.error } });
    await lockFact(tx, owner, fact);
    const conflict = await conflictWith(tx, owner, fact, input.baseVersion);
    if (conflict) return { ...refuse(409, { message: 'Someone else saved this fact.' }), conflict };
    const { held, coveredBy } = await uncovered(tx, owner, fact, scan(factTexts(fact, parsed.value), formats));
    let restoredFrom: number | null = null;
    if (input.restoreFrom) {
      const earlier = (
        await tx
          .select({ value: factVersion.value })
          .from(factVersion)
          .where(and(ownerIs(owner, factVersion), eq(factVersion.fact, fact), eq(factVersion.number, input.restoreFrom)))
          .limit(1)
      )[0];
      if (earlier && JSON.stringify(earlier.value) === JSON.stringify(parsed.value)) restoredFrom = input.restoreFrom;
    }
    let confirmationId = coveredBy;
    for (const match of held) {
      const id = newId();
      await tx.insert(identifierConfirmation).values({
        id,
        ...ownerColumns(owner),
        fact,
        formatIds: match.formats.map((f) => f.id),
        textHash: textHash(match.normalised),
        answer: answer.answer,
        personId: principal.personId,
        at: new Date(),
      });
      confirmationId ??= id;
    }
    const version = await writeVersion(tx, owner, fact, parsed.value, principal.personId, { restoredFrom, confirmationId });
    const what =
      held.length > 0
        ? `Saved the ${factNoun(fact)} (version ${version}) after confirming that text in it is not ${formatList(nounsOf(held))} ("${answer.answer}")`
        : `Saved the ${factNoun(fact)} (version ${version})`;
    await log(tx, owner, principal.personId, factsArea(owner), what);
    return { ok: true as const, value: { version, confirmed: held.map(publicMatch) } };
  });
}

// --- Work samples (AC-9 to AC-12, AC-17, AC-25, AC-26)

const UPLOAD_STOPPED = (file: string) => `The upload of ${file} stopped before it finished. Choose the file again to try again.`;
export const HELD_HOURS = 24;

export type UploadMatch = { page: number | null; formatIds: string[] };
const UploadMatches = z.array(z.object({ page: z.number().nullable(), formatIds: z.array(z.string()) }));

async function findUpload(reader: Reader, owner: Owner, uploadId: string, lock = false) {
  if (!isId(uploadId)) return null;
  const query = reader.select().from(upload).where(and(eq(upload.id, uploadId), ownerIs(owner, upload)));
  const rows = lock ? await query.for('update') : await query;
  return rows[0] ?? null;
}

export async function requestUpload(
  principal: Principal,
  owner: Owner,
  input: { requestId: string; title: string; fileName: string; mediaType: string; size: number },
): Promise<Result<{ uploadId: string; uploadUrl: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !isId(input.requestId)) return notFound();
  const title = input.title.trim();
  return db().transaction(async (tx) => {
    if (!(await organisationOf(tx, owner))) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    const fields: Record<string, string> = {};
    if (!title) fields.title = 'Enter a title for the work sample.';
    if (!input.fileName.trim()) fields.file = 'Choose a file to add.';
    else if (!acceptedSampleType(input.mediaType, input.fileName)) fields.file = SAMPLE_TYPE_ERROR;
    else if (input.size > MAX_SAMPLE_BYTES) fields.file = SAMPLE_SIZE_ERROR;
    if (Object.keys(fields).length > 0) return refuse(400, { fields });
    const existing = (await tx.select().from(upload).where(eq(upload.requestId, input.requestId)).limit(1))[0];
    if (existing) {
      if (existing.createdBy !== principal.personId) return refuse(409, { message: 'This request id is in use.' });
      return { ok: true as const, value: { uploadId: existing.id, uploadUrl: `/api/v1/storage/${await signUpload(existing.storageKey, existing.declaredSize)}` } };
    }
    const id = newId();
    const storageKey = newStorageKey();
    await tx.insert(upload).values({
      id,
      ...ownerColumns(owner),
      requestId: input.requestId,
      title,
      fileName: input.fileName.trim(),
      mediaType: input.mediaType,
      declaredSize: input.size,
      storageKey,
      state: 'pending',
      createdBy: principal.personId,
    });
    return { ok: true as const, value: { uploadId: id, uploadUrl: `/api/v1/storage/${await signUpload(storageKey, input.size)}` } };
  });
}

type Inspection =
  | { ok: false; field: string; message: string; discard: boolean }
  | { ok: true; size: number; sha256: string; found: { page: number | null; matches: Found[] }[] };

// Reads the stored size and first bytes (never what the browser declared), and the text of a PDF
// or Word document, before the transaction that records the outcome.
async function inspect(item: typeof upload.$inferSelect, formats: (FormatSpec & { noun: string })[]): Promise<Inspection> {
  const size = await storedSize(item.storageKey);
  if (size === null) return { ok: false, field: 'file', message: UPLOAD_STOPPED(item.fileName), discard: false };
  if (size > MAX_SAMPLE_BYTES || size > item.declaredSize) return { ok: false, field: 'file', message: SAMPLE_SIZE_ERROR, discard: true };
  const kind = kindOf(await readStart(item.storageKey, 16), item.mediaType);
  if (!kind) return { ok: false, field: 'file', message: SAMPLE_TYPE_ERROR, discard: true };
  const found: { page: number | null; matches: Found[] }[] = [];
  if (kind === 'pdf') {
    let pages: string[] = [];
    try {
      pages = await pdfPages(await readAll(item.storageKey));
    } catch {
      // A PDF whose text cannot be read joins the record unchecked, as a scan does.
      pages = [];
    }
    pages.forEach((text, i) => {
      const matches = scan([{ field: 'file', text }], formats);
      if (matches.length) found.push({ page: i + 1, matches });
    });
  } else if (kind === 'docx') {
    const text = docxText(await readAll(item.storageKey));
    if (text === null) return { ok: false, field: 'file', message: SAMPLE_TYPE_ERROR, discard: true };
    const matches = scan([{ field: 'file', text }], formats);
    if (matches.length) found.push({ page: null, matches });
  }
  return { ok: true, size, sha256: await sha256Of(item.storageKey), found };
}

async function joinSample(tx: Tx, owner: Owner, item: typeof upload.$inferSelect, personId: string, size: number, sha256: string) {
  const fileId = newId();
  await tx.insert(storedFile).values({
    id: fileId,
    ...ownerColumns(owner),
    storageKey: item.storageKey,
    fileName: item.fileName,
    mediaType: item.mediaType,
    size,
    sha256,
    addedBy: personId,
    addedAt: new Date(),
  });
  const fact = samplesFact(owner);
  await lockFact(tx, owner, fact);
  const current = await currentVersion(tx, owner, fact);
  const samples = current ? WorkSamplesValue.parse(current.value).samples : [];
  const version = await writeVersion(tx, owner, fact, { samples: [...samples, { fileId, title: item.title }] }, personId);
  await tx.update(upload).set({ state: 'added', fileId, heldUntil: null }).where(eq(upload.id, item.id));
  return { fileId, version };
}

export type Registered =
  | { state: 'added'; version: number; fileId: string }
  | { state: 'held'; heldUntil: Date; matches: UploadMatch[]; formats: HeldFormat[] };

async function heldView(reader: Reader, item: typeof upload.$inferSelect, organisationId: string): Promise<Registered> {
  const matches = UploadMatches.parse(item.matches ?? []);
  const ids = [...new Set(matches.flatMap((m) => m.formatIds))];
  const rows = ids.length ? await reader.select().from(identifierFormat).where(and(eq(identifierFormat.organisationId, organisationId), inArray(identifierFormat.id, ids))) : [];
  const formats = ids.flatMap((id) => {
    const f = rows.find((r) => r.id === id);
    return f ? [{ id, name: f.name, noun: formatNoun({ kind: f.kind as FormatSpec['kind'], name: f.name }) }] : [];
  });
  return { state: 'held', heldUntil: item.heldUntil ?? new Date(), matches, formats };
}

// Registering is idempotent: a repeat for an upload already added or held adds nothing (AC-10).
export async function registerUpload(principal: Principal, owner: Owner, uploadId: string): Promise<Result<Registered>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !isId(uploadId)) return notFound();
  const org = await organisationOf(db(), owner);
  if (!org) return notFound();
  if (!(await mayEdit(db(), owner, principal.personId))) return forbidden();
  const first = await findUpload(db(), owner, uploadId);
  if (!first || first.state === 'deleted') return notFound();
  const inspection = first.state === 'pending' ? await inspect(first, await formatsOn(db(), org.id)) : null;
  return db().transaction(async (tx) => {
    const item = await findUpload(tx, owner, uploadId, true);
    if (!item || item.state === 'deleted') return notFound();
    if (item.state === 'added' && item.fileId) {
      const current = await currentVersion(tx, owner, samplesFact(owner));
      return { ok: true as const, value: { state: 'added' as const, version: current?.number ?? 0, fileId: item.fileId } };
    }
    if (item.state === 'held') return { ok: true as const, value: await heldView(tx, item, org.id) };
    if (!inspection) return notFound();
    if (!inspection.ok) {
      if (inspection.discard) {
        await removeStored(item.storageKey);
        await tx.update(upload).set({ state: 'deleted' }).where(eq(upload.id, item.id));
      }
      return refuse(400, { fields: { [inspection.field]: inspection.message } });
    }
    if (inspection.found.length > 0) {
      const matches: UploadMatch[] = inspection.found.map((f) => ({
        page: f.page,
        formatIds: [...new Set(f.matches.flatMap((m) => m.formats.map((x) => x.id)))],
      }));
      const heldUntil = new Date(Date.now() + HELD_HOURS * 3600 * 1000);
      await tx.update(upload).set({ state: 'held', heldUntil, matches }).where(eq(upload.id, item.id));
      return { ok: true as const, value: await heldView(tx, { ...item, heldUntil, matches }, org.id) };
    }
    const joined = await joinSample(tx, owner, item, principal.personId, inspection.size, inspection.sha256);
    await log(tx, owner, principal.personId, factsArea(owner), `Added the ${sampleNoun(owner)} "${item.title}" (version ${joined.version})`);
    return { ok: true as const, value: { state: 'added' as const, ...joined } };
  });
}

// A held upload, confirmed before its time, joins the record with its confirmation (AC-25).
export async function confirmUpload(
  principal: Principal,
  owner: Owner,
  uploadId: string,
  input: { answer: string },
): Promise<Result<{ version: number; fileId: string; title: string; fileName: string; formats: HeldFormat[] }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !isId(uploadId)) return notFound();
  const org = await organisationOf(db(), owner);
  if (!org) return notFound();
  if (!(await mayEdit(db(), owner, principal.personId))) return forbidden();
  const first = await findUpload(db(), owner, uploadId);
  if (!first || first.state !== 'held' || !first.heldUntil || first.heldUntil <= new Date()) return notFound();
  const formats = await formatsOn(db(), org.id);
  const answer = checkAnswer(input.answer, formats);
  if ('error' in answer) return refuse(400, { fields: { answer: answer.error } });
  const inspection = await inspect(first, formats);
  if (!inspection.ok) return refuse(400, { fields: { [inspection.field]: inspection.message } });
  return db().transaction(async (tx) => {
    const item = await findUpload(tx, owner, uploadId, true);
    if (!item || item.state !== 'held' || !item.heldUntil || item.heldUntil <= new Date()) return notFound();
    const held = await heldView(tx, item, org.id);
    if (held.state !== 'held') return notFound();
    const normalised = inspection.found.flatMap((f) => f.matches.map((m) => m.normalised)).join(' ');
    await tx.insert(identifierConfirmation).values({
      id: newId(),
      ...ownerColumns(owner),
      uploadId: item.id,
      formatIds: held.formats.map((f) => f.id),
      textHash: textHash(normalised),
      answer: answer.answer,
      personId: principal.personId,
      at: new Date(),
    });
    const joined = await joinSample(tx, owner, item, principal.personId, inspection.size, inspection.sha256);
    await log(
      tx,
      owner,
      principal.personId,
      factsArea(owner),
      `Added the ${sampleNoun(owner)} "${item.title}" (version ${joined.version}) after confirming that ${item.fileName} does not have ${formatList(held.formats.map((f) => f.noun))} ("${answer.answer}")`,
    );
    return { ok: true as const, value: { ...joined, title: item.title, fileName: item.fileName, formats: held.formats } };
  });
}

async function deleteHeld(tx: Tx, owner: Owner, item: typeof upload.$inferSelect, organisationId: string, actor: string | null) {
  const held = await heldView(tx, item, organisationId);
  const nouns = held.state === 'held' ? formatList(held.formats.map((f) => f.noun)) : 'an identifier';
  await removeStored(item.storageKey);
  await tx.update(upload).set({ state: 'deleted' }).where(eq(upload.id, item.id));
  const what = actor
    ? `Deleted ${item.fileName}, held because its text looked like it had ${nouns}`
    : `Deleted ${item.fileName}, held because its text looked like it had ${nouns} and not confirmed within ${HELD_HOURS} hours`;
  await log(tx, owner, actor, factsArea(owner), what);
}

export async function deleteUpload(principal: Principal, owner: Owner, uploadId: string): Promise<Result<{ fileName: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !isId(uploadId)) return notFound();
  return db().transaction(async (tx) => {
    const org = await organisationOf(tx, owner);
    if (!org) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    const item = await findUpload(tx, owner, uploadId, true);
    if (!item || item.state !== 'held') return notFound();
    await deleteHeld(tx, owner, item, org.id, principal.personId);
    return { ok: true as const, value: { fileName: item.fileName } };
  });
}

// The scheduled job: a system command with an XR Studio principal (AC-26, AC-40).
export async function deleteExpiredHeldUploads(now = new Date()): Promise<{ deleted: number }> {
  const due = await db()
    .select({ id: upload.id })
    .from(upload)
    .where(and(eq(upload.state, 'held'), lt(upload.heldUntil, now)));
  let deleted = 0;
  for (const { id } of due) {
    deleted += await db().transaction(async (tx) => {
      const item = (await tx.select().from(upload).where(eq(upload.id, id)).for('update'))[0];
      if (!item || item.state !== 'held' || !item.heldUntil || item.heldUntil >= now) return 0;
      const owner: Owner = item.projectId ? { kind: 'project', id: item.projectId } : { kind: 'organisation', id: item.organisationId ?? '' };
      const org = await organisationOf(tx, owner);
      if (!org) return 0;
      await deleteHeld(tx, owner, item, org.id, null);
      return 1;
    });
  }
  return { deleted };
}

// Removing writes a new Work samples version without the sample; the file is kept (AC-12).
export async function removeWorkSample(principal: Principal, owner: Owner, fileId: string): Promise<Result<{ version: number; title: string }>> {
  if (isAgent(principal)) return forbidden();
  if (!isId(owner.id) || !isId(fileId)) return notFound();
  return db().transaction(async (tx) => {
    if (!(await organisationOf(tx, owner))) return notFound();
    if (!(await mayEdit(tx, owner, principal.personId))) return forbidden();
    const fact = samplesFact(owner);
    await lockFact(tx, owner, fact);
    const current = await currentVersion(tx, owner, fact);
    const samples = current ? WorkSamplesValue.parse(current.value).samples : [];
    const sample = samples.find((s) => s.fileId === fileId);
    if (!sample) return notFound();
    const version = await writeVersion(tx, owner, fact, { samples: samples.filter((s) => s.fileId !== fileId) }, principal.personId);
    await log(tx, owner, principal.personId, factsArea(owner), `Removed the ${sampleNoun(owner)} "${sample.title}" (version ${version})`);
    return { ok: true as const, value: { version, title: sample.title } };
  });
}

// --- The format list (AC-27 to AC-30)

async function stewardOf(tx: Tx, organisationId: string, personId: string): Promise<Refusal | null> {
  if (!isId(organisationId)) return notFound();
  const org = await tx.select({ id: organisation.id }).from(organisation).where(eq(organisation.id, organisationId)).limit(1);
  if (!org[0]) return notFound();
  if (!(await stewardsOf(tx, organisationId)).includes(personId)) return forbidden();
  return null;
}

export async function addFormat(principal: Principal, organisationId: string, input: { name: string; pattern: string }): Promise<Result<{ id: string; name: string }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    const refused = await stewardOf(tx, organisationId, principal.personId);
    if (refused) return refused;
    const name = input.name.trim();
    const pattern = input.pattern.trim();
    const fields: Record<string, string> = {};
    if (!name) fields.name = 'Enter a name for the format.';
    const problem = checkPattern(pattern);
    if (problem === 'empty') fields.pattern = 'Enter a pattern, like ###-AA-#####.';
    if (problem === 'too-short') {
      fields.pattern = 'Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices.';
    }
    if (Object.keys(fields).length > 0) return refuse(400, { fields });
    const id = newId();
    await tx.insert(identifierFormat).values({
      id,
      organisationId,
      name,
      kind: 'pattern',
      pattern,
      isOn: true,
      starter: false,
      position: 100,
      addedBy: principal.personId,
      addedAt: new Date(),
    });
    await log(tx, { kind: 'organisation', id: organisationId }, principal.personId, 'Identifier formats', `Added the identifier format "${name}"`);
    return { ok: true as const, value: { id, name } };
  });
}

async function findFormat(tx: Tx, organisationId: string, formatId: string) {
  if (!isId(formatId)) return null;
  const rows = await tx
    .select()
    .from(identifierFormat)
    .where(and(eq(identifierFormat.id, formatId), eq(identifierFormat.organisationId, organisationId), isNull(identifierFormat.removedAt)))
    .for('update');
  return rows[0] ?? null;
}

export async function setFormat(principal: Principal, organisationId: string, formatId: string, input: { on: boolean }): Promise<Result<{ name: string; on: boolean }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    const refused = await stewardOf(tx, organisationId, principal.personId);
    if (refused) return refused;
    const format = await findFormat(tx, organisationId, formatId);
    if (!format) return notFound();
    if (format.isOn !== input.on) {
      await tx.update(identifierFormat).set({ isOn: input.on }).where(eq(identifierFormat.id, formatId));
      await log(tx, { kind: 'organisation', id: organisationId }, principal.personId, 'Identifier formats', `${input.on ? 'Turned on' : 'Turned off'} the identifier format "${format.name}"`);
    }
    return { ok: true as const, value: { name: format.name, on: input.on } };
  });
}

export async function removeFormat(principal: Principal, organisationId: string, formatId: string): Promise<Result<{ name: string }>> {
  if (isAgent(principal)) return forbidden();
  return db().transaction(async (tx) => {
    const refused = await stewardOf(tx, organisationId, principal.personId);
    if (refused) return refused;
    const format = await findFormat(tx, organisationId, formatId);
    if (!format) return notFound();
    if (format.starter) return refuse(409, { message: 'Starter formats can be turned off but not removed.' });
    await tx.update(identifierFormat).set({ removedAt: new Date() }).where(eq(identifierFormat.id, formatId));
    await log(tx, { kind: 'organisation', id: organisationId }, principal.personId, 'Identifier formats', `Removed the identifier format "${format.name}"`);
    return { ok: true as const, value: { name: format.name } };
  });
}

// What a save of this value would hold back, without writing: the edit page uses it to show a
// restore that was stopped (AC-7). It only reads.
export async function heldIn(owner: Owner, fact: Fact, value: FactValue): Promise<HeldMatch[]> {
  const org = await organisationOf(db(), owner);
  if (!org) return [];
  const { held } = await uncovered(db(), owner, fact, scan(factTexts(fact, value), await formatsOn(db(), org.id)));
  return held.map(publicMatch);
}
