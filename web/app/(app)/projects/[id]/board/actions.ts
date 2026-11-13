'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addFeedback, addWork, changeOwner, removeWork, restoreVersion, withdrawItem, type HeldFile, type HeldMatch } from '@/record/commands';
import { signedIn } from '@/record/principal';

// The slice 4 forms (layer1-versions-board-first-view). Each goes to the command layer.

async function me() {
  const found = await signedIn(await headers());
  if (!found) redirect('/sign-in');
  return found;
}

const text = (form: FormData, name: string) => String(form.get(name) ?? '');
const optional = (form: FormData, name: string) => (form.has(name) ? text(form, name) : undefined);
const workPath = (projectId: string, workId: string) => `/projects/${projectId}/board/${workId}`;

export type AddWorkState = { errors: Record<string, string>; held?: HeldMatch[] };

// **Add work** (AC-12 to AC-14).
export async function addWorkAction(_prev: AddWorkState, form: FormData): Promise<AddWorkState> {
  const projectId = text(form, 'projectId');
  const result = await addWork((await me()).principal, projectId, {
    title: text(form, 'title'),
    handoff: text(form, 'handoff'),
    ownerId: text(form, 'ownerId'),
    answer: optional(form, 'answer'),
  });
  if (!result.ok) return { errors: result.fields ?? {}, held: result.held };
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`${workPath(projectId, result.value.workId)}?notice=added`);
}

// **Change owner** (AC-15).
export async function changeOwnerAction(form: FormData): Promise<void> {
  const projectId = text(form, 'projectId');
  const workId = text(form, 'workId');
  const result = await changeOwner((await me()).principal, projectId, workId, { ownerId: text(form, 'ownerId') });
  revalidatePath(`/projects/${projectId}`, 'layout');
  if (!result.ok) redirect(workPath(projectId, workId));
  redirect(`${workPath(projectId, workId)}?notice=owner`);
}

// **Remove <title>** (AC-16).
export async function removeWorkAction(form: FormData): Promise<void> {
  const projectId = text(form, 'projectId');
  const workId = text(form, 'workId');
  const result = await removeWork((await me()).principal, projectId, workId);
  revalidatePath(`/projects/${projectId}`, 'layout');
  if (!result.ok) redirect(`${workPath(projectId, workId)}?notice=not-removed`);
  redirect(`/projects/${projectId}/board?${new URLSearchParams({ notice: 'removed', title: result.value.title })}`);
}

export type FeedbackState = { errors: Record<string, string>; held?: HeldMatch[]; text: string };

// **Add feedback** (AC-22, AC-23). Returns to the page it was added on.
export async function feedbackAction(_prev: FeedbackState, form: FormData): Promise<FeedbackState> {
  const projectId = text(form, 'projectId');
  const back = text(form, 'back');
  const entry = text(form, 'text');
  const result = await addFeedback((await me()).principal, projectId, text(form, 'itemId'), { text: entry, answer: optional(form, 'answer') });
  if (!result.ok) return { errors: result.fields ?? (result.held ? {} : { text: result.message ?? 'Not allowed.' }), held: result.held, text: entry };
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`${back.startsWith(`/projects/${projectId}/`) ? back : `/projects/${projectId}/board`}?notice=feedback`);
}

export type RestoreState = { errors: Record<string, string>; held?: HeldMatch[]; heldFile?: HeldFile; conflict?: string };

// **Restore version <n>** (AC-30, AC-31).
export async function restoreAction(_prev: RestoreState, form: FormData): Promise<RestoreState> {
  const projectId = text(form, 'projectId');
  const workId = text(form, 'workId');
  const result = await restoreVersion((await me()).principal, projectId, workId, {
    version: Number(text(form, 'version')),
    whatChanged: text(form, 'whatChanged'),
    answer: optional(form, 'answer'),
    fileAnswer: optional(form, 'fileAnswer'),
  });
  if (!result.ok) {
    if (result.status === 409) return { errors: {}, conflict: result.message };
    return { errors: result.fields ?? {}, held: result.held, heldFile: result.heldFile };
  }
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`${workPath(projectId, workId)}?notice=restored`);
}

// **Withdraw version <n>** on a work's page, for its sender; returns to the work's page.
export async function withdrawVersionAction(form: FormData): Promise<void> {
  const projectId = text(form, 'projectId');
  const workId = text(form, 'workId');
  const result = await withdrawItem((await me()).principal, projectId, text(form, 'itemId'));
  revalidatePath(`/projects/${projectId}`, 'layout');
  if (!result.ok) redirect(workPath(projectId, workId));
  redirect(`${workPath(projectId, workId)}?notice=withdrawn`);
}
