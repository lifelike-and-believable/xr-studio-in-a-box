import 'server-only';
import {
  BatchDecisionRequest,
  DecisionRequest,
  RecommendationRequest,
  SendForReviewRequest,
  SetAreaRequest,
  SetHolderRequest,
} from '@xr/contracts';
import {
  addRecommendation,
  decide,
  handOn,
  sendForReview,
  setAreaApprovers,
  setProtectedHolder,
  withdrawItem,
  type Refusal,
} from '@/record/commands';
import { projectFor } from '@/record/queries';
import { approversOf, itemFor, queueFor, reviewFileFor } from '@/record/review';
import { readAll } from '@/storage/storage';
import { body, caller, invalid, refusal, unauthorised } from './api';

// The slice 3 endpoints under /api/v1 (layer1-gates-and-queue#AC-39). Each checks the session,
// validates its body with contracts/, and goes to the command layer or the reads.

type Ctx = { params: Promise<Record<string, string>> };

const notAvailable = () => Response.json({ message: 'This page is not available' }, { status: 404 });
const refused = (r: Refusal & { held?: unknown; decided?: unknown }) =>
  r.held || r.decided
    ? Response.json({ status: r.status, message: r.message, fields: r.fields, held: r.held, decided: r.decided }, { status: r.status })
    : refusal(r);

async function open(request: Request, ctx: Ctx) {
  const me = await caller(request);
  if (!me) return { response: unauthorised() } as const;
  const p = await ctx.params;
  const view = await projectFor(me.person.id, p.id ?? '');
  if (view.state !== 'open') return { response: notAvailable() } as const;
  return { me, p, projectId: p.id ?? '' } as const;
}

// Files shown in the browser; anything else is downloaded, never rendered.
const INLINE = /^(image|video|audio)\/|^application\/pdf$/;

export const reviewRoutes = {
  approvers: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    return Response.json(await approversOf(o.projectId));
  },
  setArea: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = SetAreaRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await setAreaApprovers(me.principal, p.id ?? '', p.area ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  setHolder: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = SetHolderRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await setProtectedHolder(me.principal, p.id ?? '', p.approval ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  queue: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    const url = new URL(request.url);
    const filter = { area: url.searchParams.get('area') ?? undefined, handedTo: url.searchParams.get('handedTo') ?? undefined };
    return Response.json(await queueFor(o.me.person.id, o.projectId, filter));
  },
  send: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = SendForReviewRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await sendForReview(me.principal, p.id ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  item: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    const item = await itemFor(o.projectId, o.p.itemId ?? '');
    return item ? Response.json(item) : notAvailable();
  },
  decision: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = DecisionRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await decide(me.principal, p.id ?? '', [p.itemId ?? ''], parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  batch: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = BatchDecisionRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const { itemIds, ...input } = parsed.data;
    const r = await decide(me.principal, p.id ?? '', itemIds, input);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  handOn: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const p = await ctx.params;
    const r = await handOn(me.principal, p.id ?? '', p.itemId ?? '');
    return r.ok ? Response.json(r.value) : refused(r);
  },
  withdraw: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const p = await ctx.params;
    const r = await withdrawItem(me.principal, p.id ?? '', p.itemId ?? '');
    return r.ok ? Response.json(r.value) : refused(r);
  },
  recommendation: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = RecommendationRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const p = await ctx.params;
    const r = await addRecommendation(me.principal, p.id ?? '', p.itemId ?? '', parsed.data);
    return r.ok ? Response.json(r.value) : refused(r);
  },
  file: async (request: Request, ctx: Ctx) => {
    const o = await open(request, ctx);
    if ('response' in o) return o.response;
    const file = await reviewFileFor(o.projectId, o.p.itemId ?? '');
    if (!file) return notAvailable();
    const inline = INLINE.test(file.mediaType);
    return new Response(Buffer.from(await readAll(file.storageKey)), {
      headers: {
        'content-type': inline ? file.mediaType : 'application/octet-stream',
        'content-disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
        'x-content-type-options': 'nosniff',
      },
    });
  },
};
