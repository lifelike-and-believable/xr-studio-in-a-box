import 'server-only';
import { AREAS, areaLabel, handoffById, joinLabels, protectedLabel, sortRoles, stagesFor, STATE_LABELS, usesDashboard, type RoleId } from '@xr/contracts';
import type { Deciders, Named } from '@/record/review';
import { boardFor, type Need, type NeedGroup, type Needs, type ProjectNeeds, type Version, type WorkView } from '@/record/work';
import type { BoardData, BoardRow, BoardStage } from './board-text';
import { dayOf, entryTime, timeOf } from './time';

// Turns the slice 4 reads into the words the pages show, in the viewer's time zone
// (layer1-versions-board-first-view#AC-6 to AC-8, AC-18 to AC-21, AC-33 to AC-38).

const orList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`);
export const andList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);
export const stage = (id: string) => handoffById(id)?.label ?? id;

export function deciderNames(d: Deciders | null): string[] {
  if (!d) return [];
  return d.kind === 'protected' ? [d.holder.display] : [d.approver.display, ...(d.delegate ? [d.delegate.display] : [])];
}

// "Morgan Ray or Sam Okafor", "Sam Okafor (handed on by Morgan Ray)".
export function waitsFor(d: Deciders | null, handedTo: Named | null): string {
  if (!d) return '';
  if (d.kind === 'area' && d.delegate && handedTo?.id === d.delegate.id) return `${d.delegate.display} (handed on by ${d.approver.display})`;
  return orList(deciderNames(d));
}

// "Decided by: Morgan Ray, the Creative approver, with Sam Okafor as delegate." (AC-7)
export function decidedByLine(d: Deciders | null): string {
  if (!d) return '';
  if (d.kind === 'protected') return `Decided by: ${d.holder.display}, who holds the ${protectedLabel(d.approval).toLowerCase()} approval.`;
  const approver = `${d.approver.display}, the ${areaLabel(d.area)} approver`;
  return d.delegate ? `Decided by: ${approver}, with ${d.delegate.display} as delegate.` : `Decided by: ${approver}.`;
}

const DONE_WORDS: Record<string, string> = { accept: 'accepted by', revise: 'revision requested by', reject: 'rejected by', withdraw: 'withdrawn by' };
const DECIDED: Record<string, string> = { accept: 'Accepted', revise: 'Revision requested', reject: 'Rejected', withdraw: 'Withdrawn' };
export const decisionTag = (d: string) => DECIDED[d] ?? d;

// "Version 2: revision requested by Morgan Ray, 11 November, 16:40."
export function versionLine(v: Version, zone: string): string {
  if (!v.decision) return `Version ${v.version}, sent ${entryTime(v.sentAt, zone)}.`;
  return `Version ${v.version}: ${DONE_WORDS[v.decision.decision] ?? v.decision.decision} ${v.decision.by.display}, ${entryTime(v.decision.at, zone)}.`;
}

// "Revision requested by Morgan Ray, 11 November, 16:40", or "Waiting".
export function decisionCell(v: Version, zone: string): string {
  return v.decision ? `${decisionTag(v.decision.decision)} by ${v.decision.by.display}, ${entryTime(v.decision.at, zone)}` : 'Waiting';
}

// The line under a state on the board (AC-8).
function baseDetail(w: WorkView, zone: string): string {
  const v = w.latest;
  if (!v) return 'Not sent for review yet.';
  if (v.state === 'waiting') return `Waiting for ${waitsFor(w.deciders, v.handedTo)}.`;
  return versionLine(v, zone);
}

export function blockedLine(w: WorkView): string {
  const b = w.blockedBy;
  return b ? `Waits on ${b.title} (${stage(b.handoff)}), which is waiting for ${waitsFor(b.deciders, b.handedTo)}.` : '';
}

export function detail(w: WorkView, zone: string): string {
  return w.state === 'blocked' ? `${blockedLine(w)} ${baseDetail(w, zone)}` : baseDetail(w, zone);
}

// The state line on a work's page (AC-18).
export function stateText(w: WorkView, zone: string): string {
  const v = w.latest;
  if (w.state === 'waiting' && v) return `${STATE_LABELS.waiting}. Version ${v.version} is waiting for ${waitsFor(w.deciders, v.handedTo)}.`;
  return `${STATE_LABELS[w.state]}. ${detail(w, zone)}`;
}

export const ownerText = (o: WorkView['owner']) => (o.gone ? `${o.display} (no longer on the project)` : o.display);

export function boardRow(w: WorkView, zone: string): BoardRow {
  const v = w.latest;
  return {
    id: w.id,
    title: w.title,
    handoff: w.handoff,
    owner: ownerText(w.owner),
    state: w.state,
    detail: detail(w, zone),
    blockingStage: v?.state === 'waiting' && v.waitingHandoff ? stage(v.waitingHandoff) : null,
    latest: v ? `Version ${v.version}, sent ${dayOf(v.sentAt, zone)}` : 'No versions yet',
  };
}

export async function boardData(projectId: string, zone: string, deciders: (handoff: string) => Deciders | null): Promise<BoardData> {
  const { stamp, work } = await boardFor(projectId);
  const stages: BoardStage[] = AREAS.flatMap((a) =>
    a.handoffs.map((h) => ({ handoff: h, label: stage(h), area: a.id, areaLabel: a.label, decidedBy: decidedByLine(deciders(h)) })),
  );
  return { stamp, work: work.map((w) => boardRow(w, zone)), stages };
}

// --- What needs you

export type NeedRow = { key: string; title: string; href: string; line: string; quote: string | null; blocking: string | null; next: string };
export type NeedGroupView = { id: string; heading: string; count: string; items: NeedRow[] };
export type NeedSection = { kind: Need['kind']; heading: string; intro: string; groups: NeedGroupView[] };

export type StagesPanel = { projectId: string; name: string; open: boolean; roles: string; rows: { stage: string; who: string }[]; ask: string };

export type NeedsView = {
  stamp: string;
  count: string | null;
  sections: NeedSection[];
  handedOn: boolean;
  empty: { newcomers: string[]; general: boolean; waitingOnly: string | null };
  boards: { name: string; href: string }[];
  panels: StagesPanel[];
};

const SECTIONS: { kind: Need['kind']; heading: string; intro: string }[] = [
  { kind: 'decide', heading: 'For your decision', intro: 'Work waiting at a gate you decide. Open an item to accept it, request a revision or reject it.' },
  { kind: 'returned', heading: 'Returned to you', intro: 'Work you sent that came back. Read the feedback, then decide what to do next.' },
  { kind: 'assigned', heading: 'Assigned to you', intro: 'Work you own that is not waiting for review: not sent yet, or withdrawn.' },
  { kind: 'waiting', heading: 'Waiting for others', intro: 'Work you sent that is waiting at a gate. Nothing to do until it is decided.' },
];

export const things = (n: number) => `${n} ${n === 1 ? 'thing' : 'things'}`;
const sentWaiting = (n: number) => `${things(n)} you sent ${n === 1 ? 'is' : 'are'} waiting for others.`;

// The fixed next-step sentences of design-what-needs-you choice 6.
function nextStep(n: Need, me: string): string {
  const w = n.work;
  if (n.kind === 'decide') return 'Decide: accept, request a revision or reject.';
  if (n.kind === 'waiting') return `Nothing to do. It waits for ${waitingFor(w.deciders, n.version?.handedTo ?? null)}.`;
  if (n.kind === 'returned') {
    if (n.version?.state === 'reject') return 'It does not move on. Read the feedback; if you change it, send it again from its page.';
    return `Change it as the feedback asks, then select Send a revised version on its page.${n.versionCount > 1 ? ' To go back to an earlier version, restore it there.' : ''}`;
  }
  if (n.version?.state === 'withdraw') {
    const by = n.version.decision?.by;
    return `${by?.id === me ? 'You' : (by?.display ?? 'Someone')} withdrew version ${n.version.version}. Send it again from its page when it is ready.`;
  }
  if (w.blockedBy) return `You can work on it now. It cannot pass ${stage(w.handoff)} until ${w.blockedBy.title} is decided.`;
  return `Make it, then send it for review from its page. ${orList(deciderNames(w.deciders))} decides it${n.newToProject ? ` at ${stage(w.handoff)}` : ''}.`;
}

// "Jordan Lee, who holds the contracts and licence terms approval" for a protected stage.
function waitingFor(d: Deciders | null, handedTo: Named | null): string {
  if (d?.kind === 'protected') return `${d.holder.display}, who holds the ${protectedLabel(d.approval).toLowerCase()} approval`;
  return waitsFor(d, handedTo);
}

function itemLine(n: Need, zone: string): string {
  const v = n.version;
  if (n.kind === 'decide' && v) return `Version ${v.version} from ${v.sentBy.display}, ${entryTime(v.sentAt, zone)}.`;
  if (n.kind === 'waiting' && v) return `Version ${v.version}, sent ${entryTime(v.sentAt, zone)}.`;
  if (v) return versionLine(v, zone);
  const added = n.work.addedBy;
  return added ? `Added by ${added.display}, ${entryTime(n.work.addedAt, zone)}. Not sent for review yet.` : 'Not sent for review yet.';
}

function needRow(n: Need, zone: string, me: string): NeedRow {
  const v = n.version;
  const toItem = n.kind === 'decide' || n.kind === 'waiting';
  return {
    key: n.key,
    title: n.title,
    href: toItem && n.itemId ? `/projects/${n.projectId}/review/${n.itemId}` : `/projects/${n.projectId}/board/${n.workId}`,
    line: itemLine(n, zone),
    quote: n.kind === 'returned' && v?.decision?.feedback ? `${v.decision.by.display}: ${v.decision.feedback}` : null,
    blocking: n.blocking && v?.waitingHandoff ? `${stage(v.waitingHandoff)} waits on this decision.` : null,
    next: nextStep(n, me),
  };
}

function groupView(g: NeedGroup, zone: string, me: string): NeedGroupView {
  const blocking = g.items.filter((i) => i.blocking).length;
  return {
    id: `${g.projectId}-${g.handoff}`,
    heading: `${stage(g.handoff)}, ${g.projectName}`,
    count: `${g.items.length} ${g.items.length === 1 ? 'item' : 'items'}${blocking ? `, ${blocking} blocking` : ''}.`,
    items: g.items.map((i) => needRow(i, zone, me)),
  };
}

const ARTICLE: Partial<Record<RoleId, string>> = { director: 'the', producer: 'the' };
function rolesSentence(roles: RoleId[], project: string): string {
  const list = sortRoles(roles).filter((r) => usesDashboard([r]));
  const first = list[0];
  const article = first ? (ARTICLE[first] ?? (/^[AEIOU]/.test(joinLabels(list)) ? 'an' : 'a')) : 'a';
  return `You are ${article} ${joinLabels(list)} on ${project}. A gate is the point where a named person must accept your work before it moves on. Each of your stages has one.`;
}

function whoDecides(d: Deciders | null, me: string): string {
  if (!d) return '';
  if (d.kind === 'protected') return d.holder.id === me ? 'You, who hold its protected approval' : `${d.holder.display}, who holds its protected approval`;
  const approver = d.approver.id === me ? `You, the ${areaLabel(d.area)} approver` : `${d.approver.display}, the ${areaLabel(d.area)} approver`;
  if (!d.delegate) return approver;
  return `${approver}, or ${d.delegate.id === me ? 'you' : d.delegate.display}, the delegate`;
}

// "ask the project's producer, Jordan Lee."; with no producer, its director.
function askLine(p: ProjectNeeds): string {
  const names = (people: Named[]) => orList(people.map((x) => x.display));
  const who = p.producers.length ? `the project's producer, ${names(p.producers)}` : `the project's director, ${names(p.directors)}`;
  return `When a piece of work is ready, open it and select Send for review. Work assigned to you is listed above, under Assigned to you. If you expected work that is not listed, ask ${who}.`;
}

// "Ask the project's producer, Jordan Lee, or its director, Morgan Ray, ..." (AC-38).
function newcomerLine(p: ProjectNeeds): string {
  const directors = p.directors.filter((d) => !p.producers.some((x) => x.id === d.id));
  const names = (people: Named[]) => orList(people.map((x) => x.display));
  let ask: string;
  if (p.producers.length && directors.length) ask = `the project's producer, ${names(p.producers)}, or its director, ${names(directors)},`;
  else if (p.producers.length && p.producers.every((x) => p.directors.some((d) => d.id === x.id))) ask = `the project's producer and director, ${names(p.producers)},`;
  else if (p.producers.length) ask = `the project's producer, ${names(p.producers)},`;
  else ask = `the project's director, ${names(p.directors)},`;
  return `Nothing is assigned to you yet on ${p.name}. Ask ${ask} to add your first piece of work. It will appear here, under Assigned to you, without a reload.`;
}

export function needsView(needs: Needs, zone: string, me: string): NeedsView {
  const count = (kind: Need['kind']) => needs[kind].reduce((n, g) => n + g.items.length, 0);
  const decide = count('decide');
  const blocking = needs.decide.reduce((n, g) => n + g.items.filter((i) => i.blocking).length, 0);
  const returned = count('returned');
  const assigned = count('assigned');
  const waiting = count('waiting');
  const total = decide + returned + assigned;
  const parts = [
    decide ? `${decide} for your decision` : '',
    decide && blocking ? `${blocking} blocking` : '',
    returned ? `${returned} returned to you` : '',
    assigned ? `${assigned} assigned to you` : '',
  ].filter(Boolean);
  const countLine = total ? `${things(total)} ${total === 1 ? 'needs' : 'need'} you: ${parts.join(', ')}.${waiting ? ` ${sentWaiting(waiting)}` : ''}` : null;
  const newcomers = needs.projects.filter((p) => p.sentNothing);
  return {
    stamp: needs.stamp,
    count: countLine,
    sections: SECTIONS.map((s) => ({ ...s, groups: needs[s.kind].map((g) => groupView(g, zone, me)) })).filter((s) => s.groups.length > 0),
    handedOn: needs.handedOn,
    empty: {
      newcomers: total === 0 && waiting === 0 ? newcomers.map(newcomerLine) : [],
      general: total === 0 && waiting === 0 && newcomers.length === 0,
      waitingOnly: total === 0 && waiting > 0 ? `Nothing needs you right now. ${sentWaiting(waiting)}` : null,
    },
    boards: needs.projects.map((p) => ({ name: p.name, href: `/projects/${p.id}/board` })),
    panels: needs.projects.map((p) => ({
      projectId: p.id,
      name: p.name,
      open: p.sentNothing,
      roles: rolesSentence(p.roles, p.name),
      rows: stagesFor(p.roles).map((h) => ({ stage: stage(h), who: whoDecides(p.deciders.get(h) ?? null, me) })),
      ask: askLine(p),
    })),
  };
}

// The line that replaces something that no longer needs the person (AC-39).
const OUTCOME: Record<string, string> = { accept: 'accepted by', revise: 'returned for revision by', reject: 'rejected by', withdraw: 'withdrawn by', sent: 'sent for review by' };
export function outcomeLine(title: string, o: { kind: string; by: string | null; at: Date | null }, zone: string): string {
  if (o.kind === 'no-longer-decide') return `${title}: you can no longer decide this.`;
  const word = OUTCOME[o.kind];
  if (word && o.by && o.at) return `${title}: ${word} ${o.by} at ${timeOf(o.at, zone)}. It no longer needs you.`;
  return `${title} no longer needs you.`;
}

