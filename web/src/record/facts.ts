import 'server-only';
import {
  FUNDER_FACTS,
  ORGANISATION_FACTS,
  PROJECT_FACTS,
  STARTER_FORMATS,
  WorkSamplesValue,
  isFunderFact,
  isOrganisationFact,
  isProjectFact,
  patternExample,
  permissionsFor,
  type Fact,
  type FactValue,
} from '@xr/contracts';
import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  activityEntry,
  factVersion,
  identifierFormat,
  organisation,
  organisationSteward,
  person,
  project,
  projectRole,
  storedFile,
  upload,
} from '../db/schema';
import { DASHBOARD_ROLES, rolesOf, type Owner } from './commands';
import { isId } from './ids';
import { displayName } from './principal';

// Reads for slice 2 (layer1-facts-identifiers-activity). Everything a person may not see is left
// out here, on the server, so a hidden value never reaches a page or an API answer.

export type Access = {
  owner: Owner;
  ownerName: string;
  organisationId: string;
  organisationName: string;
  canEdit: boolean;
  canSee: (fact: Fact) => boolean;
  readsActivity: boolean;
  steward: boolean;
};

async function stewardOf(organisationId: string, personId: string): Promise<boolean> {
  const rows = await db()
    .select({ personId: organisationSteward.personId })
    .from(organisationSteward)
    .where(and(eq(organisationSteward.organisationId, organisationId), eq(organisationSteward.personId, personId)))
    .limit(1);
  return rows.length > 0;
}

// The roles a person holds on any of an organisation's projects.
async function rolesInOrganisation(organisationId: string, personId: string) {
  const rows = await db()
    .select({ role: projectRole.role })
    .from(projectRole)
    .innerJoin(project, eq(project.id, projectRole.projectId))
    .where(and(eq(project.organisationId, organisationId), eq(projectRole.personId, personId)));
  return rows.map((r) => r.role);
}

// Who sees an organisation's facts (AC-18): stewards; anyone with a dashboard role on one of its
// projects sees the general facts; the Director and Producer on one of them see the profiles.
export async function organisationAccess(personId: string, organisationId: string) {
  if (!isId(organisationId)) return null;
  const org = (await db().select().from(organisation).where(eq(organisation.id, organisationId)).limit(1))[0];
  if (!org) return null;
  const steward = await stewardOf(organisationId, personId);
  const roles = await rolesInOrganisation(organisationId, personId);
  const general = steward || roles.some((r) => (DASHBOARD_ROLES as string[]).includes(r));
  const profiles = steward || roles.includes('director') || roles.includes('producer');
  if (!general) return null;
  return { organisation: org, steward, general, profiles };
}

export async function accessFor(personId: string, owner: Owner): Promise<Access | null> {
  if (!isId(owner.id)) return null;
  if (owner.kind === 'project') {
    const rows = await db()
      .select({ name: project.name, organisationId: organisation.id, organisationName: organisation.name })
      .from(project)
      .innerJoin(organisation, eq(organisation.id, project.organisationId))
      .where(eq(project.id, owner.id))
      .limit(1);
    const found = rows[0];
    if (!found) return null;
    const can = permissionsFor(await rolesOf(db(), owner.id, personId));
    if (!can.has('see-facts')) return null;
    return {
      owner,
      ownerName: found.name,
      organisationId: found.organisationId,
      organisationName: found.organisationName,
      canEdit: can.has('edit-facts'),
      canSee: (fact) => isProjectFact(fact) && (fact !== 'budget' || can.has('see-budget')),
      readsActivity: can.has('read-activity'),
      steward: await stewardOf(found.organisationId, personId),
    };
  }
  const access = await organisationAccess(personId, owner.id);
  if (!access) return null;
  return {
    owner,
    ownerName: access.organisation.name,
    organisationId: owner.id,
    organisationName: access.organisation.name,
    canEdit: access.steward,
    canSee: (fact) => isOrganisationFact(fact) && (!isFunderFact(fact) || access.profiles),
    readsActivity: access.steward,
    steward: access.steward,
  };
}

const ownerWhere = (owner: Owner) =>
  owner.kind === 'project' ? eq(factVersion.projectId, owner.id) : eq(factVersion.organisationId, owner.id);

export type Version = { number: number; value: FactValue; by: string; at: Date; restoredFrom: number | null };

async function versionRows(owner: Owner, facts: string[]): Promise<(Version & { fact: string })[]> {
  if (facts.length === 0) return [];
  const rows = await db()
    .select({ v: factVersion, saver: person })
    .from(factVersion)
    .innerJoin(person, eq(person.id, factVersion.savedBy))
    .where(and(ownerWhere(owner), inArray(factVersion.fact, facts)))
    .orderBy(desc(factVersion.number));
  return rows.map(({ v, saver }) => ({
    fact: v.fact,
    number: v.number,
    value: v.value as FactValue,
    by: displayName(saver),
    at: v.savedAt,
    restoredFrom: v.restoredFrom,
  }));
}

export type FactEntry = { fact: Fact; visible: boolean; current: Version | null };

// The current version of each fact, read on each request (AC-5, AC-15).
export async function currentFacts(owner: Owner, facts: readonly Fact[], canSee: (fact: Fact) => boolean): Promise<FactEntry[]> {
  const visible = facts.filter(canSee);
  const rows = await versionRows(owner, visible);
  return facts.map((fact) => ({
    fact,
    visible: canSee(fact),
    current: canSee(fact) ? (rows.find((r) => r.fact === fact) ?? null) : null,
  }));
}

export const projectFactList = PROJECT_FACTS;
export const organisationFactList: Fact[] = [...ORGANISATION_FACTS, ...FUNDER_FACTS, 'standard-work-samples'];

export async function versionsOf(owner: Owner, fact: Fact): Promise<Version[]> {
  return versionRows(owner, [fact]);
}

export async function factValue(owner: Owner, fact: Fact): Promise<Version | null> {
  return (await versionRows(owner, [fact]))[0] ?? null;
}

export type Sample = { fileId: string; title: string; fileName: string; size: number; by: string; at: Date };

// The samples in a Work samples value, with who added each file and when.
export async function samplesIn(value: FactValue | null | undefined): Promise<Sample[]> {
  const parsed = WorkSamplesValue.safeParse(value);
  if (!parsed.success || parsed.data.samples.length === 0) return [];
  const ids = parsed.data.samples.map((s) => s.fileId);
  const files = await db()
    .select({ file: storedFile, adder: person })
    .from(storedFile)
    .innerJoin(person, eq(person.id, storedFile.addedBy))
    .where(inArray(storedFile.id, ids));
  return parsed.data.samples.map((s) => {
    const f = files.find((x) => x.file.id === s.fileId);
    return {
      fileId: s.fileId,
      title: s.title,
      fileName: f?.file.fileName ?? '',
      size: f?.file.size ?? 0,
      by: f ? displayName(f.adder) : '',
      at: f?.file.addedAt ?? new Date(0),
    };
  });
}

export type HeldUpload = { id: string; title: string; fileName: string; heldUntil: Date; matches: { page: number | null; formatIds: string[] }[]; nouns: string[] };

// Held uploads still within their time, newest first (AC-26).
export async function heldUploads(owner: Owner): Promise<HeldUpload[]> {
  const where = owner.kind === 'project' ? eq(upload.projectId, owner.id) : eq(upload.organisationId, owner.id);
  const rows = await db()
    .select()
    .from(upload)
    .where(and(where, eq(upload.state, 'held'), sql`${upload.heldUntil} > now()`))
    .orderBy(desc(upload.createdAt));
  const formats = await formatRows(owner.kind === 'organisation' ? owner.id : await organisationIdOf(owner.id));
  return rows.map((u) => {
    const matches = (Array.isArray(u.matches) ? u.matches : []) as HeldUpload['matches'];
    const ids = [...new Set(matches.flatMap((m) => m.formatIds))];
    return {
      id: u.id,
      title: u.title,
      fileName: u.fileName,
      heldUntil: u.heldUntil ?? new Date(),
      matches,
      nouns: ids.map((id) => formats.find((f) => f.id === id)?.noun ?? 'identifier'),
    };
  });
}

async function organisationIdOf(projectId: string): Promise<string> {
  const rows = await db().select({ id: project.organisationId }).from(project).where(eq(project.id, projectId)).limit(1);
  return rows[0]?.id ?? '';
}

export type FormatRow = {
  id: string;
  name: string;
  noun: string;
  matches: string;
  on: boolean;
  starter: boolean;
  source: { by: string; at: Date } | null;
};

export async function formatRows(organisationId: string): Promise<FormatRow[]> {
  if (!isId(organisationId)) return [];
  const rows = await db()
    .select({ f: identifierFormat, adder: person })
    .from(identifierFormat)
    .leftJoin(person, eq(person.id, identifierFormat.addedBy))
    .where(and(eq(identifierFormat.organisationId, organisationId), isNull(identifierFormat.removedAt)))
    .orderBy(asc(identifierFormat.position), asc(identifierFormat.addedAt));
  return rows.map(({ f, adder }) => {
    const starter = STARTER_FORMATS.find((s) => s.kind === f.kind);
    return {
      id: f.id,
      name: f.name,
      noun: starter?.noun ?? f.name,
      matches: starter?.matches ?? `the pattern ${f.pattern ?? ''}, like ${patternExample(f.pattern ?? '')}`,
      on: f.isOn,
      starter: f.starter,
      source: f.starter || !adder ? null : { by: displayName(adder), at: f.addedAt },
    };
  });
}

// --- Activity (AC-34 to AC-37)

export type ActivityFilter = { who?: string; area?: string; from?: Date; to?: Date; page: number };
export type ActivityRow = { id: string; at: Date; who: string; what: string; area: string };

const activityOwner = (owner: Owner) =>
  owner.kind === 'project' ? eq(activityEntry.projectId, owner.id) : eq(activityEntry.organisationId, owner.id);

export async function activityFor(owner: Owner, filter: ActivityFilter, pageSize: number) {
  const conditions = [activityOwner(owner)];
  if (filter.who === 'agents') conditions.push(eq(activityEntry.actorKind, 'agent'));
  else if (filter.who && isId(filter.who)) conditions.push(eq(activityEntry.actorPersonId, filter.who));
  if (filter.area) conditions.push(eq(activityEntry.area, filter.area));
  if (filter.from) conditions.push(sql`${activityEntry.at} >= ${filter.from.toISOString()}`);
  if (filter.to) conditions.push(sql`${activityEntry.at} < ${filter.to.toISOString()}`);
  const where = and(...conditions);
  const total = Number((await db().select({ n: sql<number>`count(*)` }).from(activityEntry).where(where))[0]?.n ?? 0);
  const rows = await db()
    .select({ e: activityEntry, actor: person })
    .from(activityEntry)
    .leftJoin(person, eq(person.id, activityEntry.actorPersonId))
    .where(where)
    .orderBy(desc(activityEntry.at), desc(activityEntry.id))
    .limit(pageSize)
    .offset(filter.page * pageSize);
  const entries: ActivityRow[] = rows.map(({ e, actor }) => ({
    id: e.id,
    at: e.at,
    who: actor ? displayName(actor) : 'XR Studio',
    what: e.what,
    area: e.area,
  }));
  return { total, entries };
}

// Everyone with an entry on the project or organisation, with "(removed)" for people no longer on
// the project (AC-35).
export async function activityPeople(owner: Owner): Promise<{ id: string; label: string }[]> {
  const rows = await db()
    .selectDistinct({ actor: person })
    .from(activityEntry)
    .innerJoin(person, eq(person.id, activityEntry.actorPersonId))
    .where(activityOwner(owner));
  let onProject = new Set<string>();
  if (owner.kind === 'project') {
    const roles = await db().select({ personId: projectRole.personId }).from(projectRole).where(eq(projectRole.projectId, owner.id));
    onProject = new Set(roles.map((r) => r.personId));
  }
  return rows
    .map(({ actor }) => ({
      id: actor.id,
      label: owner.kind === 'project' && !onProject.has(actor.id) ? `${displayName(actor)} (removed)` : displayName(actor),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
