import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  addPerson,
  addRecommendation,
  createOrganisation,
  decide,
  handOn,
  registerUpload,
  removePerson,
  requestUpload,
  sendForReview,
  setAreaApprovers,
  setProtectedHolder,
  setRoles,
  startProject,
  withdrawItem,
  type Principal,
} from '../src/record/commands';
import { approversOf, queueFor, sentBy, waitingOn } from '../src/record/review';
import { receiveUpload } from '../src/storage/storage';
import { PNG, pdfWithPages } from './support/documents';

// The slice 3 command layer and reads against the test database (layer1-gates-and-queue).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (text: string, values: unknown[] = []) => pool.query(text, values);

async function person(name: string): Promise<{ id: string; email: string }> {
  const id = randomUUID();
  const email = `${name.split(' ')[0]?.toLowerCase()}-${id}@xr.test`;
  await q('insert into person (id, email, name, first_signed_in_at) values ($1, $2, $3, now())', [id, email, name]);
  return { id, email };
}

const as = (personId: string): Principal => ({ type: 'person', personId, channel: 'dashboard' });
const asAgent = (personId: string): Principal => ({ type: 'agent-session', personId, channel: 'agent' });
const ok = <T>(r: { ok: true; value: T } | { ok: false }): T => {
  if (!r.ok) throw new Error(`refused: ${JSON.stringify(r)}`);
  return r.value;
};

let jordan: string;
let morgan: string;
let riley: string;
let sam: string;
let kai: string;
let orgId: string;
let projectId: string;

async function entries() {
  const rows = await q('select what, area, actor_person_id from activity_entry where project_id = $1 order by at, id', [projectId]);
  return rows.rows as { what: string; area: string; actor_person_id: string | null }[];
}

async function reviewFile(by: string, bytes: Uint8Array = PNG, fileName = 'keeper-sheet.png', mediaType = 'image/png') {
  const requested = ok(
    await requestUpload(as(by), { kind: 'project', id: projectId }, { requestId: randomUUID(), title: fileName, fileName, mediaType, size: bytes.length, purpose: 'review' }),
  );
  expect(await receiveUpload(requested.uploadUrl.split('/').at(-1) ?? '', bytes)).toEqual({ ok: true });
  return { uploadId: requested.uploadId, registered: await registerUpload(as(by), { kind: 'project', id: projectId }, requested.uploadId) };
}

async function send(by: string, title: string, handoff: string, waitingOn: string | null = null) {
  const { registered } = await reviewFile(by);
  const file = ok(registered);
  if (file.state !== 'stored') throw new Error(`file not stored: ${JSON.stringify(file)}`);
  return ok(await sendForReview(as(by), projectId, { title, handoff, whatChanged: 'Front and side views.', fileId: file.fileId, waitingOn }));
}

beforeAll(async () => {
  ({ id: jordan } = await person('Jordan Lee'));
  const m = await person('Morgan Ray');
  const r = await person('Riley Chen');
  const s = await person('Sam Okafor');
  const k = await person('Kai Morin');
  morgan = m.id;
  riley = r.id;
  sam = s.id;
  kai = k.id;
  orgId = ok(await createOrganisation(as(jordan), { name: `Org ${randomUUID()}`, stewardIds: [jordan] })).id;
  projectId = ok(await startProject(as(jordan), { name: `Lantern ${randomUUID()}`, brief: '', organisationId: orgId, ownerId: jordan })).id;
  ok(await addPerson(as(jordan), projectId, { email: m.email, name: 'Morgan Ray', roles: ['director'] }));
  ok(await addPerson(as(jordan), projectId, { email: r.email, name: 'Riley Chen', roles: ['artist'] }));
  ok(await addPerson(as(jordan), projectId, { email: s.email, name: 'Sam Okafor', roles: ['technical-artist'] }));
  ok(await addPerson(as(jordan), projectId, { email: k.email, name: 'Kai Morin', roles: ['performer'] }));
});

afterAll(async () => {
  await pool.end();
});

describe("a new project's owner holds every approval (layer1-gates-and-queue#AC-3)", () => {
  it('names the owner for all four areas and all four protected approvals, with no delegates', async () => {
    const a = await approversOf(projectId);
    expect(a.areas.map((x) => [x.area, x.approver?.id, x.delegate])).toEqual([
      ['creative', jordan, null],
      ['performance-and-behaviour', jordan, null],
      ['builds-and-operations', jordan, null],
      ['business', jordan, null],
    ]);
    expect(a.protected.map((x) => [x.approval, x.holder?.id])).toEqual([
      ['contracts-and-licence-terms', jordan],
      ['funding-applications-and-reports', jordan],
      ['publishing-and-marketing', jordan],
      ['audience-facing-safety-and-consent', jordan],
    ]);
  });
});

describe('only people who use the dashboard can be chosen (layer1-gates-and-queue#AC-8, AC-9, AC-12)', () => {
  it('refuses a performer, a stranger and the same person twice, changing nothing', async () => {
    const stranger = (await person('Stranger')).id;
    expect(await setAreaApprovers(as(jordan), projectId, 'creative', { approverId: kai, delegateId: null })).toMatchObject({ ok: false, status: 400 });
    expect(await setAreaApprovers(as(jordan), projectId, 'creative', { approverId: morgan, delegateId: stranger })).toMatchObject({ ok: false, status: 400 });
    expect(await setAreaApprovers(as(jordan), projectId, 'creative', { approverId: morgan, delegateId: morgan })).toMatchObject({
      ok: false,
      status: 400,
      fields: { delegate: 'Choose someone other than the approver as delegate, or No delegate.' },
    });
    expect(await setProtectedHolder(as(jordan), projectId, 'publishing-and-marketing', { holderId: kai })).toMatchObject({ ok: false, status: 400 });
    expect((await approversOf(projectId)).areas[0]?.approver?.id).toBe(jordan);
  });

  it('refuses people without Director or Producer, and agent sessions', async () => {
    expect(await setAreaApprovers(as(riley), projectId, 'creative', { approverId: riley, delegateId: null })).toMatchObject({ ok: false, status: 403 });
    expect(await setAreaApprovers(asAgent(jordan), projectId, 'creative', { approverId: morgan, delegateId: null })).toMatchObject({ ok: false, status: 403 });
    expect(await setProtectedHolder(asAgent(jordan), projectId, 'publishing-and-marketing', { holderId: morgan })).toMatchObject({ ok: false, status: 403 });
  });

  it('saves an area and a holder, and logs each under Approvers', async () => {
    ok(await setAreaApprovers(as(jordan), projectId, 'creative', { approverId: morgan, delegateId: sam }));
    ok(await setAreaApprovers(as(morgan), projectId, 'performance-and-behaviour', { approverId: morgan, delegateId: null }));
    ok(await setProtectedHolder(as(jordan), projectId, 'publishing-and-marketing', { holderId: morgan }));
    const log = (await entries()).slice(-3);
    expect(log).toEqual([
      { what: 'Named Morgan Ray as approver and Sam Okafor as delegate for Creative', area: 'Approvers', actor_person_id: jordan },
      { what: 'Named Morgan Ray as approver and no delegate for Performance and behaviour', area: 'Approvers', actor_person_id: morgan },
      { what: 'Gave the publishing and marketing approval to Morgan Ray', area: 'Approvers', actor_person_id: jordan },
    ]);
  });

  it('cannot store an agent: assignments reference people', async () => {
    await expect(
      q("update approval_assignment set approver_id = $1 where project_id = $2 and slot = 'area:creative'", [randomUUID(), projectId]),
    ).rejects.toThrow();
  });
});

describe('someone who approves cannot be removed (layer1-gates-and-queue#AC-11)', () => {
  it('refuses removing Sam, or leaving Sam with no dashboard role, with what Sam holds', async () => {
    ok(await setAreaApprovers(as(jordan), projectId, 'builds-and-operations', { approverId: sam, delegateId: null }));
    const removed = await removePerson(as(jordan), projectId, sam);
    expect(removed).toMatchObject({
      ok: false,
      status: 409,
      message: 'Sam approves Builds and operations and is the delegate for Creative. Give those to someone else on Approvers first, so that no item waits for a person who has left.',
    });
    expect(await setRoles(as(jordan), projectId, sam, { roles: ['performer'] })).toMatchObject({ ok: false, status: 409, message: removed.ok ? '' : removed.message });
    ok(await setAreaApprovers(as(jordan), projectId, 'builds-and-operations', { approverId: jordan, delegateId: null }));
  });
});

describe('send work for review (layer1-gates-and-queue#AC-15, AC-16, AC-17, AC-37)', () => {
  it('stores a review file as a file, never as a work sample', async () => {
    const { registered } = await reviewFile(riley);
    expect(ok(registered)).toMatchObject({ state: 'stored' });
    const samples = await q("select count(*)::int as n from fact_version where project_id = $1 and fact = 'work-samples'", [projectId]);
    expect(samples.rows[0].n).toBe(0);
  });

  it('refuses a file type review does not take', async () => {
    const refused = await requestUpload(as(riley), { kind: 'project', id: projectId }, { requestId: randomUUID(), title: 'x', fileName: 'x.zip', mediaType: 'application/zip', size: 10, purpose: 'review' });
    expect(refused).toMatchObject({ ok: false, status: 400, fields: { file: 'Choose a video, image, audio, PDF, Word or 3D model file.' } });
  });

  it('puts the item at the gate with who sent it, and logs it without what changed', async () => {
    const sent = await send(riley, 'Lantern Keeper character sheet', 'character-design', 'mesh-and-rig');
    expect(sent).toMatchObject({ movedOn: false, deciders: ['Morgan Ray', 'Sam Okafor'] });
    const row = (await q('select title, handoff, waiting_handoff, sent_by from review_item where id = $1', [sent.itemId])).rows[0];
    expect(row).toEqual({ title: 'Lantern Keeper character sheet', handoff: 'character-design', waiting_handoff: 'mesh-and-rig', sent_by: riley });
    const last = (await entries()).at(-1);
    expect(last).toEqual({ what: 'Sent Lantern Keeper character sheet for review (Character design)', area: 'Review', actor_person_id: riley });
  });

  it('refuses missing and over-long fields, and agent sessions', async () => {
    const empty = await sendForReview(as(riley), projectId, { title: ' ', handoff: '', whatChanged: '', fileId: null, waitingOn: null });
    expect(empty).toMatchObject({
      ok: false,
      status: 400,
      fields: { title: 'Enter a title.', handoff: 'Choose the stage this work is at.', whatChanged: 'Say what changed.', file: 'Choose a file to send.' },
    });
    const long = await sendForReview(as(riley), projectId, { title: 'x'.repeat(121), handoff: 'character-design', whatChanged: 'y'.repeat(2001), fileId: null, waitingOn: null });
    expect(long).toMatchObject({ fields: { title: 'Keep the title to 120 characters or fewer.', whatChanged: 'Keep what changed to 2,000 characters or fewer.' } });
    expect(await sendForReview(asAgent(riley), projectId, { title: 'x', handoff: 'character-design', whatChanged: 'y', fileId: null, waitingOn: null })).toMatchObject({ ok: false, status: 403 });
  });
});

describe('identifiers in review text and files (layer1-gates-and-queue#AC-18)', () => {
  it('holds text that looks like an identifier, and sends it once confirmed', async () => {
    const { registered } = await reviewFile(riley);
    const file = ok(registered);
    if (file.state !== 'stored') throw new Error('not stored');
    const input = { title: 'Prop list', handoff: 'look-and-concept-art', whatChanged: 'Catalogue number 046 454 286 added.', fileId: file.fileId, waitingOn: null };
    const held = await sendForReview(as(riley), projectId, input);
    expect(held).toMatchObject({ ok: false, status: 400, held: [{ field: 'whatChanged', text: '046 454 286' }] });
    const sent = ok(await sendForReview(as(riley), projectId, { ...input, answer: 'A catalogue number' }));
    const confirmations = await q('select count(*)::int as n from identifier_confirmation where review_item_id = $1', [sent.itemId]);
    expect(confirmations.rows[0].n).toBe(1);
  });

  it('holds a PDF whose text matches', async () => {
    const { registered } = await reviewFile(riley, pdfWithPages(['Account 00123-004-1234567']), 'licence.pdf', 'application/pdf');
    expect(ok(registered)).toMatchObject({ state: 'held' });
  });
});

describe('work at a hand-off not on the gate list moves on (layer1-gates-and-queue#AC-19)', () => {
  it('makes no item for a build for rehearsal, and logs that it moved on', async () => {
    const before = (await q('select count(*)::int as n from review_item where project_id = $1', [projectId])).rows[0].n;
    const moved = ok(await sendForReview(as(sam), projectId, { title: 'Rehearsal build 4', handoff: 'build-for-rehearsal', whatChanged: 'Fog fix.', fileId: null, waitingOn: null }));
    expect(moved).toMatchObject({ movedOn: true });
    expect((await q('select count(*)::int as n from review_item where project_id = $1', [projectId])).rows[0].n).toBe(before);
    expect((await entries()).at(-1)).toMatchObject({ what: 'Moved Rehearsal build 4 on (Build for rehearsal is not gated)', area: 'Review' });
  });
});

describe('the queue shows only what you can decide, in order (layer1-gates-and-queue#AC-10, AC-20, AC-21)', () => {
  it('groups by stage with blocking groups first, and follows a change of approver', async () => {
    const env = await send(riley, `Harbour ${randomUUID()}`, 'environments');
    const blocking = await send(riley, `Pilot ${randomUUID()}`, 'visual-effects', 'interaction-design');
    const contract = await send(riley, `Licence ${randomUUID()}`, 'contracts-and-licence-terms');
    const morganQueue = await queueFor(morgan, projectId, {});
    const ids = morganQueue.groups.flatMap((g) => g.items.map((i) => i.id));
    expect(ids).toContain(env.itemId);
    expect(ids).not.toContain(contract.itemId);
    expect(morganQueue.groups[0]?.items.some((i) => i.blocking)).toBe(true);
    const fx = morganQueue.groups.find((g) => g.handoff === 'visual-effects');
    expect(fx?.items[0]?.id).toBe(blocking.itemId);
    expect((await queueFor(jordan, projectId, {})).groups.flatMap((g) => g.items.map((i) => i.id))).toContain(contract.itemId);
    expect((await queueFor(riley, projectId, {})).decidesAnything).toBe(false);

    ok(await setProtectedHolder(as(jordan), projectId, 'contracts-and-licence-terms', { holderId: morgan }));
    expect((await queueFor(morgan, projectId, {})).groups.flatMap((g) => g.items.map((i) => i.id))).toContain(contract.itemId);
    expect((await queueFor(jordan, projectId, {})).groups.flatMap((g) => g.items.map((i) => i.id))).not.toContain(contract.itemId);
    ok(await setProtectedHolder(as(jordan), projectId, 'contracts-and-licence-terms', { holderId: jordan }));
  });
});

describe('decide on one item, once (layer1-gates-and-queue#AC-26, AC-27, AC-28, AC-37)', () => {
  it('records accept, revise and reject with who and when, and logs none of the feedback', async () => {
    const a = await send(riley, `Accept ${randomUUID()}`, 'character-design');
    const r = await send(riley, `Revise ${randomUUID()}`, 'character-design');
    const j = await send(riley, `Reject ${randomUUID()}`, 'character-design');
    expect(await decide(as(morgan), projectId, [r.itemId], { decision: 'revise', feedback: ' ' })).toMatchObject({
      ok: false,
      status: 400,
      fields: { feedback: 'Write feedback for Riley Chen: say what to change.' },
    });
    expect(await decide(as(morgan), projectId, [r.itemId], { decision: 'revise', feedback: 'z'.repeat(2001) })).toMatchObject({
      fields: { feedback: 'Keep your feedback to 2,000 characters or fewer.' },
    });
    ok(await decide(as(morgan), projectId, [a.itemId], { decision: 'accept', feedback: '' }));
    ok(await decide(as(sam), projectId, [r.itemId], { decision: 'revise', feedback: 'Warmer light in the lamp room.' }));
    ok(await decide(as(morgan), projectId, [j.itemId], { decision: 'reject', feedback: '' }));
    const rows = (await q('select item_id, decision, feedback, decided_by from review_decision where item_id = any($1) order by decided_at', [[a.itemId, r.itemId, j.itemId]])).rows;
    expect(rows.map((x) => [x.decision, x.decided_by])).toEqual([
      ['accept', morgan],
      ['revise', sam],
      ['reject', morgan],
    ]);
    const log = (await entries()).slice(-3).map((e) => e.what);
    expect(log[1]).toMatch(/^Requested a revision of Revise /);
    expect(log.join('\n')).not.toContain('Warmer light');
  });

  it('refuses a second decision by anyone, naming the first', async () => {
    const item = await send(riley, `Twice ${randomUUID()}`, 'environments');
    ok(await decide(as(sam), projectId, [item.itemId], { decision: 'accept', feedback: '' }));
    const second = ok(await decide(as(morgan), projectId, [item.itemId], { decision: 'reject', feedback: '' }));
    expect(second.decided).toEqual([]);
    expect(second.skipped).toMatchObject([{ id: item.itemId, by: 'Sam Okafor', decision: 'accept' }]);
    await expect(q('update review_decision set decision = $1 where item_id = $2', ['reject', item.itemId])).rejects.toThrow();
    await expect(q('insert into review_decision (id, item_id, decision, feedback, decided_by, decided_at) values ($1, $2, $3, $4, $5, now())', [randomUUID(), item.itemId, 'reject', '', morgan])).rejects.toThrow();
  });

  it('refuses people who cannot decide the item, and agent sessions', async () => {
    const item = await send(riley, `Not yours ${randomUUID()}`, 'contracts-and-licence-terms');
    expect(await decide(as(morgan), projectId, [item.itemId], { decision: 'accept', feedback: '' })).toMatchObject({ ok: false, status: 403 });
    expect(await decide(asAgent(jordan), projectId, [item.itemId], { decision: 'accept', feedback: '' })).toMatchObject({ ok: false, status: 403 });
  });
});

describe('decide on several items at once (layer1-gates-and-queue#AC-29)', () => {
  it('decides each still waiting, with one feedback, and names the ones decided meanwhile', async () => {
    const one = await send(riley, `One ${randomUUID()}`, 'sound-and-music');
    const two = await send(riley, `Two ${randomUUID()}`, 'sound-and-music');
    ok(await decide(as(sam), projectId, [two.itemId], { decision: 'accept', feedback: '' }));
    const batch = ok(await decide(as(morgan), projectId, [one.itemId, two.itemId], { decision: 'revise', feedback: 'Shorter, please.' }));
    expect(batch.decided.map((d) => d.id)).toEqual([one.itemId]);
    expect(batch.skipped.map((d) => d.id)).toEqual([two.itemId]);
    expect(await decide(as(morgan), projectId, [], { decision: 'accept', feedback: '' })).toMatchObject({ ok: false, status: 400, message: 'Select at least one item.' });
  });
});

describe('an AI recommendation cannot pass the gate (layer1-gates-and-queue#AC-30)', () => {
  it('is added only by an agent session, shown, and leaves the item waiting', async () => {
    const item = await send(riley, `Recommended ${randomUUID()}`, 'mesh-and-rig');
    expect(await addRecommendation(as(morgan), projectId, item.itemId, { result: 'accept', reason: 'Fine.' })).toMatchObject({ ok: false, status: 403 });
    ok(await addRecommendation(asAgent(jordan), projectId, item.itemId, { result: 'accept', reason: 'The proportions match the accepted concept art.' }));
    const queued = (await queueFor(morgan, projectId, {})).groups.flatMap((g) => g.items).find((i) => i.id === item.itemId);
    expect(queued?.recommendation).toEqual({ result: 'accept', reason: 'The proportions match the accepted concept art.' });
    expect((await q('select count(*)::int as n from review_decision where item_id = $1', [item.itemId])).rows[0].n).toBe(0);
    expect(await handOn(asAgent(morgan), projectId, item.itemId)).toMatchObject({ ok: false, status: 403 });
    expect(await withdrawItem(asAgent(riley), projectId, item.itemId)).toMatchObject({ ok: false, status: 403 });
  });
});

describe('hand an item to your delegate (layer1-gates-and-queue#AC-31, AC-23)', () => {
  it('marks the item handed, filters by it, and both can still decide', async () => {
    const item = await send(riley, `Handed ${randomUUID()}`, 'environments');
    expect(await handOn(as(sam), projectId, item.itemId)).toMatchObject({ ok: false, status: 403 });
    expect(ok(await handOn(as(morgan), projectId, item.itemId))).toEqual({ to: 'Sam Okafor', title: expect.any(String) });
    const handed = await queueFor(sam, projectId, { handedTo: 'you' });
    expect(handed.groups.flatMap((g) => g.items.map((i) => i.id))).toEqual([item.itemId]);
    expect((await queueFor(morgan, projectId, { handedTo: sam })).groups.flatMap((g) => g.items.map((i) => i.id))).toContain(item.itemId);
    expect((await queueFor(morgan, projectId, { handedTo: 'none' })).groups.flatMap((g) => g.items.map((i) => i.id))).not.toContain(item.itemId);
    expect((await entries()).at(-1)).toMatchObject({ what: `Handed ${item.title} to Sam Okafor`, area: 'Review' });
    ok(await decide(as(morgan), projectId, [item.itemId], { decision: 'accept', feedback: '' }));
    const contract = await send(riley, `Licence ${randomUUID()}`, 'contracts-and-licence-terms');
    expect(await handOn(as(jordan), projectId, contract.itemId)).toMatchObject({ ok: false, status: 409 });
  });
});

describe('decide your own item (layer1-gates-and-queue#AC-32)', () => {
  it('lets a decider decide an item they sent', async () => {
    const item = await send(morgan, `Own ${randomUUID()}`, 'cue-list');
    expect(ok(await decide(as(morgan), projectId, [item.itemId], { decision: 'accept', feedback: '' })).decided).toHaveLength(1);
  });
});

describe('withdraw something you sent (layer1-gates-and-queue#AC-33, AC-34)', () => {
  it('withdraws while waiting, only by the sender, and refuses once decided', async () => {
    const item = await send(riley, `Withdrawn ${randomUUID()}`, 'look-and-concept-art');
    expect(await withdrawItem(as(morgan), projectId, item.itemId)).toMatchObject({ ok: false, status: 403 });
    expect(ok(await withdrawItem(as(riley), projectId, item.itemId))).toMatchObject({ deciders: ['Morgan Ray', 'Sam Okafor'] });
    expect((await entries()).at(-1)).toMatchObject({ what: `Withdrew ${item.title}`, area: 'Review' });
    const decided = await send(riley, `Decided ${randomUUID()}`, 'look-and-concept-art');
    ok(await decide(as(morgan), projectId, [decided.itemId], { decision: 'accept', feedback: '' }));
    const refused = await withdrawItem(as(riley), projectId, decided.itemId);
    expect(refused).toMatchObject({ ok: false, status: 409 });
    expect(refused.ok ? '' : refused.message).toMatch(/^Not withdrawn: Morgan Ray accepted it at \d\d:\d\d on \d+ \w+\.$/);
    const mine = await sentBy(riley, projectId);
    expect(mine.find((s) => s.id === item.itemId)?.state).toBe('withdraw');
    expect(mine.find((s) => s.id === decided.itemId)?.state).toBe('accept');
  });
});

describe('everything waiting (layer1-gates-and-queue#AC-36)', () => {
  it('lists every waiting item oldest first, with who it waits for', async () => {
    const item = await send(riley, `Waiting ${randomUUID()}`, 'contracts-and-licence-terms');
    const all = await waitingOn(projectId, riley);
    const row = all.find((w) => w.id === item.itemId);
    expect(row?.waitingFor).toBe('Jordan Lee');
    const times = all.map((w) => w.sentAt.getTime());
    expect([...times].sort((x, y) => x - y)).toEqual(times);
    expect(all.every((w) => w.state === 'waiting')).toBe(true);
  });
});
