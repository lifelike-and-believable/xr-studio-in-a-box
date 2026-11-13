'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { setAreaApprovers, setProtectedHolder } from '@/record/commands';
import { signedIn } from '@/record/principal';

export type ApproverState = { errors: Record<string, string>; values: Record<string, string> };

async function me() {
  const found = await signedIn(await headers());
  if (!found) redirect('/sign-in');
  return found;
}

// **Save <Area>** (layer1-gates-and-queue#AC-6, AC-9).
export async function setAreaAction(_prev: ApproverState, form: FormData): Promise<ApproverState> {
  const projectId = String(form.get('projectId') ?? '');
  const area = String(form.get('area') ?? '');
  const values = { approver: String(form.get('approver') ?? ''), delegate: String(form.get('delegate') ?? '') };
  const result = await setAreaApprovers((await me()).principal, projectId, area, { approverId: values.approver, delegateId: values.delegate || null });
  if (!result.ok) return { errors: result.fields ?? { approver: result.message ?? 'Not allowed.' }, values };
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/approvers?${new URLSearchParams({ notice: 'area', area })}`);
}

// **Save <approval>** (AC-7).
export async function setHolderAction(_prev: ApproverState, form: FormData): Promise<ApproverState> {
  const projectId = String(form.get('projectId') ?? '');
  const approval = String(form.get('approval') ?? '');
  const values = { holder: String(form.get('holder') ?? '') };
  const result = await setProtectedHolder((await me()).principal, projectId, approval, { holderId: values.holder });
  if (!result.ok) return { errors: result.fields ?? { holder: result.message ?? 'Not allowed.' }, values };
  revalidatePath(`/projects/${projectId}`, 'layout');
  redirect(`/projects/${projectId}/approvers?${new URLSearchParams({ notice: 'holder', approval })}`);
}
