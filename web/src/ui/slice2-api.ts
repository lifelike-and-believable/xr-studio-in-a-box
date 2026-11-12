import 'server-only';
import {
  ACTIVITY_PAGE_SIZE,
  AddFormatRequest,
  ConfirmFactRequest,
  ConfirmUploadRequest,
  RequestUploadRequest,
  RestoreFactRequest,
  SaveFactRequest,
  SetFormatRequest,
  type Fact,
} from '@xr/contracts';
import {
  addFormat,
  confirmFact,
  confirmUpload,
  deleteUpload,
  registerUpload,
  removeFormat,
  removeWorkSample,
  requestUpload,
  restoreFact,
  saveFact,
  setFormat,
  type Owner,
  type Refusal,
} from '@/record/commands';
import { accessFor, activityFor, currentFacts, formatRows, organisationFactList, projectFactList, versionsOf } from '@/record/facts';
import { body, caller, invalid, refusal, unauthorised } from './api';
import { activityFilter } from './activity-filter';

// The slice 2 endpoints under /api/v1 (layer1-facts-identifiers-activity, Scope). Each checks the
// session, validates its body with contracts/, and goes to the command layer; reads answer a
// fact the caller may not see exactly as an address that does not exist.

type Kind = Owner['kind'];
type Ctx = { params: Promise<Record<string, string>> };

const notAvailable = () => Response.json({ message: 'This page is not available' }, { status: 404 });
const refused = (r: Refusal & { held?: unknown; conflict?: unknown }) =>
  r.held || r.conflict
    ? Response.json({ status: r.status, message: r.message, fields: r.fields, held: r.held, conflict: r.conflict }, { status: r.status })
    : refusal(r);

async function ownerOf(kind: Kind, ctx: Ctx): Promise<{ owner: Owner; p: Record<string, string> }> {
  const p = await ctx.params;
  return { owner: { kind, id: p.id ?? '' }, p };
}

export function factRoutes(kind: Kind) {
  const list = kind === 'project' ? projectFactList : organisationFactList;
  return {
    list: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner } = await ownerOf(kind, ctx);
      const access = await accessFor(me.person.id, owner);
      if (!access) return notAvailable();
      const facts = await currentFacts(owner, list, access.canSee);
      return Response.json(
        facts.map((f) =>
          f.visible
            ? { fact: f.fact, visible: true, version: f.current?.number ?? 0, value: f.current?.value ?? null, savedBy: f.current?.by ?? null, savedAt: f.current?.at ?? null }
            : { fact: f.fact, visible: false },
        ),
      );
    },
    one: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner, p } = await ownerOf(kind, ctx);
      const access = await accessFor(me.person.id, owner);
      const fact = (p.fact ?? '') as Fact;
      if (!access || !access.canSee(fact)) return notAvailable();
      const current = (await versionsOf(owner, fact))[0];
      return Response.json({ fact, version: current?.number ?? 0, value: current?.value ?? null, savedBy: current?.by ?? null, savedAt: current?.at ?? null });
    },
    versions: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner, p } = await ownerOf(kind, ctx);
      const access = await accessFor(me.person.id, owner);
      const fact = (p.fact ?? '') as Fact;
      if (!access || !access.canSee(fact)) return notAvailable();
      return Response.json(await versionsOf(owner, fact));
    },
    save: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const parsed = SaveFactRequest.safeParse(await body(request));
      if (!parsed.success) return invalid(parsed.error.issues);
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await saveFact(me.principal, owner, p.fact ?? '', parsed.data);
      return result.ok ? Response.json(result.value) : refused(result);
    },
    restore: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const parsed = RestoreFactRequest.safeParse(await body(request));
      if (!parsed.success) return invalid(parsed.error.issues);
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await restoreFact(me.principal, owner, p.fact ?? '', parsed.data.version);
      return result.ok ? Response.json(result.value) : refused(result);
    },
    confirm: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const parsed = ConfirmFactRequest.safeParse(await body(request));
      if (!parsed.success) return invalid(parsed.error.issues);
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await confirmFact(me.principal, owner, p.fact ?? '', parsed.data);
      return result.ok ? Response.json(result.value) : refused(result);
    },
  };
}

export function uploadRoutes(kind: Kind) {
  return {
    request: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const parsed = RequestUploadRequest.safeParse(await body(request));
      if (!parsed.success) return invalid(parsed.error.issues);
      const { owner } = await ownerOf(kind, ctx);
      const result = await requestUpload(me.principal, owner, parsed.data);
      return result.ok ? Response.json(result.value, { status: 201 }) : refusal(result);
    },
    register: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await registerUpload(me.principal, owner, p.uploadId ?? '');
      return result.ok ? Response.json(result.value) : refusal(result);
    },
    confirm: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const parsed = ConfirmUploadRequest.safeParse(await body(request));
      if (!parsed.success) return invalid(parsed.error.issues);
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await confirmUpload(me.principal, owner, p.uploadId ?? '', parsed.data);
      return result.ok ? Response.json(result.value) : refusal(result);
    },
    remove: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await deleteUpload(me.principal, owner, p.uploadId ?? '');
      return result.ok ? Response.json(result.value) : refusal(result);
    },
    removeSample: async (request: Request, ctx: Ctx) => {
      const me = await caller(request);
      if (!me) return unauthorised();
      const { owner, p } = await ownerOf(kind, ctx);
      const result = await removeWorkSample(me.principal, owner, p.fileId ?? '');
      return result.ok ? Response.json(result.value) : refusal(result);
    },
  };
}

export function activityRoute(kind: Kind) {
  return async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const { owner } = await ownerOf(kind, ctx);
    const access = await accessFor(me.person.id, owner);
    if (!access?.readsActivity) return notAvailable();
    const params = Object.fromEntries(new URL(request.url).searchParams);
    const filter = activityFilter(kind, params, 'UTC');
    if (!filter.ok) return Response.json({ status: 400, message: filter.error }, { status: 400 });
    return Response.json(await activityFor(owner, filter.filter, ACTIVITY_PAGE_SIZE));
  };
}

export const formatRoutes = {
  list: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const { owner } = await ownerOf('organisation', ctx);
    const access = await accessFor(me.person.id, owner);
    if (!access?.steward) return notAvailable();
    return Response.json(await formatRows(owner.id));
  },
  add: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = AddFormatRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const { owner } = await ownerOf('organisation', ctx);
    const result = await addFormat(me.principal, owner.id, parsed.data);
    return result.ok ? Response.json(result.value, { status: 201 }) : refusal(result);
  },
  set: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const parsed = SetFormatRequest.safeParse(await body(request));
    if (!parsed.success) return invalid(parsed.error.issues);
    const { owner, p } = await ownerOf('organisation', ctx);
    const result = await setFormat(me.principal, owner.id, p.formatId ?? '', parsed.data);
    return result.ok ? Response.json(result.value) : refusal(result);
  },
  remove: async (request: Request, ctx: Ctx) => {
    const me = await caller(request);
    if (!me) return unauthorised();
    const { owner, p } = await ownerOf('organisation', ctx);
    const result = await removeFormat(me.principal, owner.id, p.formatId ?? '');
    return result.ok ? Response.json(result.value) : refusal(result);
  },
};
