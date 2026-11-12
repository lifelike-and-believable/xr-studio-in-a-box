import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  addFormat,
  addPerson,
  confirmFact,
  confirmUpload,
  createOrganisation,
  deleteExpiredHeldUploads,
  deleteUpload,
  editOrganisation,
  editProject,
  registerUpload,
  reissueInvitation,
  removeFormat,
  removePerson,
  removeWorkSample,
  requestUpload,
  restoreFact,
  saveFact,
  setFormat,
  setRoles,
  startProject,
  type Owner,
  type Principal,
} from '../src/record/commands';
import { receiveUpload } from '../src/storage/storage';
import { PNG, docxWith, pdfWithPages } from './support/documents';

// The slice 2 command layer against the test database (layer1-facts-identifiers-activity).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (text: string, values: unknown[] = []) => pool.query(text, values);

async function person(name: string): Promise<string> {
  const id = randomUUID();
  await q('insert into person (id, email, name) values ($1, $2, $3)', [id, `${name.toLowerCase()}-${id}@xr.test`, name]);
  return id;
}

const asPerson = (personId: string): Principal => ({ type: 'person', personId, channel: 'dashboard' });
const asAgent = (personId: string): Principal => ({ type: 'agent-session', personId, channel: 'agent' });
const ok = <T>(r: { ok: true; value: T } | { ok: false }): T => {
  if (!r.ok) throw new Error(`refused: ${JSON.stringify(r)}`);
  return r.value;
};

let jordan: string;
let riley: string;
let tess: string;
let jordanP: Principal;
let orgId: string;
let projectId: string;
let project: Owner;
let org: Owner;

async function entries(owner: Owner) {
  const column = owner.kind === 'project' ? 'project_id' : 'organisation_id';
  const rows = await q(`select what, area, actor_person_id, actor_kind from activity_entry where ${column} = $1 order by at, id`, [owner.id]);
  return rows.rows as { what: string; area: string; actor_person_id: string | null; actor_kind: string }[];
}
const lastEntry = async (owner: Owner) => (await entries(owner)).at(-1);

async function version(owner: Owner, fact: string) {
  const column = owner.kind === 'project' ? 'project_id' : 'organisation_id';
  const rows = await q(`select coalesce(max(number), 0) as n from fact_version where ${column} = $1 and fact = $2`, [owner.id, fact]);
  return Number(rows.rows[0].n);
}

async function upload(owner: Owner, bytes: Uint8Array, fileName: string, mediaType: string, title = fileName) {
  const requested = ok(
    await requestUpload(jordanP, owner, { requestId: randomUUID(), title, fileName, mediaType, size: bytes.length }),
  );
  const token = requested.uploadUrl.split('/').at(-1) ?? '';
  expect(await receiveUpload(token, bytes)).toEqual({ ok: true });
  return requested.uploadId;
}

beforeAll(async () => {
  jordan = await person('Jordan');
  riley = await person('Riley');
  tess = await person('Tess');
  jordanP = asPerson(jordan);
  orgId = ok(await createOrganisation(jordanP, { name: `Org ${randomUUID()}`, stewardIds: [jordan] })).id;
  projectId = ok(await startProject(jordanP, { name: `Project ${randomUUID()}`, brief: '', organisationId: orgId, ownerId: jordan })).id;
  project = { kind: 'project', id: projectId };
  org = { kind: 'organisation', id: orgId };
  const rileyEmail = (await q('select email from person where id = $1', [riley])).rows[0].email;
  const tessEmail = (await q('select email from person where id = $1', [tess])).rows[0].email;
  ok(await addPerson(jordanP, projectId, { email: rileyEmail, roles: ['artist'] }));
  ok(await addPerson(jordanP, projectId, { email: tessEmail, roles: ['technical-artist'] }));
});

afterAll(async () => {
  await pool.end();
});

describe('edit a fact and see who last changed it (layer1-facts-identifiers-activity#AC-2, AC-33)', () => {
  it('writes a new version with who saved it, and its entry in the same change', async () => {
    const before = await version(project, 'description');
    const saved = ok(await saveFact(jordanP, project, 'description', { values: { text: 'A lantern keeper.' }, baseVersion: before }));
    expect(saved.version).toBe(before + 1);
    const row = (await q('select saved_by, value from fact_version where project_id = $1 and fact = $2 and number = $3', [projectId, 'description', saved.version])).rows[0];
    expect(row.saved_by).toBe(jordan);
    expect(row.value).toEqual({ text: 'A lantern keeper.' });
    expect(await lastEntry(project)).toMatchObject({ what: `Saved the description (version ${saved.version})`, area: 'Facts', actor_person_id: jordan });
  });

  it('keeps budget and capacity as numbers, and refuses values that are not whole numbers', async () => {
    const base = await version(project, 'budget');
    ok(await saveFact(jordanP, project, 'budget', { values: { total: '$148,000', note: 'Fees and build' }, baseVersion: base }));
    const refused = await saveFact(jordanP, project, 'capacity', { values: { guests: 'forty', online: '0' }, baseVersion: await version(project, 'capacity') });
    expect(refused).toMatchObject({ ok: false, status: 400, fields: { guests: 'Enter the number of guests in the room as a whole number, like 40.' } });
    expect(await lastEntry(project)).toMatchObject({ what: `Saved the budget (version ${base + 1})` });
  });
});

describe('facts visible and editable by role (layer1-facts-identifiers-activity#AC-4, AC-31)', () => {
  it('refuses fact, restore and work sample commands from people without the right, changing nothing', async () => {
    const base = await version(project, 'plan');
    const results = [
      await saveFact(asPerson(riley), project, 'plan', { values: { text: 'Riley plan' }, baseVersion: base }),
      await saveFact(asPerson(tess), project, 'plan', { values: { text: 'Tess plan' }, baseVersion: base }),
      await restoreFact(asPerson(riley), project, 'description', 1),
      await requestUpload(asPerson(riley), project, { requestId: randomUUID(), title: 'x', fileName: 'x.png', mediaType: 'image/png', size: 10 }),
      await saveFact(asPerson(jordan), org, 'bio', { values: { text: 'x' }, baseVersion: 0 }).then(() => saveFact(asPerson(riley), org, 'bio', { values: { text: 'x' }, baseVersion: 1 })),
    ];
    for (const r of results) expect(r).toMatchObject({ ok: false, status: 403 });
    expect(await version(project, 'plan')).toBe(base);
  });

  it('refuses every slice 2 command from an agent session, whatever roles its person holds', async () => {
    const agent = asAgent(jordan);
    const results = [
      await saveFact(agent, project, 'plan', { values: { text: 'x' }, baseVersion: await version(project, 'plan') }),
      await restoreFact(agent, project, 'description', 1),
      await confirmFact(agent, project, 'plan', { values: { text: '046 454 286' }, baseVersion: await version(project, 'plan'), answer: 'x' }),
      await requestUpload(agent, project, { requestId: randomUUID(), title: 'x', fileName: 'x.png', mediaType: 'image/png', size: 10 }),
      await addFormat(agent, orgId, { name: 'Agent format', pattern: '######' }),
      await removeWorkSample(agent, project, randomUUID()),
    ];
    for (const r of results) expect(r).toMatchObject({ ok: false, status: 403 });
  });
});

describe('restore saves a new version and keeps every version (layer1-facts-identifiers-activity#AC-7)', () => {
  it('restores an earlier value as a new version marked restored from it', async () => {
    const base = await version(project, 'schedule');
    ok(await saveFact(jordanP, project, 'schedule', { values: { text: 'First' }, baseVersion: base }));
    ok(await saveFact(jordanP, project, 'schedule', { values: { text: 'Second' }, baseVersion: base + 1 }));
    const restored = ok(await restoreFact(jordanP, project, 'schedule', base + 1));
    expect(restored).toEqual({ version: base + 3, restoredFrom: base + 1 });
    const rows = (await q('select number, value, restored_from from fact_version where project_id = $1 and fact = $2 order by number', [projectId, 'schedule'])).rows;
    expect(rows.slice(-3).map((r) => [r.value.text, r.restored_from])).toEqual([
      ['First', null],
      ['Second', null],
      ['First', base + 1],
    ]);
    expect(await lastEntry(project)).toMatchObject({ what: `Restored the schedule to version ${base + 1}, saved as version ${base + 3}` });
  });
});

describe('a save made meanwhile is never overwritten (layer1-facts-identifiers-activity#AC-8)', () => {
  it('refuses a save whose starting version is no longer current, and says who saved', async () => {
    const base = await version(project, 'credits');
    ok(await saveFact(jordanP, project, 'credits', { values: { text: 'Theirs' }, baseVersion: base }));
    const refused = await saveFact(jordanP, project, 'credits', { values: { text: 'Mine' }, baseVersion: base });
    expect(refused).toMatchObject({ ok: false, status: 409, conflict: { version: base + 1, values: { text: 'Theirs' } } });
    ok(await saveFact(jordanP, project, 'credits', { values: { text: 'Mine' }, baseVersion: base + 1 }));
    expect(await version(project, 'credits')).toBe(base + 2);
  });
});

describe('every fact save and restore is checked (layer1-facts-identifiers-activity#AC-20, AC-21, AC-22)', () => {
  it('writes nothing when text matches a format that is On, and names the field, text and formats', async () => {
    const base = await version(project, 'collaborators');
    const refused = await saveFact(jordanP, project, 'collaborators', { values: { text: 'Robin, SIN 046 454 286' }, baseVersion: base });
    expect(refused).toMatchObject({
      ok: false,
      status: 400,
      held: [{ field: 'text', text: '046 454 286', formats: [{ name: 'Social Insurance Number' }, { name: 'Business Number' }] }],
    });
    expect(await version(project, 'collaborators')).toBe(base);
  });

  it('checks the budget note and every funder profile field', async () => {
    const budget = await saveFact(jordanP, project, 'budget', { values: { total: '1', note: 'pay 00123-004-1234567' }, baseVersion: await version(project, 'budget') });
    expect(budget).toMatchObject({ ok: false, held: [{ field: 'note' }] });
    const profile = await saveFact(jordanP, org, 'funder-profile-canada-council', {
      values: { applicantName: 'Co', category: 'Group', profileNumber: '123456789', mandate: 'card 4111 1111 1111 1111' },
      baseVersion: 0,
    });
    expect(profile).toMatchObject({ ok: false, held: [{ field: 'profileNumber' }, { field: 'mandate' }] });
  });

  it('checks a restore against formats turned on since, and uses only formats that are On', async () => {
    const base = await version(project, 'plan');
    ok(await saveFact(jordanP, project, 'plan', { values: { text: 'Prop 204-HP-11872' }, baseVersion: base }));
    ok(await saveFact(jordanP, project, 'plan', { values: { text: 'Nothing here' }, baseVersion: base + 1 }));
    const added = ok(await addFormat(jordanP, orgId, { name: `Prop number ${randomUUID().slice(0, 4)}`, pattern: '###-AA-#####' }));
    expect(await restoreFact(jordanP, project, 'plan', base + 1)).toMatchObject({ ok: false, status: 400, held: [{ text: '204-HP-11872' }] });
    ok(await setFormat(jordanP, orgId, added.id, { on: false }));
    ok(await restoreFact(jordanP, project, 'plan', base + 1));
    ok(await removeFormat(jordanP, orgId, added.id));
  });
});

describe('confirm a false match and save (layer1-facts-identifiers-activity#AC-23, AC-24)', () => {
  it('writes the version, the confirmation and the entry together, holding a keyed hash and not the text', async () => {
    const base = await version(project, 'description');
    const empty = await confirmFact(jordanP, project, 'description', { values: { text: 'Ref 046 454 286' }, baseVersion: base, answer: ' ' });
    expect(empty).toMatchObject({ ok: false, fields: { answer: 'Say in a few words what the number is.' } });
    const long = await confirmFact(jordanP, project, 'description', { values: { text: 'Ref 046 454 286' }, baseVersion: base, answer: 'x'.repeat(101) });
    expect(long).toMatchObject({ ok: false, fields: { answer: 'Keep your answer to 100 characters or fewer.' } });
    const leaky = await confirmFact(jordanP, project, 'description', { values: { text: 'Ref 046 454 286' }, baseVersion: base, answer: 'it is 046454286' });
    expect(leaky).toMatchObject({ ok: false, fields: { answer: expect.stringMatching(/^Your answer also looks like a Social Insurance Number/) } });
    expect(await version(project, 'description')).toBe(base);

    const saved = ok(await confirmFact(jordanP, project, 'description', { values: { text: 'Ref 046 454 286' }, baseVersion: base, answer: 'Ticket reference' }));
    expect(saved.version).toBe(base + 1);
    const confirmation = (await q('select * from identifier_confirmation where project_id = $1 order by at desc limit 1', [projectId])).rows[0];
    expect(confirmation.answer).toBe('Ticket reference');
    expect(confirmation.person_id).toBe(jordan);
    expect(JSON.stringify(confirmation)).not.toMatch(/046.?454.?286/);
    expect(await lastEntry(project)).toMatchObject({
      what: `Saved the description (version ${base + 1}) after confirming that text in it is not a Social Insurance Number or a Business Number ("Ticket reference")`,
    });
  });

  it('covers that exact text in that fact only', async () => {
    const base = await version(project, 'description');
    ok(await saveFact(jordanP, project, 'description', { values: { text: 'Still ref 046-454-286, now longer' }, baseVersion: base }));
    const other = await saveFact(jordanP, project, 'description', { values: { text: 'Ref 046 454 286 and 130 692 544' }, baseVersion: base + 1 });
    expect(other).toMatchObject({ ok: false, held: [{ text: '130 692 544' }] });
    const elsewhere = await saveFact(jordanP, project, 'credits', { values: { text: 'Ref 046 454 286' }, baseVersion: await version(project, 'credits') });
    expect(elsewhere).toMatchObject({ ok: false, held: [{ text: '046 454 286' }] });
  });
});

describe('remove a work sample and restore it from an earlier version (layer1-facts-identifiers-activity#AC-10, AC-12)', () => {
  it('adds a registered upload once, removes it as a new version, and restoring brings the list back', async () => {
    const before = await version(project, 'work-samples');
    const id = await upload(project, PNG, 'lantern.png', 'image/png', 'Lantern test');
    const added = ok(await registerUpload(jordanP, project, id));
    expect(added).toMatchObject({ state: 'added', version: before + 1 });
    ok(await registerUpload(jordanP, project, id));
    expect(await version(project, 'work-samples')).toBe(before + 1);
    expect(await lastEntry(project)).toMatchObject({ what: `Added the work sample "Lantern test" (version ${before + 1})` });

    if (added.state !== 'added') throw new Error('not added');
    const removed = ok(await removeWorkSample(jordanP, project, added.fileId));
    expect(removed.version).toBe(before + 2);
    expect(await lastEntry(project)).toMatchObject({ what: `Removed the work sample "Lantern test" (version ${before + 2})` });
    expect((await q('select count(*)::int as n from stored_file where id = $1', [added.fileId])).rows[0].n).toBe(1);
    ok(await restoreFact(jordanP, project, 'work-samples', before + 1));
    const current = (await q('select value from fact_version where project_id = $1 and fact = $2 order by number desc limit 1', [projectId, 'work-samples'])).rows[0].value;
    expect(current.samples.map((s: { title: string }) => s.title)).toContain('Lantern test');
  });

  it('refuses a file whose first bytes are not a type work samples take, or that is over 2 GB', async () => {
    const id = await upload(project, new TextEncoder().encode('just text'), 'notes.png', 'image/png');
    expect(await registerUpload(jordanP, project, id)).toMatchObject({ ok: false, status: 400, fields: { file: 'Choose a video, image, audio, PDF or Word file.' } });
    const big = await requestUpload(jordanP, project, { requestId: randomUUID(), title: 'Big', fileName: 'big.mp4', mediaType: 'video/mp4', size: 2 * 1024 ** 3 + 1 });
    expect(big).toMatchObject({ ok: false, fields: { file: 'The file is larger than 2 GB. Choose a smaller file.' } });
  });
});

describe('a PDF or Word document holding an identifier is held, and can be confirmed (layer1-facts-identifiers-activity#AC-25, AC-26)', () => {
  it('holds a PDF naming the page that matched, and adds it once confirmed', async () => {
    const before = await version(project, 'work-samples');
    const id = await upload(project, pdfWithPages(['A letter.', 'GST 123456789 RT0001']), 'grant-letter.pdf', 'application/pdf', 'Grant letter');
    const held = ok(await registerUpload(jordanP, project, id));
    expect(held).toMatchObject({ state: 'held', matches: [{ page: 2, formatIds: [expect.any(String)] }] });
    expect(await version(project, 'work-samples')).toBe(before);
    const added = ok(await confirmUpload(jordanP, project, id, { answer: 'Example number in a sample letter' }));
    expect(added.version).toBe(before + 1);
    expect(await lastEntry(project)).toMatchObject({
      what: `Added the work sample "Grant letter" (version ${before + 1}) after confirming that grant-letter.pdf does not have a GST/HST number ("Example number in a sample letter")`,
    });
  });

  it('holds a Word document whose footer matches, and deletes it now when asked', async () => {
    const id = await upload(project, docxWith({ body: 'A plan.', footer: 'Account 00123-004-1234567' }), 'plan.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(ok(await registerUpload(jordanP, project, id))).toMatchObject({ state: 'held', matches: [{ page: null }] });
    ok(await deleteUpload(jordanP, project, id));
    expect((await q('select state from upload where id = $1', [id])).rows[0].state).toBe('deleted');
    expect(await lastEntry(project)).toMatchObject({ what: 'Deleted plan.docx, held because its text looked like it had a bank account number', area: 'Facts' });
  });

  it('deletes held uploads past their time, logged as done by XR Studio', async () => {
    const id = await upload(project, pdfWithPages(['SIN 046 454 286']), 'scan.pdf', 'application/pdf');
    ok(await registerUpload(jordanP, project, id));
    await q("update upload set held_until = now() - interval '1 minute' where id = $1", [id]);
    expect(await confirmUpload(jordanP, project, id, { answer: 'Too late' })).toMatchObject({ ok: false, status: 404 });
    await deleteExpiredHeldUploads();
    expect((await q('select state from upload where id = $1', [id])).rows[0].state).toBe('deleted');
    const entry = (await entries(project)).find((e) => e.what.startsWith('Deleted scan.pdf'));
    expect(entry).toMatchObject({
      what: 'Deleted scan.pdf, held because its text looked like it had a Social Insurance Number or a Business Number and not confirmed within 24 hours',
      actor_kind: 'system',
      actor_person_id: null,
    });
  });
});

describe('remove an added format, and the format list (layer1-facts-identifiers-activity#AC-27, AC-28, AC-29, AC-30)', () => {
  it('starts an organisation with the five starter formats On, which cannot be removed', async () => {
    const formats = (await q('select name, is_on, starter from identifier_format where organisation_id = $1 and removed_at is null order by added_at, name', [orgId])).rows;
    expect(formats.filter((f) => f.starter).map((f) => [f.name, f.is_on])).toEqual(
      expect.arrayContaining([
        ['Bank account number (Canada)', true],
        ['Social Insurance Number', true],
        ['Business Number', true],
        ['GST/HST number', true],
        ['Payment card number', true],
      ]),
    );
    const starter = (await q('select id from identifier_format where organisation_id = $1 and starter limit 1', [orgId])).rows[0].id;
    expect(await removeFormat(jordanP, orgId, starter)).toMatchObject({ ok: false });
  });

  it('checks a new format, logs every change, and lets only stewards change the list', async () => {
    expect(await addFormat(jordanP, orgId, { name: '', pattern: '' })).toMatchObject({
      ok: false,
      fields: { name: 'Enter a name for the format.', pattern: 'Enter a pattern, like ###-AA-#####.' },
    });
    expect(await addFormat(jordanP, orgId, { name: 'Short', pattern: '##-##' })).toMatchObject({
      ok: false,
      fields: { pattern: 'Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices.' },
    });
    expect(await addFormat(asPerson(riley), orgId, { name: 'Riley format', pattern: '######' })).toMatchObject({ ok: false, status: 403 });
    const name = `Funder account ${randomUUID().slice(0, 4)}`;
    const id = ok(await addFormat(jordanP, orgId, { name, pattern: '###-AA-#####' })).id;
    ok(await setFormat(jordanP, orgId, id, { on: false }));
    ok(await setFormat(jordanP, orgId, id, { on: true }));
    ok(await removeFormat(jordanP, orgId, id));
    const words = (await entries(org)).map((e) => e.what).filter((w) => w.includes(name));
    expect(words).toEqual([
      `Added the identifier format "${name}"`,
      `Turned off the identifier format "${name}"`,
      `Turned on the identifier format "${name}"`,
      `Removed the identifier format "${name}"`,
    ]);
    expect((await entries(org)).filter((e) => e.what.includes(name)).every((e) => e.area === 'Identifier formats')).toBe(true);
  });
});

describe('every command writes its entry (layer1-facts-identifiers-activity#AC-33)', () => {
  it('logs the slice 1 commands where they belong', async () => {
    const owner = await person('Owner');
    const p = asPerson(owner);
    const o = ok(await createOrganisation(p, { name: `Logged ${randomUUID()}`, stewardIds: [owner] }));
    ok(await editOrganisation(p, o.id, { name: `Logged again ${randomUUID()}`, stewardIds: [owner] }));
    expect((await entries({ kind: 'organisation', id: o.id })).map((e) => [e.what, e.area])).toEqual([
      ['Created the organisation', 'Organisation'],
      ["Changed the organisation's name and who looks after it", 'Organisation'],
    ]);
    const pr = ok(await startProject(p, { name: `Logged ${randomUUID()}`, brief: '', organisationId: o.id, ownerId: owner })).id;
    ok(await editProject(p, pr, { name: `Logged ${randomUUID()}`, brief: 'Brief' }));
    const email = `kim-${randomUUID()}@xr.test`;
    const kim = ok(await addPerson(p, pr, { email, name: 'Kim Lee', roles: ['artist', 'sound-designer'] })).personId;
    ok(await reissueInvitation(p, pr, kim));
    ok(await setRoles(p, pr, kim, { roles: ['artist'] }));
    ok(await removePerson(p, pr, kim));
    expect((await entries({ kind: 'project', id: pr })).map((e) => [e.what, e.area])).toEqual([
      ['Started the project', 'Project'],
      ["Changed the project's name and brief", 'Project'],
      ['Added Kim Lee as Artist and Sound designer', 'People'],
      ['Sent Kim Lee a new invitation link', 'People'],
      ["Changed Kim Lee's roles to Artist", 'People'],
      ['Removed Kim Lee from the project', 'People'],
    ]);
  });

  it('logs organisation fact changes in the organisation, with the funder named', async () => {
    const base = await version(org, 'funder-profile-creative-bc');
    ok(await saveFact(jordanP, org, 'funder-profile-creative-bc', { values: { applicantName: 'Co', category: 'Group', profileNumber: '', mandate: 'Puppets' }, baseVersion: base }));
    expect(await lastEntry(org)).toMatchObject({ what: `Saved the applicant profile for Creative BC (version ${base + 1})`, area: 'Organisation facts' });
  });
});

describe('entries hold no values (layer1-facts-identifiers-activity#AC-39)', () => {
  it('never copies a fact value or file name into an entry beyond the command words', async () => {
    const secret = `Budget note ${randomUUID()}`;
    ok(await saveFact(jordanP, project, 'budget', { values: { total: '987654', note: secret }, baseVersion: await version(project, 'budget') }));
    const all = (await entries(project)).map((e) => e.what).join('\n');
    expect(all).not.toContain(secret);
    expect(all).not.toContain('987654');
    expect(all).not.toContain('987,654');
  });
});

describe('test identifiers reach nothing an agent can read (layer1-facts-identifiers-activity#AC-32)', () => {
  it('stores none of them in versions, files, confirmations or entries, except text confirmed not to be one', async () => {
    const ids = ['00123-004-9876543', '046 454 286', '987654321', '123456789 RT0001', '4012 8888 8888 1881'];
    const compact = ids.map((i) => i.replace(/[\s.-]/g, ''));
    for (const [n, id] of ids.entries()) {
      const fact = ['plan', 'schedule', 'collaborators', 'credits', 'description'][n] ?? 'plan';
      await saveFact(jordanP, project, fact, { values: { text: `Value ${id}` }, baseVersion: await version(project, fact) });
      await saveFact(jordanP, org, 'funder-profile-epic-megagrants', { values: { applicantName: id, category: id, profileNumber: id, mandate: id }, baseVersion: await version(org, 'funder-profile-epic-megagrants') });
      await confirmFact(jordanP, project, 'plan', { values: { text: 'Ref 046 454 286' }, baseVersion: await version(project, 'plan'), answer: `number ${id}` });
    }
    const pdf = await upload(project, pdfWithPages(ids), 'ids.pdf', 'application/pdf');
    await registerUpload(jordanP, project, pdf);
    const docx = await upload(project, docxWith({ body: ids.join(' and ') }), 'ids.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    await registerUpload(jordanP, project, docx);

    const versions = (await q('select value::text as v from fact_version where confirmation_id is null')).rows.map((r) => r.v);
    const files = (await q("select file_name || ' ' || storage_key as v from stored_file")).rows.map((r) => r.v);
    const confirmations = (await q('select row_to_json(c)::text as v from identifier_confirmation c')).rows.map((r) => r.v);
    const logged = (await q('select what as v from activity_entry')).rows.map((r) => r.v);
    const everything = [...versions, ...files, ...confirmations, ...logged].map((v) => v.replace(/[\s.-]/g, '')).join('\n');
    for (const id of compact) expect(everything, id).not.toContain(id);
  });
});

describe('ledgers refuse update and delete by the application role (layer1-facts-identifiers-activity#AC-38)', () => {
  async function as(role: string, statement: string): Promise<string> {
    const client = await pool.connect();
    try {
      await client.query('begin');
      await client.query(`set local role ${role}`);
      await client.query(statement);
      return 'allowed';
    } catch (error) {
      return (error as { code?: string }).code ?? 'error';
    } finally {
      await client.query('rollback');
      client.release();
    }
  }

  it.each(['fact_version', 'identifier_confirmation', 'activity_entry'])('%s', async (table) => {
    expect(await as('xr_app', `select count(*) from ${table}`)).toBe('allowed');
    expect(await as('xr_app', `update ${table} set id = id`)).toBe('42501');
    expect(await as('xr_app', `delete from ${table}`)).toBe('42501');
    expect(await as('xr_retention', `delete from ${table} where false`)).toBe('allowed');
  });

  it('lets the application role change working state', async () => {
    expect(await as('xr_app', 'update upload set title = title where false')).toBe('allowed');
    expect(await as('xr_app', 'delete from identifier_format where false')).toBe('allowed');
  });
});
