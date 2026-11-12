'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { editProject, startProject } from '@/record/commands';
import { signedIn } from '@/record/principal';
import { originOf } from '@/record/settings';
import { deliverInvitation } from '@/record/sign-in';

export type FormState = { errors: Record<string, string>; values: Record<string, string> };

async function signedInPerson() {
  const h = await headers();
  const me = await signedIn(h);
  if (!me) redirect('/sign-in');
  return { ...me, origin: originOf(h) };
}

async function principal() {
  return (await signedInPerson()).principal;
}

export async function startProjectAction(_prev: FormState, form: FormData): Promise<FormState> {
  const values = {
    name: String(form.get('name') ?? ''),
    brief: String(form.get('brief') ?? ''),
    organisationId: String(form.get('organisationId') ?? ''),
    ownerId: String(form.get('ownerId') ?? ''),
  };
  const actor = await signedInPerson();
  const result = await startProject(actor.principal, {
    name: values.name,
    brief: values.brief,
    organisationId: values.organisationId || null,
    ownerId: values.ownerId,
  });
  if (!result.ok) return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
  // An owner who has never signed in gets an account and an invitation (AC-30).
  if (result.value.ownerInvitation) {
    await deliverInvitation(result.value.ownerInvitation, {
      projectId: result.value.id,
      adder: actor.person.display,
      origin: actor.origin,
    });
  }
  revalidatePath('/', 'layout');
  redirect(`/projects/${result.value.id}?notice=started`);
}

export async function editProjectAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = String(form.get('projectId') ?? '');
  const values = { name: String(form.get('name') ?? ''), brief: String(form.get('brief') ?? '') };
  const result = await editProject(await principal(), id, values);
  if (!result.ok) return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
  revalidatePath('/', 'layout');
  redirect(`/projects/${id}?notice=saved`);
}
