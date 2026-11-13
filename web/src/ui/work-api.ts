import 'server-only';
import { AddWorkRequest, ChangeOwnerRequest, FeedbackRequest, RestoreRequest } from '@xr/contracts';
import { addFeedback, addWork, changeOwner, removeWork, restoreVersion, type Refusal } from '@/record/commands';
import { projectFor } from '@/record/queries';
import { decidersFor } from '@/record/review';
import { outcomesFor, whatNeedsYou, workFor } from '@/record/work';
import { body, caller, invalid, refusal, unauthorised } from './api';
import { viewerZone } from './time';
import { boardData, needsView, outcomeLine } from './work-view';

// The slice 4 endpoints under /api/v1 (layer1-versions-board-first-view#AC-43). Each checks the
// session, validates its body with contracts/, and goes to the command layer or the reads.

type Ctx = { params: Promise<Record<string, string>> };

const notAvailable = () => Response.json({ message: 'This page is not available' }, { status: 404 });
const refused = (r: Refusal & { held?: unknown; heldFile?: unknown }) =>
  r.held || r.heldFile ? Response.json({ status: r.status, message: r.message, fields: r.fields, held: r.held, heldFile: r.heldFile }, { status: r.status }) : refusal(r);

async function open(request: Request, ctx: Ctx) {
  const me = await caller(request);
  if (!me) return { response: unauthorised() } as const;
  const p = await ctx.params;
  const view = await projectFor(me.person.id, p.id ?? '');
  if (view.state !== 'open') return { response: notAvailable() } as const;
  return { me, p, projectId: p.id ?? '' } as const;
}

// The keys a page already shows, to say what happened to those that left (AC-39).
const knownKeys = (url: URL) => (url.searchParams.get('known') ?? '').split(',').filter(Boolean);

export const workRoutes = {
  board: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    return Response.json(await boardData(o.projectId, await viewerZone(), await decidersFor(o.projectId)));
  },
  add: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = AddWorkRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const r = await addWork(me.principal, (await ctx.params).id ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  work: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    const found = await workFor(o.projectId, o.p.workId ?? '');
    return found ? Response.json(found) : notAvailable();
  },
  remove: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const p = await ctx.params;
    const r = await removeWork(me.principal, p.id ?? '', p.workId ?? '');
    return r.ok ? Response.json(r.value) : refused(r);
  },
  owner: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = ChangeOwnerRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await changeOwner(me.principal, p.id ?? '', p.workId ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  restore: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = RestoreRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await restoreVersion(me.principal, p.id ?? '', p.workId ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  feedback: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = FeedbackRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await addFeedback(me.principal, p.id ?? '', p.itemId ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  needs: async (request: Request) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const zone = await viewerZone();
    const view = needsView(await whatNeedsYou(me.person.id), zone, me.person.id);
    const shown = new Set(view.sections.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.key))));
    const known = knownKeys(new URL(request.url));
    const titles = new URL(request.url).searchParams.getAll('title');
    const gone = known.filter((k) => !shown.has(k));
    const outcomes = await outcomesFor(me.person.id, gone);
    const lines = Object.fromEntries(gone.map((k) => [k, { kind: outcomes[k]?.kind ?? 'gone', line: outcomeLine(titles[known.indexOf(k)] ?? '', outcomes[k] ?? { kind: 'gone', by: null, at: null }, zone) }]));
    return Response.json({ ...view, outcomes: lines });
  },
};
