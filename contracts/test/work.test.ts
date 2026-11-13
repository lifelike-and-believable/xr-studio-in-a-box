import { describe, expect, it } from 'vitest';
import {
  AddWorkRequest,
  FeedbackRequest,
  RestoreRequest,
  ROLE_PERMISSIONS,
  ROLE_STAGES,
  SendForReviewRequest,
  STATE_LABELS,
  gatedHandoffs,
  stageState,
  stagesFor,
  workState,
  type WorkState,
} from '../src/index';

// Pieces of work, their states and the role-to-stage table (layer1-versions-board-first-view).

const work = { id: 'w1', handoff: 'mesh-and-rig' };
const blocker = { workId: 'w2', waitingHandoff: 'mesh-and-rig' };

describe('work and stage states follow the precedence rules (layer1-versions-board-first-view#AC-4)', () => {
  it('labels the four states as the board shows them', () => {
    expect(STATE_LABELS).toEqual({ blocked: 'Blocked', waiting: 'Waiting for review', 'in-progress': 'In progress', done: 'Done' });
  });

  it('is in progress with no version, or with the latest returned, rejected or withdrawn', () => {
    expect(workState({ ...work, latest: null, waiting: [] })).toBe('in-progress');
    for (const latest of ['revise', 'reject', 'withdraw'] as const) expect(workState({ ...work, latest, waiting: [] })).toBe('in-progress');
  });

  it('is waiting for review while the latest version waits', () => {
    expect(workState({ ...work, latest: 'waiting', waiting: [] })).toBe('waiting');
  });

  it('is done when the latest version was accepted, whatever blocks its stage', () => {
    expect(workState({ ...work, latest: 'accept', waiting: [] })).toBe('done');
    expect(workState({ ...work, latest: 'accept', waiting: [blocker] })).toBe('done');
  });

  it('is blocked when a waiting item of other work names its stage, before waiting for review', () => {
    expect(workState({ ...work, latest: null, waiting: [blocker] })).toBe('blocked');
    expect(workState({ ...work, latest: 'waiting', waiting: [blocker] })).toBe('blocked');
    expect(workState({ ...work, latest: 'revise', waiting: [blocker] })).toBe('blocked');
  });

  it('is never blocked by its own version, or by an item that names another stage', () => {
    expect(workState({ ...work, latest: 'waiting', waiting: [{ workId: 'w1', waitingHandoff: 'mesh-and-rig' }] })).toBe('waiting');
    expect(workState({ ...work, latest: null, waiting: [{ workId: 'w2', waitingHandoff: 'environments' }] })).toBe('in-progress');
    expect(workState({ ...work, latest: null, waiting: [{ workId: 'w2', waitingHandoff: null }] })).toBe('in-progress');
  });

  it('gives a stage the first of Blocked, In progress, Waiting for review and Done that its work has', () => {
    const s = (...states: WorkState[]) => stageState(states);
    expect(s()).toBeNull();
    expect(s('done', 'waiting', 'in-progress', 'blocked')).toBe('blocked');
    expect(s('done', 'waiting', 'in-progress')).toBe('in-progress');
    expect(s('done', 'waiting')).toBe('waiting');
    expect(s('done', 'done')).toBe('done');
  });
});

describe('only directors and producers plan work (layer1-versions-board-first-view#AC-17)', () => {
  it('gives plan-work to the Director and Producer only', () => {
    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      expect(permissions.includes('plan-work'), role).toBe(role === 'director' || role === 'producer');
    }
  });
});

describe('your stages for a newcomer (layer1-versions-board-first-view#AC-37)', () => {
  const labels = (ids: string[]) => ids.map((id) => gatedHandoffs().find((h) => h.id === id)?.label);

  it('lists the stages each role works in, in gate order', () => {
    expect(labels(stagesFor(['sound-designer']))).toEqual(['Sound and music']);
    expect(labels(stagesFor(['artist']))).toEqual(['Look and concept art', 'Character design', 'Mesh and rig', 'Environments', 'Visual effects']);
    expect(labels(stagesFor(['technical-artist']))).toEqual([
      'Mesh and rig',
      'Visual effects',
      'Motion and performance quality',
      'Build for a public show',
      'Update to a remote venue',
      'Changes during a live run',
    ]);
    expect(labels(stagesFor(['interaction-designer']))).toEqual(['Interaction design', 'AI behaviour, voice and dialogue', 'Audience-facing safety and consent']);
    expect(labels(stagesFor(['capture-crew']))).toEqual(['Motion and performance quality']);
    expect(labels(stagesFor(['show-operator']))).toEqual(['Cue list', 'Changes during a live run']);
    expect(labels(stagesFor(['producer']))).toEqual([
      'Funding applications and reports',
      'Contracts and licence terms',
      'Spend above a limit',
      'Publishing and marketing',
      'AI-use statements and credits',
    ]);
    expect(stagesFor(['director'])).toHaveLength(11);
  });

  it('gives several roles the union, and roles without the dashboard nothing', () => {
    expect(labels(stagesFor(['sound-designer', 'capture-crew']))).toEqual(['Sound and music', 'Motion and performance quality']);
    for (const role of ['venue-attendant', 'performer', 'collaborator'] as const) expect(ROLE_STAGES[role]).toEqual([]);
  });
});

describe('the slice 4 API (layer1-versions-board-first-view#AC-43)', () => {
  it('validates the new request bodies', () => {
    expect(AddWorkRequest.safeParse({ title: 'Harbour ambience', handoff: 'sound-and-music', ownerId: 'x' }).success).toBe(true);
    expect(AddWorkRequest.safeParse({ title: 'Harbour ambience' }).success).toBe(false);
    expect(FeedbackRequest.safeParse({ text: 'Good.' }).success).toBe(true);
    expect(RestoreRequest.safeParse({ version: 1, whatChanged: 'Restored version 1.' }).success).toBe(true);
    expect(RestoreRequest.safeParse({ version: 'one', whatChanged: '' }).success).toBe(false);
    expect(SendForReviewRequest.safeParse({ title: '', handoff: '', whatChanged: 'x', fileId: null, waitingOn: null, workId: 'w1' }).success).toBe(true);
  });
});
