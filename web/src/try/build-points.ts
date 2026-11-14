import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { RoleId } from '@xr/contracts';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { project as projectTable, reviewItem } from '../db/schema';
import {
  addFeedback,
  addPerson,
  addWork,
  createOrganisation,
  decide,
  recordFirstSignIn,
  registerUpload,
  requestUpload,
  restoreVersion,
  sendForReview,
  setAreaApprovers,
  setProtectedHolder,
  startProject,
} from '../record/commands';
import { personByEmail } from '../record/eligibility';
import { newId } from '../record/ids';
import type { Principal } from '../record/principal';
import { appOrigins } from '../record/settings';
import { ensureAccount, sendAddedMail } from '../record/sign-in';
import { receiveUpload } from '../storage/storage';
import { PEOPLE } from './people';

// Each tutorial's starting point is where the tutorial before it ends, built with the record's own
// commands as the made-up people, never by writing rows (design-trying-the-product, "Starting
// points"), so a starting point is a state a real team can reach, with its activity log.

const PROJECT = 'The Lantern Keeper';
const as = (personId: string): Principal => ({ type: 'person', personId, channel: 'dashboard' });

function must<T>(result: { ok: true; value: T } | { ok: false }, what: string): T {
  if (!result.ok) throw new Error(`trial copy: could not ${what}: ${JSON.stringify(result)}`);
  return result.value;
}

async function idOf(first: string): Promise<string> {
  const p = PEOPLE.find((x) => x.first === first);
  const found = p ? await personByEmail(p.email) : undefined;
  if (!found) throw new Error(`trial copy: ${first} is not in this copy`);
  return found.id;
}

async function projectId(): Promise<string> {
  const row = (await db().select({ id: projectTable.id }).from(projectTable).where(eq(projectTable.name, PROJECT)).limit(1))[0];
  if (!row) throw new Error('trial copy: The Lantern Keeper is not in this copy');
  return row.id;
}

// A made-up file from web/public/try-files, uploaded as the person sending it.
async function fileFor(sender: string, projectId: string, name: string): Promise<string> {
  const bytes = new Uint8Array(readFileSync(path.join(process.cwd(), 'public/try-files', name)));
  const owner = { kind: 'project' as const, id: projectId };
  const mediaType = name.endsWith('.pdf') ? 'application/pdf' : 'image/png';
  const asked = must(
    await requestUpload(as(sender), owner, { requestId: newId(), title: name, fileName: name, mediaType, size: bytes.length, purpose: 'review' }),
    `ask to upload ${name}`,
  );
  const token = new URL(asked.uploadUrl, 'http://upload.invalid').pathname.split('/').pop() ?? '';
  const received = await receiveUpload(token, bytes);
  if (!received.ok) throw new Error(`trial copy: could not upload ${name}`);
  const registered = must(await registerUpload(as(sender), owner, asked.uploadId), `register ${name}`);
  if (!('fileId' in registered)) throw new Error(`trial copy: ${name} was held`);
  return registered.fileId;
}

async function send(sender: string, project: string, item: { title: string; handoff: string; file: string; waitingOn?: string; workId?: string; whatChanged?: string }) {
  const fileId = await fileFor(sender, project, item.file);
  const sent = must(
    await sendForReview(as(sender), project, {
      title: item.workId ? '' : item.title,
      handoff: item.handoff,
      whatChanged: item.whatChanged ?? 'First version.',
      fileId,
      waitingOn: item.waitingOn ?? null,
      ...(item.workId ? { workId: item.workId } : {}),
    }),
    `send ${item.title}`,
  );
  if (sent.movedOn) throw new Error(`trial copy: ${item.title} was not sent for review`);
  return sent;
}

// Tutorial 1, Start a production and bring in your team: Jordan's organisation and project, and the
// four other people added with their roles. Each has an account and an open invitation.
async function afterStartAProduction(): Promise<void> {
  const jordanEmail = PEOPLE[0]?.email ?? '';
  await ensureAccount(jordanEmail, PEOPLE[0]?.name ?? null);
  const jordan = await idOf('Jordan');
  await recordFirstSignIn(jordan);
  const org = must(await createOrganisation(as(jordan), { name: 'Harbourfront Puppet Co.', stewardIds: [jordan] }), 'create the organisation');
  const project = must(
    await startProject(as(jordan), { name: PROJECT, brief: "A lighthouse keeper's last night, told with puppets.", organisationId: org.id, ownerId: jordan }),
    'start the project',
  );
  const roles: Record<string, RoleId> = { Morgan: 'director', Riley: 'artist', Sam: 'technical-artist', Drew: 'sound-designer' };
  for (const p of PEOPLE.slice(1)) {
    const added = must(await addPerson(as(jordan), project.id, { email: p.email, name: p.name, roles: [roles[p.first] ?? 'collaborator'] }), `add ${p.first}`);
    await sendAddedMail(added, { projectId: project.id, adder: PEOPLE[0]?.name ?? '', origin: appOrigins()[0] ?? '' });
  }
}

// Tutorial 6, Name who approves what.
async function afterNameWhoApproves(): Promise<void> {
  const [jordan, morgan, sam, project] = [await idOf('Jordan'), await idOf('Morgan'), await idOf('Sam'), await projectId()];
  must(await setAreaApprovers(as(jordan), project, 'creative', { approverId: morgan, delegateId: sam }), 'name the Creative approver');
  must(await setAreaApprovers(as(jordan), project, 'performance-and-behaviour', { approverId: morgan, delegateId: null }), 'name the Performance approver');
  must(await setProtectedHolder(as(jordan), project, 'publishing-and-marketing', { holderId: morgan }), 'give Morgan Publishing and marketing');
}

// Tutorial 7, Send work for review: what Riley sends.
async function afterSendWork(): Promise<void> {
  const [riley, project] = [await idOf('Riley'), await projectId()];
  await send(riley, project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', file: 'character-sheet.png', waitingOn: 'mesh-and-rig', whatChanged: 'Front and side views.' });
  await send(riley, project, { title: 'Harbour at night, lighting pass', handoff: 'environments', file: 'harbour-lighting.png', whatChanged: 'Fog and lamp light.' });
  await send(riley, project, { title: 'Lighthouse concept', handoff: 'look-and-concept-art', file: 'lighthouse-concept.png', whatChanged: 'The tower and its stairs.' });
  await send(riley, project, { title: 'Bell sounds, take 1', handoff: 'sound-and-music', file: 'bell-sounds.png', whatChanged: 'The harbour bell, close.' });
  await send(riley, project, { title: 'Bell sounds, take 2', handoff: 'sound-and-music', file: 'bell-sounds.png', whatChanged: 'The harbour bell, far off.' });
  await send(riley, project, { title: 'Licence for the harbour recordings', handoff: 'contracts-and-licence-terms', file: 'harbour-recordings-licence.pdf', whatChanged: 'The licence to sign.' });
}

// Tutorial 9, See where everything stands: work on the board, and a revision asked for.
async function afterSeeWhereEverythingStands(): Promise<{ workId: string }> {
  const [jordan, riley, morgan, drew, sam, project] = [await idOf('Jordan'), await idOf('Riley'), await idOf('Morgan'), await idOf('Drew'), await idOf('Sam'), await projectId()];
  must(await addWork(as(jordan), project, { title: 'Harbour ambience', handoff: 'sound-and-music', ownerId: drew }), 'add Harbour ambience');
  const sheet = await send(riley, project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', file: 'character-sheet.png', waitingOn: 'mesh-and-rig', whatChanged: 'Front and side views.' });
  must(await addWork(as(jordan), project, { title: 'Lantern Keeper mesh and rig', handoff: 'mesh-and-rig', ownerId: sam }), 'add the mesh and rig');
  must(await decide(as(morgan), project, [sheet.itemId], { decision: 'revise', feedback: 'Shorten the coat.' }), 'ask for a revision');
  return { workId: sheet.workId };
}

// Tutorial 10, Give feedback and compare versions: version 3, restored from version 1, accepted.
async function afterGiveFeedback(): Promise<void> {
  const { workId } = await afterSeeWhereEverythingStands();
  const [riley, morgan, sam, project] = [await idOf('Riley'), await idOf('Morgan'), await idOf('Sam'), await projectId()];
  const v1 = (await db().select({ id: reviewItem.id }).from(reviewItem).where(and(eq(reviewItem.workId, workId), eq(reviewItem.version, 1))).limit(1))[0];
  if (v1) must(await addFeedback(as(sam), project, v1.id, { text: 'The long coat will catch on the lighthouse stairs.' }), 'add feedback');
  const v2 = await send(riley, project, { title: 'Lantern Keeper character sheet', handoff: 'character-design', file: 'character-sheet.png', workId, waitingOn: 'mesh-and-rig', whatChanged: 'Coat shortened to the knee.' });
  must(await decide(as(morgan), project, [v2.itemId], { decision: 'revise', feedback: 'The long coat read better from the back rows. Go back to version 1.' }), 'ask for a second revision');
  const restored = await restoreVersion(as(riley), project, workId, { version: 1, whatChanged: 'Restored version 1. Morgan asked for the long coat.' });
  if (!restored.ok) throw new Error('trial copy: could not restore version 1');
  must(await decide(as(morgan), project, [restored.value.itemId], { decision: 'accept', feedback: '' }), 'accept version 3');
}

const step = (...work: (() => Promise<unknown>)[]) => async () => {
  for (const w of work) await w();
};

// Each tutorial's starting point, by tutorial id (help-tutorials-and-previews#AC-11).
export const BUILDERS: Record<string, () => Promise<void>> = {
  'tutorial-try-xr-studio-in-a-trial-copy': async () => {},
  'tutorial-start-a-production-and-bring-in-your-team': async () => {},
  'tutorial-sign-in-and-add-a-passkey': step(afterStartAProduction),
  'tutorial-record-a-projects-facts': step(afterStartAProduction),
  'tutorial-keep-your-organisations-facts': step(afterStartAProduction),
  'tutorial-keep-bank-details-and-tax-numbers-out': step(afterStartAProduction),
  'tutorial-name-who-approves-what': step(afterStartAProduction),
  'tutorial-send-work-for-review': step(afterStartAProduction, afterNameWhoApproves),
  'tutorial-clear-your-review-queue': step(afterStartAProduction, afterNameWhoApproves, afterSendWork),
  'tutorial-see-where-everything-stands': step(afterStartAProduction, afterNameWhoApproves),
  'tutorial-give-feedback-and-compare-versions': step(afterStartAProduction, afterNameWhoApproves, afterSeeWhereEverythingStands),
  'tutorial-find-what-needs-you': step(afterStartAProduction, afterNameWhoApproves, afterSeeWhereEverythingStands),
  'tutorial-read-who-changed-what': step(afterStartAProduction, afterNameWhoApproves, afterGiveFeedback),
};
