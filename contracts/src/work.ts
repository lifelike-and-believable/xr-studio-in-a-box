import { z } from 'zod';
import { gatedHandoffs } from './gates';
import type { RoleId } from './roles';

// Pieces of work, their states, and the role-to-stage table (layer1-versions-board-first-view).

export const WORK_STATES = ['blocked', 'in-progress', 'waiting', 'done'] as const;
export type WorkState = (typeof WORK_STATES)[number];

export const STATE_LABELS: Record<WorkState, string> = {
  blocked: 'Blocked',
  waiting: 'Waiting for review',
  'in-progress': 'In progress',
  done: 'Done',
};

// The state of an item, from the decision ledger: waiting, or how it was decided.
export type ItemState = 'waiting' | 'accept' | 'revise' | 'reject' | 'withdraw';

// AC-4. Worked out on every read and never stored, so it cannot drift from the queue. An item never
// blocks its own piece of work.
export function workState(input: {
  id: string;
  handoff: string;
  latest: ItemState | null;
  waiting: { workId: string; waitingHandoff: string | null }[];
}): WorkState {
  if (input.latest === 'accept') return 'done';
  if (input.waiting.some((w) => w.workId !== input.id && w.waitingHandoff === input.handoff)) return 'blocked';
  if (input.latest === 'waiting') return 'waiting';
  return 'in-progress';
}

// A stage takes the first of these that any of its work has, so it is Done only when all its work is.
const STAGE_ORDER: WorkState[] = ['blocked', 'in-progress', 'waiting', 'done'];
export function stageState(states: WorkState[]): WorkState | null {
  return STAGE_ORDER.find((s) => states.includes(s)) ?? null;
}

// The order the board's count line and stage lines use.
export const COUNT_ORDER: WorkState[] = ['blocked', 'waiting', 'in-progress', 'done'];

// Which stages each role works in (design-what-needs-you choice 8, [proposed] there). It only
// guides "Your stages"; anyone may send work at any stage.
const inArea = (...areas: string[]) => gatedHandoffs().filter((h) => h.area && areas.includes(h.area)).map((h) => h.id);
export const ROLE_STAGES: Record<RoleId, string[]> = {
  director: inArea('creative', 'performance-and-behaviour'),
  producer: inArea('business'),
  'technical-artist': [
    'mesh-and-rig',
    'visual-effects',
    'motion-and-performance-quality',
    'build-for-a-public-show',
    'update-to-a-remote-venue',
    'changes-during-a-live-run',
  ],
  artist: ['look-and-concept-art', 'character-design', 'mesh-and-rig', 'environments', 'visual-effects'],
  'sound-designer': ['sound-and-music'],
  'interaction-designer': ['interaction-design', 'ai-behaviour-voice-and-dialogue', 'audience-facing-safety-and-consent'],
  'capture-crew': ['motion-and-performance-quality'],
  'show-operator': ['cue-list', 'changes-during-a-live-run'],
  'venue-attendant': [],
  performer: [],
  collaborator: [],
};

// The union for several roles, in gate order.
export function stagesFor(roles: readonly RoleId[]): string[] {
  const wanted = new Set(roles.flatMap((r) => ROLE_STAGES[r]));
  return gatedHandoffs()
    .map((h) => h.id)
    .filter((id) => wanted.has(id));
}

// --- Requests (AC-43)

export const AddWorkRequest = z.object({ title: z.string(), handoff: z.string(), ownerId: z.string(), answer: z.string().optional() });
export const ChangeOwnerRequest = z.object({ ownerId: z.string() });
export const FeedbackRequest = z.object({ text: z.string(), answer: z.string().optional() });
export const RestoreRequest = z.object({
  version: z.number().int(),
  whatChanged: z.string(),
  answer: z.string().optional(),
  fileAnswer: z.string().optional(),
});
