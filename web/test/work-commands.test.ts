import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  addFeedback,
  addFormat,
  addPerson,
  addWork,
  changeOwner,
  createOrganisation,
  decide,
  handOn,
  registerUpload,
  removePerson,
  removeWork,
  requestUpload,
  restoreVersion,
  sendForReview,
  setAreaApprovers,
  startProject,
  withdrawItem,
  type Principal,
} from '../src/record/commands';
import { boardFor, whatNeedsYou, workFor } from '../src/record/work';
import { receiveUpload } from '../src/storage/storage';
import { PNG, pdfWithPages } from './support/documents';

// Pieces of work, versions, feedback and the reads behind the board and What needs you, against
// the test database (layer1-versions-board-first-view).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (text: string, values: unknown[] = []) => pool.query(text, values);

async function person(name: string): Promise<{ id: string; email: string }> {
  const id = randomUUID();
  const email = `${name.split(' ')[0]?.toLowerCase()}-${id}@xr.test`;
  await q('insert into person (id, email, name, first_signed_in_at) values ($1, $2, $3, now())', [id, email, name]);
  return { id, email };
}

// Titles are checked for identifiers, so made-up ones use letters only.
const tag = () => randomUUID().replace(/\d/g, (d) => String.fromCharCode(103 + Number(d)));

async function asApp(statement: string, values: unknown[]): Promise<string> {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query('set local role xr_app');
    await client.query(statement, values);
    return 'allowed';
  } catch (error) {
    return (error as { code?: string }).code ?? 'error';
  } finally {
    await client.query('rollback');
    client.release();
  }
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
let drew: string;
let orgId: string;
let projectId: string;

async function entries() {
  const rows = await q('select what, area, actor_person_id from activity_entry where project_id = $1 order by at, id', [projectId]);
  return rows.rows as { what: string; area: string; actor_person_id: string | null }[];
}

async function storedFile(by: string, bytes: Uint8Array = PNG, fileName = 'sheet.png', mediaType = 'image/png', project = projectId) {
  const requested = ok(
    await requestUpload(as(by), { kind: 'project', id: project }, { requestId: randomUUID(), title: fileName, fileName, mediaType, size: bytes.length, purpose: 'review' }),
  );
  expect(await receiveUpload(requested.uploadUrl.split('/').at(-1) ?? '', bytes)).toEqual({ ok: true });
  const file = ok(await registerUpload(as(by), { kind: 'project', id: project }, requested.uploadId));
  if (file.state !== 'stored') throw new Error(`file not stored: ${JSON.stringify(file)}`);
  return file.fileId;
}

async function send(by: string, input: { title?: string; handoff?: string; workId?: string; waitingOn?: string | null; project?: string }) {
  const project = input.project ?? projectId;
  const fileId = await storedFile(by, PNG, 'sheet.png', 'image/png', project);
  const sent = ok(
    await sendForReview(as(by), project, {
      title: input.title ?? '',
      handoff: input.handoff ?? '',
      whatChanged: 'Front and side views.',
      fileId,
      waitingOn: input.waitingOn ?? null,
      workId: input.workId ?? null,
    }),
  );
  if (sent.movedOn) throw new Error('not gated');
  return sent;
}

const board = async (project = projectId) => (await boardFor(project)).work;
const row = async (workId: string) => (await board()).find((w) => w.id === workId);

beforeAll(async () => {
  ({ id: jordan } = await person('Jordan Lee'));
  const m = await person('Morgan Ray');
  const r = await person('Riley Chen');
  const s = await person('Sam Okafor');
  const d = await person('Drew Patel');
  morgan = m.id;
  riley = r.id;
  sam = s.id;
  drew = d.id;
  orgId = ok(await createOrganisation(as(jordan), { name: `Org ${tag()}`, stewardIds: [jordan] })).id;
  projectId = ok(await startProject(as(jordan), { name: `Lantern ${tag()}`, brief: '', organisationId: orgId, ownerId: jordan })).id;
  ok(await addPerson(as(jordan), projectId, { email: m.email, name: 'Morgan Ray', roles: ['director'] }));
  ok(await addPerson(as(jordan), projectId, { email: r.email, name: 'Riley Chen', roles: ['artist'] }));
  ok(await addPerson(as(jordan), projectId, { email: s.email, name: 'Sam Okafor', roles: ['technical-artist'] }));
  ok(await addPerson(as(jordan), projectId, { email: d.email, name: 'Drew Patel', roles: ['sound-designer'] }));
  ok(await setAreaApprovers(as(jordan), projectId, 'creative', { approverId: morgan, delegateId: sam }));
});

afterAll(async () => {
  await pool.end();
});

describe('every item is a version of a piece of work (layer1-versions-board-first-view#AC-1, AC-2)', () => {
  it('makes a piece of work owned by the sender, with the item as version 1', async () => {
    const title = `Lighthouse concept ${tag()}`;
    const sent = await send(riley, { title, handoff: 'look-and-concept-art' });
    expect(sent).toMatchObject({ version: 1, title });
    const w = await row(sent.workId);
    expect(w).toMatchObject({ title, handoff: 'look-and-concept-art', owner: { id: riley, display: 'Riley Chen', gone: false }, state: 'waiting' });
    expect(w?.latest).toMatchObject({ itemId: sent.itemId, version: 1, state: 'waiting' });
  });

  it('adds the next version with the work’s title and stage, whoever sends it', async () => {
    const first = await send(riley, { title: `Ferry pilot ${tag()}`, handoff: 'character-design' });
    ok(await decide(as(morgan), projectId, [first.itemId], { decision: 'revise', feedback: 'Shorten the coat.' }));
    const second = await send(sam, { workId: first.workId, title: 'ignored', handoff: 'environments' });
    expect(second).toMatchObject({ workId: first.workId, version: 2, title: first.title });
    const w = await workFor(projectId, first.workId);
    expect(w?.handoff).toBe('character-design');
    expect(w?.versions.map((v) => [v.version, v.sentBy.display])).toEqual([
      [2, 'Sam Okafor'],
      [1, 'Riley Chen'],
    ]);
    const stored = await q('select work_id, version from review_item where id = $1', [second.itemId]);
    expect(stored.rows[0]).toEqual({ work_id: first.workId, version: 2 });
  });

  it('refuses a second row with the same work and number', async () => {
    const first = await send(riley, { title: `Bell sounds ${tag()}`, handoff: 'sound-and-music' });
    await expect(
      q(
        "insert into review_item (id, project_id, handoff, title, what_changed, sent_by, work_id, version) values ($1, $2, 'sound-and-music', 'x', 'x', $3, $4, 1)",
        [randomUUID(), projectId, riley, first.workId],
      ),
    ).rejects.toThrow();
  });
});

describe('only one version waits at a time (layer1-versions-board-first-view#AC-3)', () => {
  it('refuses a send while a version waits, even two sends at once', async () => {
    const first = await send(riley, { title: `Harbour set ${tag()}`, handoff: 'environments' });
    const fileId = await storedFile(riley);
    const again = await sendForReview(as(riley), projectId, { title: '', handoff: '', whatChanged: 'More fog.', fileId, waitingOn: null, workId: first.workId });
    expect(again).toMatchObject({ ok: false, status: 409, message: `Not sent: version 1 of ${first.title} is waiting for review. Withdraw it first.` });

    ok(await withdrawItem(as(riley), projectId, first.itemId));
    const both = await Promise.all(
      [1, 2].map(async () =>
        sendForReview(as(riley), projectId, { title: '', handoff: '', whatChanged: 'More fog.', fileId: await storedFile(riley), waitingOn: null, workId: first.workId }),
      ),
    );
    expect(both.filter((r) => r.ok)).toHaveLength(1);
    expect(both.filter((r) => !r.ok)).toMatchObject([{ status: 409 }]);
  });
});

describe('work and stage states on the board (layer1-versions-board-first-view#AC-4, AC-8)', () => {
  it('works out states from the queue on every read', async () => {
    const mesh = ok(await addWork(as(jordan), projectId, { title: `Keeper mesh ${tag()}`, handoff: 'mesh-and-rig', ownerId: sam }));
    expect((await row(mesh.workId))?.state).toBe('in-progress');
    const sheet = await send(riley, { title: `Keeper sheet ${tag()}`, handoff: 'character-design', waitingOn: 'mesh-and-rig' });
    expect(await row(mesh.workId)).toMatchObject({ state: 'blocked', blockedBy: { itemId: sheet.itemId, title: sheet.title, handoff: 'character-design' } });
    expect((await row(sheet.workId))?.state).toBe('waiting');
    ok(await handOn(as(morgan), projectId, sheet.itemId));
    expect((await row(sheet.workId))?.latest).toMatchObject({ handedTo: { id: sam } });
    ok(await decide(as(sam), projectId, [sheet.itemId], { decision: 'accept', feedback: '' }));
    expect((await row(sheet.workId))?.state).toBe('done');
    expect((await row(mesh.workId))?.state).toBe('in-progress');
  });

  it('shows an owner who left the project', async () => {
    const left = await person('Alex Kim');
    ok(await addPerson(as(jordan), projectId, { email: left.email, name: 'Alex Kim', roles: ['show-operator'] }));
    const cue = ok(await addWork(as(jordan), projectId, { title: `Cue list ${tag()}`, handoff: 'cue-list', ownerId: left.id }));
    ok(await removePerson(as(jordan), projectId, left.id));
    expect((await row(cue.workId))?.owner).toEqual({ id: left.id, display: 'Alex Kim', gone: true });
  });
});

describe('add work, change the owner and remove work (layer1-versions-board-first-view#AC-13 to AC-17, AC-41)', () => {
  it('adds work for an owner and logs it', async () => {
    const title = `Harbour ambience ${tag()}`;
    const added = ok(await addWork(as(jordan), projectId, { title, handoff: 'sound-and-music', ownerId: drew }));
    expect(added).toMatchObject({ title, stage: 'Sound and music', owner: 'Drew Patel' });
    const w = await workFor(projectId, added.workId);
    expect(w).toMatchObject({ addedBy: { id: jordan, display: 'Jordan Lee' }, versions: [] });
    expect((await entries()).at(-1)).toEqual({ what: `Added work ${title} (Sound and music) for Drew Patel`, area: 'Review', actor_person_id: jordan });
  });

  it('checks the fields and the title for identifiers', async () => {
    expect(await addWork(as(jordan), projectId, { title: '', handoff: '', ownerId: '' })).toMatchObject({
      ok: false,
      status: 400,
      fields: { title: 'Enter a title.', handoff: 'Choose the stage this work is at.', owner: 'Choose who owns this work.' },
    });
    expect(await addWork(as(jordan), projectId, { title: 'x'.repeat(121), handoff: 'sound-and-music', ownerId: drew })).toMatchObject({
      fields: { title: 'Keep the title to 120 characters or fewer.' },
    });
    const held = await addWork(as(jordan), projectId, { title: 'Payee 046 454 286', handoff: 'sound-and-music', ownerId: drew });
    expect(held).toMatchObject({ ok: false, status: 400, held: [{ field: 'title', text: '046 454 286' }] });
    ok(await addWork(as(jordan), projectId, { title: 'Payee 046 454 286', handoff: 'sound-and-music', ownerId: drew, answer: 'A catalogue number' }));
  });

  it('changes the owner, and removes work with no versions only', async () => {
    const title = `Harbour children ${tag()}`;
    const w = ok(await addWork(as(morgan), projectId, { title, handoff: 'character-design', ownerId: drew }));
    expect(ok(await changeOwner(as(jordan), projectId, w.workId, { ownerId: riley }))).toEqual({ title, owner: 'Riley Chen' });
    expect((await row(w.workId))?.owner.id).toBe(riley);
    ok(await removeWork(as(jordan), projectId, w.workId));
    expect(await row(w.workId)).toBeUndefined();
    expect((await entries()).slice(-2).map((e) => e.what)).toEqual([`Changed the owner of ${title} to Riley Chen`, `Removed work ${title}`]);

    const sent = await send(riley, { title: `Lamp room ${tag()}`, handoff: 'environments' });
    const refused = await removeWork(as(jordan), projectId, sent.workId);
    expect(refused).toMatchObject({ ok: false, status: 409 });
    expect(refused.ok ? '' : refused.message).toMatch(/^Not removed: Riley Chen sent version 1 at \d\d:\d\d\. Work with versions stays on the board\.$/);
  });

  it('refuses everyone but directors and producers, and agents', async () => {
    const w = ok(await addWork(as(jordan), projectId, { title: `Prop ${tag()}`, handoff: 'environments', ownerId: riley }));
    expect(await addWork(as(riley), projectId, { title: 'Mine', handoff: 'environments', ownerId: riley })).toMatchObject({ ok: false, status: 403 });
    expect(await changeOwner(as(riley), projectId, w.workId, { ownerId: riley })).toMatchObject({ ok: false, status: 403 });
    expect(await removeWork(as(sam), projectId, w.workId)).toMatchObject({ ok: false, status: 403 });
    expect(await addWork(asAgent(jordan), projectId, { title: 'Agent', handoff: 'environments', ownerId: riley })).toMatchObject({ ok: false, status: 403 });
    expect(await changeOwner(asAgent(jordan), projectId, w.workId, { ownerId: riley })).toMatchObject({ ok: false, status: 403 });
    expect(await removeWork(asAgent(jordan), projectId, w.workId)).toMatchObject({ ok: false, status: 403 });
  });

  it('only gives work to people on the project who use the dashboard', async () => {
    const stranger = await person('Stranger');
    expect(await addWork(as(jordan), projectId, { title: 'Stray', handoff: 'environments', ownerId: stranger.id })).toMatchObject({
      ok: false,
      status: 400,
      fields: { owner: 'Choose who owns this work.' },
    });
  });
});

describe('feedback on a version (layer1-versions-board-first-view#AC-19, AC-22 to AC-24, AC-41)', () => {
  it('adds feedback to any version, beside the decision feedback, and logs it without the text', async () => {
    const first = await send(riley, { title: `Lighthouse ${tag()}`, handoff: 'look-and-concept-art' });
    ok(await addFeedback(as(sam), projectId, first.itemId, { text: 'Stairs need a second rig.' }));
    ok(await decide(as(morgan), projectId, [first.itemId], { decision: 'revise', feedback: 'Go back to the first stairs.' }));
    ok(await addFeedback(as(riley), projectId, first.itemId, { text: 'Understood.' }));
    const w = await workFor(projectId, first.workId);
    expect(w?.versions[0]?.feedback.map((f) => [f.by, f.text, f.decision])).toEqual([
      ['Sam Okafor', 'Stairs need a second rig.', null],
      ['Morgan Ray', 'Go back to the first stairs.', 'revise'],
      ['Riley Chen', 'Understood.', null],
    ]);
    const log = await entries();
    expect(log.at(-1)).toEqual({ what: `Added feedback on ${first.title}, version 1`, area: 'Review', actor_person_id: riley });
    expect(log.some((e) => e.what.includes('Understood'))).toBe(false);
  });

  it('checks the text, and refuses agents', async () => {
    const sent = await send(riley, { title: `Prop ${tag()}`, handoff: 'environments' });
    expect(await addFeedback(as(sam), projectId, sent.itemId, { text: '  ' })).toMatchObject({ fields: { text: 'Write your feedback before adding it.' } });
    expect(await addFeedback(as(sam), projectId, sent.itemId, { text: 'x'.repeat(2001) })).toMatchObject({ fields: { text: 'Keep feedback to 2,000 characters or fewer.' } });
    expect(await addFeedback(as(sam), projectId, sent.itemId, { text: 'Pay 046 454 286' })).toMatchObject({ ok: false, held: [{ field: 'text' }] });
    expect(await addFeedback(asAgent(sam), projectId, sent.itemId, { text: 'Fine.' })).toMatchObject({ ok: false, status: 403 });
  });

  it('feedback cannot be changed: the application role may not update or delete it', async () => {
    const sent = await send(riley, { title: `Rope ${tag()}`, handoff: 'environments' });
    ok(await addFeedback(as(sam), projectId, sent.itemId, { text: 'Fine.' }));
    expect(await asApp("update work_feedback set text = 'changed' where item_id = $1", [sent.itemId])).toBe('42501');
    expect(await asApp('delete from work_feedback where item_id = $1', [sent.itemId])).toBe('42501');
    expect(await asApp('select * from work_feedback where item_id = $1', [sent.itemId])).toBe('allowed');
  });
});

describe('restore an earlier version (layer1-versions-board-first-view#AC-30, AC-31, AC-41)', () => {
  it('sends the earlier file as the next version and keeps every version', async () => {
    const first = await send(riley, { title: `Lighthouse ${tag()}`, handoff: 'look-and-concept-art' });
    ok(await decide(as(morgan), projectId, [first.itemId], { decision: 'accept', feedback: 'Good start.' }));
    const second = await send(riley, { workId: first.workId });
    ok(await decide(as(morgan), projectId, [second.itemId], { decision: 'revise', feedback: 'Go back to version 1.' }));
    const restored = ok(await restoreVersion(as(riley), projectId, first.workId, { version: 1, whatChanged: 'Restored version 1. As asked.' }));
    expect(restored).toMatchObject({ version: 3, restored: 1, deciders: ['Morgan Ray', 'Sam Okafor'] });
    const w = await workFor(projectId, first.workId);
    expect(w?.versions.map((v) => [v.version, v.state, v.restoredFrom])).toEqual([
      [3, 'waiting', 1],
      [2, 'revise', null],
      [1, 'accept', null],
    ]);
    expect(w?.versions[0]?.file?.id).toBe(w?.versions[2]?.file?.id);
    expect(w?.versions[2]?.feedback.map((f) => f.text)).toEqual(['Good start.']);
    expect((await entries()).at(-1)?.what).toBe(`Restored ${first.title} version 1 as version 3`);
  });

  it('refuses while a version waits, and refuses agents', async () => {
    const first = await send(riley, { title: `Sail ${tag()}`, handoff: 'environments' });
    ok(await decide(as(morgan), projectId, [first.itemId], { decision: 'revise', feedback: 'More wind.' }));
    const second = await send(riley, { workId: first.workId });
    const refused = await restoreVersion(as(sam), projectId, first.workId, { version: 1, whatChanged: 'Restored version 1.' });
    expect(refused).toMatchObject({ ok: false, status: 409 });
    expect(refused.ok ? '' : refused.message).toMatch(
      /^Not restored: Riley Chen sent version 2 at \d\d:\d\d, and it is waiting for review\. Withdraw it first to restore an earlier version\.$/,
    );
    ok(await withdrawItem(as(riley), projectId, second.itemId));
    expect(await restoreVersion(asAgent(riley), projectId, first.workId, { version: 1, whatChanged: 'Restored version 1.' })).toMatchObject({ ok: false, status: 403 });
    expect(await restoreVersion(as(riley), projectId, first.workId, { version: 9, whatChanged: 'Restored version 9.' })).toMatchObject({ ok: false, status: 404 });
  });

  it('checks a restored document again against formats added since', async () => {
    const pdf = pdfWithPages([`Prop ${'123'}-XY-45678`]);
    const fileId = await storedFile(riley, pdf, 'props.pdf', 'application/pdf');
    const sent = ok(
      await sendForReview(as(riley), projectId, { title: `Props ${tag()}`, handoff: 'environments', whatChanged: 'List.', fileId, waitingOn: null, workId: null }),
    );
    if (sent.movedOn) throw new Error('not gated');
    ok(await decide(as(morgan), projectId, [sent.itemId], { decision: 'revise', feedback: 'Shorter.' }));
    ok(await send(riley, { workId: sent.workId }).then((s) => withdrawItem(as(riley), projectId, s.itemId)));
    ok(await addFormat(as(jordan), orgId, { name: `Prop number ${tag().slice(0, 4)}`, pattern: '###-AA-#####' }));
    const held = await restoreVersion(as(riley), projectId, sent.workId, { version: 1, whatChanged: 'Restored version 1.' });
    expect(held).toMatchObject({ ok: false, status: 400, heldFile: { fileName: 'props.pdf' } });
    const restored = ok(await restoreVersion(as(riley), projectId, sent.workId, { version: 1, whatChanged: 'Restored version 1.', fileAnswer: 'A prop number' }));
    expect(restored.version).toBe(3);
    const confirmations = await q('select answer from identifier_confirmation where review_item_id = $1', [restored.itemId]);
    expect(confirmations.rows.map((r) => r.answer)).toEqual(['A prop number']);
  });
});

describe('the four lists, their order and their reads (layer1-versions-board-first-view#AC-34, AC-35, AC-40)', () => {
  it('lists decisions, returned, assigned and waiting work for each person', async () => {
    const other = ok(await startProject(as(jordan), { name: `Tide ${tag()}`, brief: '', organisationId: orgId, ownerId: jordan })).id;
    const kai = await person('Kai Morin');
    ok(await addPerson(as(jordan), other, { email: kai.email, name: 'Kai Morin', roles: ['artist'] }));
    ok(await addPerson(as(jordan), other, { email: (await q('select email from person where id = $1', [morgan])).rows[0].email, name: 'Morgan Ray', roles: ['director'] }));
    ok(await setAreaApprovers(as(jordan), other, 'creative', { approverId: morgan, delegateId: null }));

    const returned = await send(kai.id, { title: `Tide pool ${tag()}`, handoff: 'look-and-concept-art', project: other });
    ok(await decide(as(morgan), other, [returned.itemId], { decision: 'reject', feedback: 'Not for this show.' }));
    const waiting = await send(kai.id, { title: `Tide sail ${tag()}`, handoff: 'environments', waitingOn: 'mesh-and-rig', project: other });
    const assigned = ok(await addWork(as(jordan), other, { title: `Tide nets ${tag()}`, handoff: 'environments', ownerId: kai.id }));

    const kaiView = await whatNeedsYou(kai.id);
    expect(kaiView.returned.flatMap((g) => g.items.map((i) => i.workId))).toEqual([returned.workId]);
    expect(kaiView.assigned.flatMap((g) => g.items.map((i) => i.workId))).toEqual([assigned.workId]);
    expect(kaiView.waiting.flatMap((g) => g.items.map((i) => [i.itemId, i.blocking]))).toEqual([[waiting.itemId, true]]);
    expect(kaiView.decide).toEqual([]);
    expect(kaiView.projects.map((p) => p.id)).toEqual([other]);

    const morganView = await whatNeedsYou(morgan);
    const decide2 = morganView.decide.flatMap((g) => g.items.map((i) => i.itemId));
    expect(decide2).toContain(waiting.itemId);
    expect(morganView.decide[0]?.items[0]?.blocking).toBe(true);
  });

  it('lists an item handed to a delegate for the delegate only', async () => {
    const sent = await send(riley, { title: `Handed ${tag()}`, handoff: 'character-design' });
    ok(await handOn(as(morgan), projectId, sent.itemId));
    const ids = async (p: string) => (await whatNeedsYou(p)).decide.flatMap((g) => g.items.map((i) => i.itemId));
    expect(await ids(sam)).toContain(sent.itemId);
    expect(await ids(morgan)).not.toContain(sent.itemId);
    expect((await whatNeedsYou(morgan)).handedOn).toBe(true);
  });

  it('grouping and order are by gate, blocking first', async () => {
    const lone = await person('Lou Park');
    const p = ok(await startProject(as(lone.id), { name: `Order ${tag()}`, brief: '', organisationId: null, ownerId: lone.id })).id;
    const a = await send(lone.id, { title: `Alpha ${tag()}`, handoff: 'environments', project: p });
    const b = await send(lone.id, { title: `Beta ${tag()}`, handoff: 'character-design', project: p });
    const c = await send(lone.id, { title: `Gamma ${tag()}`, handoff: 'environments', waitingOn: 'cue-list', project: p });
    const d = await send(lone.id, { title: `Delta ${tag()}`, handoff: 'character-design', project: p });
    const view = await whatNeedsYou(lone.id);
    expect(view.decide.map((g) => [g.handoff, g.items.map((i) => i.itemId)])).toEqual([
      ['environments', [c.itemId, a.itemId]],
      ['character-design', [b.itemId, d.itemId]],
    ]);
  });

  it('what needs you adds no record', async () => {
    // Other test files write at the same time, so only this project's rows are counted.
    const counts = async () =>
      (
        await q(
          "select string_agg(t, ',' order by t) as all from (select c.table_name || ':' || (xpath('/row/n/text()', query_to_xml(format('select count(*) as n from %I where project_id = %L', c.table_name, $1::text), false, true, '')))[1]::text as t from information_schema.columns c join information_schema.tables t using (table_schema, table_name) where c.table_schema = 'public' and c.column_name = 'project_id' and t.table_type = 'BASE TABLE') x",
          [projectId],
        )
      ).rows[0].all as string;
    const before = await counts();
    await whatNeedsYou(riley);
    await whatNeedsYou(morgan);
    expect(await counts()).toBe(before);
  });
});
