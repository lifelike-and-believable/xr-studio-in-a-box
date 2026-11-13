import 'server-only';
import {
  AREAS,
  PROTECTED_APPROVALS,
  areaLabel,
  handoffById,
  isAreaId,
  protectedLabel,
  slotFor,
  usesDashboard,
  type AreaId,
  type ProtectedId,
} from '@xr/contracts';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { person, reviewDecision, reviewItem, reviewRecommendation, storedFile } from '../db/schema';
import { assignmentsOf, decidersOf, firstName } from './commands';
import { peopleOn } from './queries';
import { displayName } from './principal';

// Reads for slice 3 (layer1-gates-and-queue). Who can decide what is worked out here from the
// current assignments on every read, so a change of approver shows at once (AC-10).

type Named = { id: string; display: string };

async function names(ids: (string | null | undefined)[]): Promise<Map<string, string>> {
  const wanted = [...new Set(ids.filter((id): id is string => !!id))];
  if (wanted.length === 0) return new Map();
  const rows = await db().select().from(person).where(inArray(person.id, wanted));
  return new Map(rows.map((r) => [r.id, displayName(r)]));
}

const named = (map: Map<string, string>, id: string | null | undefined): Named | null => (id ? { id, display: map.get(id) ?? '' } : null);

export const handoffLabel = (id: string) => handoffById(id)?.label ?? id;

export async function approversOf(projectId: string) {
  const assignments = await assignmentsOf(db(), projectId);
  const map = await names([...assignments.values()].flatMap((a) => [a.approverId, a.delegateId]));
  return {
    areas: AREAS.map((a) => {
      const row = assignments.get(`area:${a.id}`);
      return { area: a.id as AreaId, label: a.label, handoffs: a.handoffs, approver: named(map, row?.approverId), delegate: named(map, row?.delegateId) };
    }),
    protected: PROTECTED_APPROVALS.map((p) => ({ approval: p.id as ProtectedId, label: p.label, holder: named(map, assignments.get(`protected:${p.id}`)?.approverId) })),
  };
}

// The people who can be named: on the project with a role that uses the dashboard, in the People
// tab's order, with anyone not signed in yet marked (AC-8).
export async function approverChoices(projectId: string): Promise<{ id: string; label: string }[]> {
  return (await peopleOn(projectId))
    .filter((p) => usesDashboard(p.roles))
    .map((p) => ({ id: p.id, label: p.status === 'Invited, not signed in yet' ? `${p.display} (invited, not signed in yet)` : p.display }));
}

type Deciders = { kind: 'area'; area: AreaId; approver: Named; delegate: Named | null } | { kind: 'protected'; approval: ProtectedId; holder: Named };

async function decidersFor(projectId: string) {
  const assignments = await assignmentsOf(db(), projectId);
  const map = await names([...assignments.values()].flatMap((a) => [a.approverId, a.delegateId]));
  return (handoffId: string): Deciders | null => {
    const handoff = handoffById(handoffId);
    const slot = handoff ? slotFor(handoff) : null;
    const a = decidersOf(assignments, handoffId);
    if (!slot || !a) return null;
    const [kind, id] = slot.split(':');
    if (kind === 'protected') return { kind: 'protected', approval: id as ProtectedId, holder: { id: a.approverId, display: map.get(a.approverId) ?? '' } };
    return { kind: 'area', area: id as AreaId, approver: { id: a.approverId, display: map.get(a.approverId) ?? '' }, delegate: named(map, a.delegateId) };
  };
}

const ids = (d: Deciders | null) => (!d ? [] : d.kind === 'protected' ? [d.holder.id] : [d.approver.id, ...(d.delegate ? [d.delegate.id] : [])]);
export const deciderNames = (d: Deciders | null) =>
  !d ? [] : d.kind === 'protected' ? [d.holder.display] : [d.approver.display, ...(d.delegate ? [d.delegate.display] : [])];

// "Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this." (AC-14)
export function whoDecides(d: Deciders | null): string {
  if (!d) return '';
  if (d.kind === 'protected') return `${d.holder.display}, who holds the ${protectedLabel(d.approval).toLowerCase()} approval, decides this.`;
  const approver = `${d.approver.display}, the ${areaLabel(d.area)} approver`;
  return d.delegate ? `${approver}, or ${d.delegate.display}, the delegate, decides this.` : `${approver}, decides this.`;
}

// "Waiting for" in Sent by you and Everything waiting (AC-33, AC-36).
function waitingFor(d: Deciders | null, handedTo: string | null, viewer?: string): string {
  if (!d) return '';
  const say = (n: Named) => (n.id === viewer ? 'You' : n.display);
  if (d.kind === 'protected') return say(d.holder);
  if (d.delegate && handedTo === d.delegate.id) return `${say(d.delegate)} (handed on by ${say(d.approver)})`;
  return d.delegate ? `${say(d.approver)} or ${say(d.delegate)} (delegate)` : say(d.approver);
}

export function decidersLine(d: Deciders | null): string {
  if (!d) return '';
  if (d.kind === 'protected') return `${d.holder.display}, who holds the ${protectedLabel(d.approval).toLowerCase()} approval. Only ${firstName(d.holder.display)} can decide this.`;
  const approver = `${d.approver.display}, the ${areaLabel(d.area)} approver`;
  return d.delegate ? `${approver}, or ${d.delegate.display}, the delegate` : approver;
}

export async function sendFormFor(projectId: string): Promise<Record<string, string>> {
  const find = await decidersFor(projectId);
  return Object.fromEntries(AREAS.flatMap((a) => a.handoffs).map((h) => [h, whoDecides(find(h))]));
}

type ItemRow = typeof reviewItem.$inferSelect;

async function itemsWith(projectId: string, rows: ItemRow[]) {
  const itemIds = rows.map((r) => r.id);
  const decisions = itemIds.length ? await db().select().from(reviewDecision).where(inArray(reviewDecision.itemId, itemIds)) : [];
  const recs = itemIds.length ? await db().select().from(reviewRecommendation).where(inArray(reviewRecommendation.itemId, itemIds)).orderBy(desc(reviewRecommendation.at)) : [];
  const fileIds = rows.flatMap((r) => (r.fileId ? [r.fileId] : []));
  const files = fileIds.length ? await db().select().from(storedFile).where(inArray(storedFile.id, fileIds)) : [];
  const map = await names([...rows.flatMap((r) => [r.sentBy, r.handedTo]), ...decisions.map((d) => d.decidedBy)]);
  const find = await decidersFor(projectId);
  return rows.map((r) => {
    const handoff = handoffById(r.handoff);
    const decision = decisions.find((d) => d.itemId === r.id) ?? null;
    const rec = recs.find((x) => x.itemId === r.id);
    const file = files.find((f) => f.id === r.fileId);
    const deciders = find(r.handoff);
    return {
      id: r.id,
      title: r.title,
      handoff: r.handoff,
      stage: handoff?.label ?? r.handoff,
      area: handoff?.area ? areaLabel(handoff.area) : '',
      areaId: handoff?.area ?? null,
      protectedItem: !!handoff?.protectedApproval,
      whatChanged: r.whatChanged,
      requester: { id: r.sentBy, display: map.get(r.sentBy) ?? '' },
      sentAt: r.sentAt,
      blocking: !decision && !!r.waitingHandoff,
      waitingStage: r.waitingHandoff ? handoffLabel(r.waitingHandoff) : null,
      waitingHandoff: r.waitingHandoff,
      handedTo: named(map, r.handedTo),
      recommendation: rec ? { result: rec.result, reason: rec.reason } : null,
      file: file ? { id: file.id, name: file.fileName, mediaType: file.mediaType } : null,
      state: (decision?.decision ?? 'waiting') as 'waiting' | 'accept' | 'revise' | 'reject' | 'withdraw',
      decision: decision ? { by: map.get(decision.decidedBy) ?? '', at: decision.decidedAt, feedback: decision.feedback } : null,
      deciders,
      deciderIds: ids(deciders),
    };
  });
}

export type ReviewItemView = Awaited<ReturnType<typeof itemsWith>>[number];

export type QueueFilter = { area?: string; handedTo?: string };

export async function queueFor(personId: string, projectId: string, filter: QueueFilter) {
  const assignments = await assignmentsOf(db(), projectId);
  const mine = [...assignments.entries()].filter(([, a]) => a.approverId === personId || a.delegateId === personId);
  const areas = AREAS.filter((a) => mine.some(([slot]) => slot === `area:${a.id}`)).map((a) => ({ id: a.id, label: a.label }));
  for (const [slot] of mine) {
    const p = PROTECTED_APPROVALS.find((x) => `protected:${x.id}` === slot);
    const area = p ? handoffById(p.handoff)?.area : null;
    if (area && !areas.some((a) => a.id === area)) areas.push({ id: area, label: areaLabel(area) });
  }
  areas.sort((x, y) => AREAS.findIndex((a) => a.id === x.id) - AREAS.findIndex((a) => a.id === y.id));
  const delegateIds = [...assignments.values()].filter((a) => a.approverId === personId && a.delegateId).map((a) => a.delegateId ?? '');
  const delegateNames = await names(delegateIds);
  const delegates = [...new Set(delegateIds)].map((id) => ({ id, display: delegateNames.get(id) ?? '' }));
  const isDelegate = [...assignments.values()].some((a) => a.delegateId === personId);

  const rows = await db().select().from(reviewItem).where(eq(reviewItem.projectId, projectId)).orderBy(asc(reviewItem.sentAt));
  const all = (await itemsWith(projectId, rows)).filter((i) => i.state === 'waiting' && i.deciderIds.includes(personId));
  const filtered = all.filter((i) => {
    if (filter.area && isAreaId(filter.area) && i.areaId !== filter.area) return false;
    if (filter.handedTo === 'none' && i.handedTo) return false;
    if (filter.handedTo === 'you' && i.handedTo?.id !== personId) return false;
    if (filter.handedTo && !['none', 'you'].includes(filter.handedTo) && i.handedTo?.id !== filter.handedTo) return false;
    return true;
  });
  const byStage = new Map<string, ReviewItemView[]>();
  for (const item of filtered) byStage.set(item.handoff, [...(byStage.get(item.handoff) ?? []), item]);
  // Blocking first inside a group; groups with a blocking item first, by their oldest blocking
  // item, then the rest by their oldest item (AC-21).
  const groups = [...byStage.entries()].map(([handoff, items]) => {
    const sorted = [...items.filter((i) => i.blocking), ...items.filter((i) => !i.blocking)];
    const firstBlocking = items.find((i) => i.blocking)?.sentAt.getTime() ?? null;
    return { handoff, stage: handoffLabel(handoff), area: items[0]?.area ?? '', items: sorted, firstBlocking, oldest: items[0]?.sentAt.getTime() ?? 0 };
  });
  groups.sort((x, y) => {
    if (x.firstBlocking !== null && y.firstBlocking !== null) return x.firstBlocking - y.firstBlocking;
    if (x.firstBlocking !== null) return -1;
    if (y.firstBlocking !== null) return 1;
    return x.oldest - y.oldest;
  });
  return {
    decidesAnything: mine.length > 0,
    areas,
    delegates,
    isDelegate,
    total: filtered.length,
    blocking: filtered.filter((i) => i.blocking).length,
    groups,
  };
}

export async function itemFor(projectId: string, itemId: string): Promise<ReviewItemView | null> {
  const rows = await db().select().from(reviewItem).where(and(eq(reviewItem.projectId, projectId), eq(reviewItem.id, itemId))).limit(1);
  return (await itemsWith(projectId, rows))[0] ?? null;
}

export async function itemsById(projectId: string, itemIds: string[]): Promise<ReviewItemView[]> {
  if (itemIds.length === 0) return [];
  const rows = await db().select().from(reviewItem).where(and(eq(reviewItem.projectId, projectId), inArray(reviewItem.id, itemIds))).orderBy(asc(reviewItem.sentAt));
  return itemsWith(projectId, rows);
}

export async function sentBy(personId: string, projectId: string) {
  const rows = await db()
    .select()
    .from(reviewItem)
    .where(and(eq(reviewItem.projectId, projectId), eq(reviewItem.sentBy, personId)))
    .orderBy(desc(reviewItem.sentAt));
  return (await itemsWith(projectId, rows)).map((i) => ({ ...i, waitingFor: waitingFor(i.deciders, i.handedTo?.id ?? null) }));
}

export async function waitingOn(projectId: string, viewerId: string) {
  const rows = await db().select().from(reviewItem).where(eq(reviewItem.projectId, projectId)).orderBy(asc(reviewItem.sentAt));
  return (await itemsWith(projectId, rows))
    .filter((i) => i.state === 'waiting')
    .map((i) => ({ ...i, waitingFor: waitingFor(i.deciders, i.handedTo?.id ?? null, viewerId) }));
}

export async function reviewFileFor(projectId: string, itemId: string) {
  const rows = await db()
    .select({ file: storedFile })
    .from(reviewItem)
    .innerJoin(storedFile, eq(storedFile.id, reviewItem.fileId))
    .where(and(eq(reviewItem.projectId, projectId), eq(reviewItem.id, itemId)))
    .limit(1);
  return rows[0]?.file ?? null;
}
