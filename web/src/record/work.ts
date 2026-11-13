import 'server-only';
import { gatedHandoffs, handoffById, permissionsFor, RoleIdSchema, usesDashboard, workState, type ItemState, type RoleId, type WorkState } from '@xr/contracts';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { activityEntry, person, project, projectRole, reviewDecision, reviewItem, storedFile, work, workFeedback } from '../db/schema';
import { assignmentsOf } from './commands';
import { isId } from './ids';
import { displayName } from './principal';
import { decidersWith, deciderIds, type Deciders, type Named } from './review';

// Reads for slice 4 (layer1-versions-board-first-view). States are worked out here on every read
// from the latest versions, the decision ledger, the waiting items that name a stage and the
// current assignments; nothing on the board or What needs you is stored (AC-4, AC-40).

type Reader = ReturnType<typeof db> | Parameters<Parameters<ReturnType<typeof db>['transaction']>[0]>[0];

export type Decision = { decision: Exclude<ItemState, 'waiting'>; by: Named; at: Date; feedback: string };

export type Version = {
  itemId: string;
  version: number;
  state: ItemState;
  sentBy: Named;
  sentAt: Date;
  whatChanged: string;
  restoredFrom: number | null;
  waitingHandoff: string | null;
  handedTo: Named | null;
  file: { id: string; name: string; mediaType: string } | null;
  decision: Decision | null;
};

export type Blocker = { itemId: string; workId: string; title: string; handoff: string; deciders: Deciders | null; handedTo: Named | null };

export type WorkView = {
  id: string;
  projectId: string;
  title: string;
  handoff: string;
  state: WorkState;
  owner: Named & { gone: boolean };
  addedBy: Named | null;
  addedAt: Date;
  assignedAt: Date;
  deciders: Deciders | null;
  latest: Version | null;
  versions: Version[];
  blockedBy: Blocker | null;
};

const asNamed = (map: Map<string, string>, id: string): Named => ({ id, display: map.get(id) ?? '' });

// Every piece of work on a project, with its versions (oldest first) and its state.
async function projectWork(reader: Reader, projectId: string): Promise<WorkView[]> {
  const works = await reader.select().from(work).where(eq(work.projectId, projectId)).orderBy(asc(work.addedAt));
  const items = await reader.select().from(reviewItem).where(eq(reviewItem.projectId, projectId)).orderBy(asc(reviewItem.sentAt), asc(reviewItem.version));
  const itemIds = items.map((i) => i.id);
  const decisions = itemIds.length ? await reader.select().from(reviewDecision).where(inArray(reviewDecision.itemId, itemIds)) : [];
  const fileIds = items.flatMap((i) => (i.fileId ? [i.fileId] : []));
  const files = fileIds.length ? await reader.select().from(storedFile).where(inArray(storedFile.id, fileIds)) : [];
  const assignments = await assignmentsOf(reader, projectId);
  const roles = await reader.select({ personId: projectRole.personId, role: projectRole.role }).from(projectRole).where(eq(projectRole.projectId, projectId));
  const onProject = new Set(roles.filter((r) => usesDashboard([RoleIdSchema.parse(r.role)])).map((r) => r.personId));
  const wanted = [
    ...works.flatMap((w) => [w.ownerId, w.addedBy]),
    ...items.flatMap((i) => [i.sentBy, i.handedTo]),
    ...decisions.map((d) => d.decidedBy),
    ...[...assignments.values()].flatMap((a) => [a.approverId, a.delegateId]),
  ].filter((id): id is string => !!id);
  const people = wanted.length ? await reader.select().from(person).where(inArray(person.id, [...new Set(wanted)])) : [];
  const map = new Map(people.map((p) => [p.id, displayName(p)]));

  const versionOf = (i: (typeof items)[number]): Version => {
    const d = decisions.find((x) => x.itemId === i.id);
    const f = files.find((x) => x.id === i.fileId);
    return {
      itemId: i.id,
      version: i.version,
      state: (d?.decision ?? 'waiting') as ItemState,
      sentBy: asNamed(map, i.sentBy),
      sentAt: i.sentAt,
      whatChanged: i.whatChanged,
      restoredFrom: i.restoredFrom,
      waitingHandoff: i.waitingHandoff,
      handedTo: i.handedTo ? asNamed(map, i.handedTo) : null,
      file: f ? { id: f.id, name: f.fileName, mediaType: f.mediaType } : null,
      decision: d ? { decision: d.decision as Decision['decision'], by: asNamed(map, d.decidedBy), at: d.decidedAt, feedback: d.feedback } : null,
    };
  };
  const waiting = items.filter((i) => !decisions.some((d) => d.itemId === i.id));
  return works.map((w) => {
    const versions = items.filter((i) => i.workId === w.id).sort((a, b) => a.version - b.version).map(versionOf);
    const latest = versions.at(-1) ?? null;
    const blocking = waiting.find((i) => i.workId !== w.id && i.waitingHandoff === w.handoff);
    return {
      id: w.id,
      projectId,
      title: w.title,
      handoff: w.handoff,
      state: workState({ id: w.id, handoff: w.handoff, latest: latest?.state ?? null, waiting: waiting.map((i) => ({ workId: i.workId, waitingHandoff: i.waitingHandoff })) }),
      owner: { ...asNamed(map, w.ownerId), gone: !onProject.has(w.ownerId) },
      addedBy: w.addedBy ? asNamed(map, w.addedBy) : null,
      addedAt: w.addedAt,
      assignedAt: w.assignedAt,
      deciders: decidersWith(assignments, map, w.handoff),
      latest,
      versions,
      blockedBy: blocking
        ? {
            itemId: blocking.id,
            workId: blocking.workId,
            title: blocking.title,
            handoff: blocking.handoff,
            deciders: decidersWith(assignments, map, blocking.handoff),
            handedTo: blocking.handedTo ? asNamed(map, blocking.handedTo) : null,
          }
        : null,
    };
  });
}

// A version stamp: the latest change in the record for this project. Every command logs an
// activity entry in the same transaction as its change, so a new entry means something changed.
async function stampOf(reader: Reader, projectId: string): Promise<string> {
  const rows = await reader
    .select({ n: sql<number>`count(*)::int`, at: sql<string | null>`max(${activityEntry.at})::text` })
    .from(activityEntry)
    .where(eq(activityEntry.projectId, projectId));
  return `${rows[0]?.n ?? 0}:${rows[0]?.at ?? ''}`;
}

export async function boardFor(projectId: string): Promise<{ stamp: string; work: WorkView[] }> {
  return db().transaction(async (tx) => ({ stamp: await stampOf(tx, projectId), work: await projectWork(tx, projectId) }), { accessMode: 'read only' });
}

export type FeedbackEntry = { by: string; at: Date; text: string; decision: Decision['decision'] | null };

// A version's thread: written feedback and the decision's feedback, oldest first (AC-19).
async function threadsFor(reader: Reader, versions: Version[]): Promise<Map<string, FeedbackEntry[]>> {
  const ids = versions.map((v) => v.itemId);
  const rows = ids.length
    ? await reader.select({ f: workFeedback, p: person }).from(workFeedback).innerJoin(person, eq(person.id, workFeedback.personId)).where(inArray(workFeedback.itemId, ids))
    : [];
  return new Map(
    versions.map((v) => {
      const written: FeedbackEntry[] = rows.filter((r) => r.f.itemId === v.itemId).map((r) => ({ by: displayName(r.p), at: r.f.at, text: r.f.text, decision: null }));
      const decided: FeedbackEntry[] =
        v.decision && v.decision.feedback && v.decision.decision !== 'withdraw' ? [{ by: v.decision.by.display, at: v.decision.at, text: v.decision.feedback, decision: v.decision.decision }] : [];
      return [v.itemId, [...written, ...decided].sort((a, b) => a.at.getTime() - b.at.getTime())];
    }),
  );
}

export type WorkPage = Omit<WorkView, 'versions'> & { stamp: string; versions: (Version & { feedback: FeedbackEntry[] })[] };

// One piece of work with every version, newest first, and each version's feedback (AC-18 to AC-21).
export async function workFor(projectId: string, workId: string): Promise<WorkPage | null> {
  if (!isId(projectId) || !isId(workId)) return null;
  return db().transaction(
    async (tx) => {
      const found = (await projectWork(tx, projectId)).find((w) => w.id === workId);
      if (!found) return null;
      const threads = await threadsFor(tx, found.versions);
      const versions = [...found.versions].reverse().map((v) => ({ ...v, feedback: threads.get(v.itemId) ?? [] }));
      return { ...found, stamp: await stampOf(tx, projectId), versions };
    },
    { accessMode: 'read only' },
  );
}

// The piece of work an item is a version of, with its versions and threads.
export async function workOfItem(projectId: string, itemId: string): Promise<WorkPage | null> {
  if (!isId(projectId) || !isId(itemId)) return null;
  const row = (await db().select({ workId: reviewItem.workId }).from(reviewItem).where(and(eq(reviewItem.projectId, projectId), eq(reviewItem.id, itemId))).limit(1))[0];
  return row ? workFor(projectId, row.workId) : null;
}

// --- What needs you (AC-33 to AC-40)

export type NeedKind = 'decide' | 'returned' | 'assigned' | 'waiting';

export type Need = {
  key: string;
  kind: NeedKind;
  projectId: string;
  projectName: string;
  handoff: string;
  title: string;
  workId: string;
  itemId: string | null;
  version: Version | null;
  versionCount: number;
  work: WorkView;
  blocking: boolean;
  // When it reached the person: sent, decided or assigned (AC-35).
  at: Date;
  newToProject: boolean;
};

export type NeedGroup = { handoff: string; projectId: string; projectName: string; items: Need[] };

export type ProjectNeeds = {
  id: string;
  name: string;
  roles: RoleId[];
  sentNothing: boolean;
  producers: Named[];
  directors: Named[];
  deciders: Map<string, Deciders | null>;
};

// Groups with a blocking item first, by their oldest blocking item, then the rest by their oldest
// item; inside a group, blocking items first, then oldest first (AC-35).
export function groupNeeds(needs: Need[]): NeedGroup[] {
  const byKey = new Map<string, Need[]>();
  for (const n of needs) byKey.set(`${n.projectId}:${n.handoff}`, [...(byKey.get(`${n.projectId}:${n.handoff}`) ?? []), n]);
  const groups = [...byKey.values()].map((items) => {
    const sorted = [...items].sort((a, b) => Number(b.blocking) - Number(a.blocking) || a.at.getTime() - b.at.getTime());
    const blockingTimes = items.filter((i) => i.blocking).map((i) => i.at.getTime());
    const first = sorted[0] as Need;
    return {
      group: { handoff: first.handoff, projectId: first.projectId, projectName: first.projectName, items: sorted },
      firstBlocking: blockingTimes.length ? Math.min(...blockingTimes) : null,
      oldest: Math.min(...items.map((i) => i.at.getTime())),
    };
  });
  groups.sort((x, y) => {
    if (x.firstBlocking !== null && y.firstBlocking !== null) return x.firstBlocking - y.firstBlocking;
    if (x.firstBlocking !== null) return -1;
    if (y.firstBlocking !== null) return 1;
    return x.oldest - y.oldest;
  });
  return groups.map((g) => g.group);
}

export type Needs = {
  projects: ProjectNeeds[];
  decide: NeedGroup[];
  returned: NeedGroup[];
  assigned: NeedGroup[];
  waiting: NeedGroup[];
  handedOn: boolean;
  stamp: string;
};

// Everything that needs one person, on every project they can open, from the same records the
// queue and the board read. The reads run in a read-only transaction: the page adds no record.
export async function whatNeedsYou(personId: string): Promise<Needs> {
  return db().transaction(
    async (tx) => {
      const mine = await tx
        .select({ id: project.id, name: project.name, role: projectRole.role })
        .from(projectRole)
        .innerJoin(project, eq(project.id, projectRole.projectId))
        .where(eq(projectRole.personId, personId))
        .orderBy(asc(project.name));
      const projects = new Map<string, { id: string; name: string; roles: RoleId[] }>();
      for (const r of mine) {
        const entry = projects.get(r.id) ?? { id: r.id, name: r.name, roles: [] };
        entry.roles.push(RoleIdSchema.parse(r.role));
        projects.set(r.id, entry);
      }
      const open = [...projects.values()].filter((p) => permissionsFor(p.roles).has('open-project'));
      const needs: Need[] = [];
      const result: ProjectNeeds[] = [];
      let handedOn = false;
      const stamps: string[] = [];
      for (const p of open) {
        const works = await projectWork(tx, p.id);
        stamps.push(`${p.id}=${await stampOf(tx, p.id)}`);
        const sent = works.some((w) => w.versions.some((v) => v.sentBy.id === personId));
        const team = await tx
          .select({ person, role: projectRole.role })
          .from(projectRole)
          .innerJoin(person, eq(person.id, projectRole.personId))
          .where(and(eq(projectRole.projectId, p.id), inArray(projectRole.role, ['producer', 'director'])))
          .orderBy(asc(person.createdAt));
        const withRole = (role: string) => team.filter((t) => t.role === role).map((t) => ({ id: t.person.id, display: displayName(t.person) }));
        const assignments = await assignmentsOf(tx, p.id);
        const approverIds = [...new Set([...assignments.values()].flatMap((a) => [a.approverId, a.delegateId]).filter((id): id is string => !!id))];
        const approvers = approverIds.length ? await tx.select().from(person).where(inArray(person.id, approverIds)) : [];
        const approverNames = new Map(approvers.map((x) => [x.id, displayName(x)]));
        const deciders = new Map<string, Deciders | null>(gatedHandoffs().map((h) => [h.id, decidersWith(assignments, approverNames, h.id)]));
        result.push({ id: p.id, name: p.name, roles: p.roles, sentNothing: !sent, producers: withRole('producer'), directors: withRole('director'), deciders });
        const base = (w: WorkView, v: Version | null) => ({
          projectId: p.id,
          projectName: p.name,
          handoff: w.handoff,
          title: w.title,
          workId: w.id,
          version: v,
          versionCount: w.versions.length,
          work: w,
          newToProject: !sent,
        });
        for (const w of works) {
          for (const v of w.versions.filter((x) => x.state === 'waiting')) {
            const decides = deciderIds(w.deciders).includes(personId);
            const handedElsewhere = !!v.handedTo && v.handedTo.id !== personId;
            if (decides && handedElsewhere) handedOn = true;
            if (decides && !handedElsewhere) {
              needs.push({ ...base(w, v), key: `decide:${v.itemId}`, kind: 'decide', itemId: v.itemId, blocking: !!v.waitingHandoff, at: v.sentAt });
            }
          }
          const latest = w.latest;
          if (latest?.state === 'waiting' && latest.sentBy.id === personId) {
            needs.push({ ...base(w, latest), key: `waiting:${latest.itemId}`, kind: 'waiting', itemId: latest.itemId, blocking: !!latest.waitingHandoff, at: latest.sentAt });
          }
          const mineToFix = w.owner.id === personId || latest?.sentBy.id === personId;
          if ((latest?.state === 'revise' || latest?.state === 'reject') && mineToFix) {
            needs.push({ ...base(w, latest), key: `returned:${w.id}`, kind: 'returned', itemId: latest.itemId, blocking: false, at: latest.decision?.at ?? latest.sentAt });
          }
          if (w.owner.id === personId && (!latest || latest.state === 'withdraw')) {
            needs.push({ ...base(w, latest), key: `assigned:${w.id}`, kind: 'assigned', itemId: latest?.itemId ?? null, blocking: false, at: w.assignedAt });
          }
        }
      }
      const of = (kind: NeedKind) => groupNeeds(needs.filter((n) => n.kind === kind));
      return { projects: result, decide: of('decide'), returned: of('returned'), assigned: of('assigned'), waiting: of('waiting'), handedOn, stamp: stamps.join(',') };
    },
    { accessMode: 'read only' },
  );
}

// What happened to things that left a person's lists, for the line that replaces them (AC-39).
export async function outcomesFor(personId: string, keys: string[]): Promise<Record<string, { kind: string; by: string | null; at: Date | null }>> {
  const out: Record<string, { kind: string; by: string | null; at: Date | null }> = {};
  for (const key of keys.slice(0, 200)) {
    const [kind, id] = key.split(':');
    if (!id || !isId(id)) continue;
    if (kind === 'decide' || kind === 'waiting') {
      const row = (
        await db()
          .select({ item: reviewItem, decision: reviewDecision, by: person })
          .from(reviewItem)
          .leftJoin(reviewDecision, eq(reviewDecision.itemId, reviewItem.id))
          .leftJoin(person, eq(person.id, reviewDecision.decidedBy))
          .where(eq(reviewItem.id, id))
          .limit(1)
      )[0];
      if (!row || !(await canOpen(personId, row.item.projectId))) out[key] = { kind: 'gone', by: null, at: null };
      else if (row.decision) out[key] = { kind: row.decision.decision, by: row.by ? displayName(row.by) : null, at: row.decision.decidedAt };
      else out[key] = { kind: 'no-longer-decide', by: null, at: null };
    } else {
      const w = (await db().select().from(work).where(eq(work.id, id)).limit(1))[0];
      if (!w || !(await canOpen(personId, w.projectId))) {
        out[key] = { kind: 'gone', by: null, at: null };
        continue;
      }
      const latest = (await projectWork(db(), w.projectId)).find((x) => x.id === id)?.latest ?? null;
      if (latest?.state === 'waiting') out[key] = { kind: 'sent', by: latest.sentBy.display, at: latest.sentAt };
      else if (latest?.decision?.decision === 'accept') out[key] = { kind: 'accept', by: latest.decision.by.display, at: latest.decision.at };
      else out[key] = { kind: 'gone', by: null, at: null };
    }
  }
  return out;
}

async function canOpen(personId: string, projectId: string): Promise<boolean> {
  const rows = await db().select({ role: projectRole.role }).from(projectRole).where(and(eq(projectRole.projectId, projectId), eq(projectRole.personId, personId)));
  return permissionsFor(rows.map((r) => RoleIdSchema.parse(r.role))).has('open-project');
}

export const stageLabel = (id: string) => handoffById(id)?.label ?? id;
