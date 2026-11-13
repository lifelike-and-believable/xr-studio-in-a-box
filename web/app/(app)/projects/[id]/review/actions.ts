'use server';
import { DECISIONS, type Decision } from '@xr/contracts';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { decide, handOn, withdrawItem, type HeldMatch } from '@/record/commands';
import { signedIn } from '@/record/principal';

async function me() {
  const found = await signedIn(await headers());
  if (!found) redirect('/sign-in');
  return found;
}

const decisionOf = (form: FormData): Decision | null => {
  const value = String(form.get('decision') ?? '');
  return (DECISIONS as readonly string[]).includes(value) ? (value as Decision) : null;
};

export type DecisionState = {
  errors: Record<string, string>;
  feedback: string;
  held?: HeldMatch[];
  conflict?: { by: string; decision: string; at: string };
};

// **Accept**, **Request revision** and **Reject** on one item (layer1-gates-and-queue#AC-26 to AC-28).
export async function decideAction(prev: DecisionState, form: FormData): Promise<DecisionState> {
  const projectId = String(form.get('projectId') ?? '');
  const itemId = String(form.get('itemId') ?? '');
  const feedback = String(form.get('feedback') ?? '');
  const answer = form.has('answer') ? String(form.get('answer') ?? '') : undefined;
  const decision = decisionOf(form);
  if (!decision) return { ...prev, feedback };
  const result = await decide((await me()).principal, projectId, [itemId], { decision, feedback, answer });
  if (!result.ok) return { errors: result.fields ?? (result.held ? {} : { feedback: result.message ?? 'Not allowed.' }), feedback, held: result.held };
  const skipped = result.value.skipped[0];
  if (result.value.decided.length === 0 && skipped) {
    return { errors: {}, feedback, conflict: { by: skipped.by, decision: skipped.decision, at: skipped.at.toISOString() } };
  }
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/review?${new URLSearchParams({ notice: 'decided', item: itemId })}`);
}

export type BatchState = { errors: Record<string, string>; message?: string };

// The batch buttons and **Accept all <n> in <stage>** (AC-29).
export async function batchAction(_prev: BatchState, form: FormData): Promise<BatchState> {
  const projectId = String(form.get('projectId') ?? '');
  const itemIds = form.getAll('items').map(String);
  const feedback = String(form.get('feedback') ?? '');
  const decision = decisionOf(form);
  if (!decision) return { errors: {} };
  const result = await decide((await me()).principal, projectId, itemIds, { decision, feedback });
  if (!result.ok) {
    if (result.held) return { errors: { feedback: 'Take the bank details or tax numbers out of the feedback.' } };
    return { errors: result.fields ?? {}, message: result.message };
  }
  const q = new URLSearchParams({ notice: 'batch', decision, n: String(result.value.decided.length) });
  const group = String(form.get('group') ?? '');
  if (group) q.set('stage', group);
  if (result.value.skipped.length) q.set('skipped', result.value.skipped.map((s) => s.id).join(','));
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/review?${q}`);
}

// **Hand to <delegate>** (AC-31).
export async function handAction(form: FormData): Promise<void> {
  const projectId = String(form.get('projectId') ?? '');
  const itemId = String(form.get('itemId') ?? '');
  const result = await handOn((await me()).principal, projectId, itemId);
  if (!result.ok) redirect(`/projects/${projectId}/review/${itemId}`);
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/review?${new URLSearchParams({ notice: 'handed', item: itemId })}`);
}

// **Withdraw** (AC-34).
export async function withdrawAction(form: FormData): Promise<void> {
  const projectId = String(form.get('projectId') ?? '');
  const itemId = String(form.get('itemId') ?? '');
  const result = await withdrawItem((await me()).principal, projectId, itemId);
  if (!result.ok) {
    const q = new URLSearchParams({ notice: 'not-withdrawn', item: itemId });
    redirect(`/projects/${projectId}/review/sent?${q}`);
  }
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/review/sent?${new URLSearchParams({ notice: 'withdrawn', item: itemId })}`);
}
