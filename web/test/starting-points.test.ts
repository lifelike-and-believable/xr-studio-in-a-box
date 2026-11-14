import { Pool } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { scratchDatabase } from './support/scratch-database';

// Each tutorial's starting point, built with the record's own commands as the five people
// (help-tutorials-and-previews#AC-11). Runs against a database of its own, which Start empties.
const scratch = await scratchDatabase();
process.env.XR_TRY = '1';
process.env.DATABASE_URL = scratch.url;
process.env.DATABASE_URL_UNPOOLED = scratch.url;
process.env.SIGN_IN_FIRST_ADDRESSES = 'jordan@xr.test';

const { loadStartingPoint, markTrialCopy } = await import('../src/try/records');
const pool = new Pool({ connectionString: scratch.url });
pool.on('error', () => {});
const q = async (text: string) => (await pool.query(text)).rows;

afterAll(async () => {
  await pool.end();
  await scratch.drop();
});

const people = () => q("select p.name, string_agg(r.role, ',' order by r.role) as roles from person p join project_role r on r.person_id = p.id group by p.name order by p.name");

describe('starting points (help-tutorials-and-previews#AC-11)', { timeout: 60_000 }, () => {
  it('tutorial 1 starts from a new installation', async () => {
    await markTrialCopy();
    await loadStartingPoint('tutorial-start-a-production-and-bring-in-your-team');
    expect(await q('select name from project')).toEqual([]);
    expect(await q('select email from person')).toEqual([]);
  });

  it('tutorials 2 to 6 start where tutorial 1 ends: the project and its five people', async () => {
    await loadStartingPoint('tutorial-name-who-approves-what');
    expect(await q('select p.name as project, o.name as organisation from project p join organisation o on o.id = p.organisation_id')).toEqual([
      { project: 'The Lantern Keeper', organisation: 'Harbourfront Puppet Co.' },
    ]);
    expect(await people()).toEqual([
      { name: 'Drew Patel', roles: 'sound-designer' },
      { name: 'Jordan Lee', roles: 'director,producer' },
      { name: 'Morgan Ray', roles: 'director' },
      { name: 'Riley Chen', roles: 'artist' },
      { name: 'Sam Okafor', roles: 'technical-artist' },
    ]);
    // Each person can be signed in: an account, and an open invitation for the four Jordan added.
    expect((await q("select count(*)::int as n from invitation where used_at is null"))[0].n).toBe(4);
    expect((await q("select count(*)::int as n from person where auth_user_id is null"))[0].n).toBe(0);
  });

  it('tutorials 7 and 9 start where tutorial 6 ends: approvers named', async () => {
    await loadStartingPoint('tutorial-send-work-for-review');
    const slots = await q("select a.slot, p.name as approver, d.name as delegate from approval_assignment a join person p on p.id = a.approver_id left join person d on d.id = a.delegate_id where a.slot in ('area:creative', 'area:performance-and-behaviour', 'protected:publishing-and-marketing') order by a.slot");
    expect(slots).toEqual([
      { slot: 'area:creative', approver: 'Morgan Ray', delegate: 'Sam Okafor' },
      { slot: 'area:performance-and-behaviour', approver: 'Morgan Ray', delegate: null },
      { slot: 'protected:publishing-and-marketing', approver: 'Morgan Ray', delegate: null },
    ]);
    expect(await q('select title from review_item')).toEqual([]);
  });

  it('tutorial 8 starts where tutorial 7 ends: Riley has sent work', async () => {
    await loadStartingPoint('tutorial-clear-your-review-queue');
    const items = await q('select title, handoff from review_item order by title');
    expect(items).toEqual([
      { title: 'Bell sounds, take 1', handoff: 'sound-and-music' },
      { title: 'Bell sounds, take 2', handoff: 'sound-and-music' },
      { title: 'Harbour at night, lighting pass', handoff: 'environments' },
      { title: 'Lantern Keeper character sheet', handoff: 'character-design' },
      { title: 'Licence for the harbour recordings', handoff: 'contracts-and-licence-terms' },
      { title: 'Lighthouse concept', handoff: 'look-and-concept-art' },
    ]);
    expect(await q('select count(*)::int as n from review_decision')).toEqual([{ n: 0 }]);
  });

  it('tutorials 10 and 11 start where tutorial 9 ends: work on the board, a revision asked for', async () => {
    await loadStartingPoint('tutorial-find-what-needs-you');
    const work = await q('select w.title, p.name as owner from work w join person p on p.id = w.owner_id order by w.title');
    expect(work.map((w) => w.title)).toEqual(['Harbour ambience', 'Lantern Keeper character sheet', 'Lantern Keeper mesh and rig']);
    expect(work.find((w) => w.title === 'Harbour ambience')?.owner).toBe('Drew Patel');
    expect(await q("select d.decision from review_decision d join review_item i on i.id = d.item_id where i.title = 'Lantern Keeper character sheet'")).toEqual([{ decision: 'revise' }]);
  });

  it('tutorial 12 starts where tutorial 10 ends: version 3 accepted', async () => {
    await loadStartingPoint('tutorial-read-who-changed-what');
    const versions = await q("select i.version, d.decision from review_item i left join review_decision d on d.item_id = i.id where i.title = 'Lantern Keeper character sheet' order by i.version");
    expect(versions).toEqual([
      { version: 1, decision: 'revise' },
      { version: 2, decision: 'revise' },
      { version: 3, decision: 'accept' },
    ]);
  });
});
