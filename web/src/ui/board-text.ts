import { COUNT_ORDER, STATE_LABELS, stageState, type WorkState } from '@xr/contracts';

// Wording shared by the board's first draw and its updates, on the server and in the browser
// (layer1-versions-board-first-view#AC-6, AC-7, AC-10).

export type BoardRow = {
  id: string;
  title: string;
  handoff: string;
  owner: string;
  state: WorkState;
  detail: string;
  blockingStage: string | null;
  latest: string;
};

export type BoardStage = { handoff: string; label: string; area: string; areaLabel: string; decidedBy: string };

export type BoardData = { stamp: string; work: BoardRow[]; stages: BoardStage[] };

const COUNT_WORDS: Record<WorkState, string> = { blocked: 'blocked', waiting: 'waiting for review', 'in-progress': 'in progress', done: 'done' };

export const pieces = (n: number) => `${n} ${n === 1 ? 'piece' : 'pieces'} of work`;

// "4 pieces of work: 1 blocked, 1 waiting for review, 1 in progress, 1 done." Counts of zero are
// left out.
export function countLine(rows: { state: WorkState }[]): string {
  const parts = COUNT_ORDER.map((s) => [s, rows.filter((r) => r.state === s).length] as const)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${COUNT_WORDS[s]}`);
  return `${pieces(rows.length)}: ${parts.join(', ')}.`;
}

export const blockedLine = (n: number) => `${pieces(n)} ${n === 1 ? 'is' : 'are'} blocked.`;

// "Stage: Waiting for review. 2 pieces of work: 1 waiting for review, 1 done." or "No work yet."
export function stageLine(rows: { state: WorkState }[]): string {
  const state = stageState(rows.map((r) => r.state));
  if (!state) return 'No work yet.';
  return `Stage: ${STATE_LABELS[state]}. ${countLine(rows)}`;
}

export const stateLabel = (s: WorkState) => STATE_LABELS[s];
