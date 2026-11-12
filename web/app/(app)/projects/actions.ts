'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { editProject, startProject } from '@/record/commands';
import { signedIn } from '@/record/principal';

export type FormState = { errors: Record<string, string>; values: Record<string, string> };

async function principal() {
  const me = await signedIn(await headers());
  if (!me) redirect('/sign-in');
  return me.principal;
}

export async function startProjectAction(_prev: FormState, form: FormData): Promise<FormState> {
  const values = {
    name: String(form.get('name') ?? ''),
    brief: String(form.get('brief') ?? ''),
    organisationId: String(form.get('organisationId') ?? ''),
    ownerId: String(form.get('ownerId') ?? ''),
  };
  const result = await startProject(await principal(), {
    name: values.name,
    brief: values.brief,
    organisationId: values.organisationId || null,
    ownerId: values.ownerId,
  });
  if (!result.ok) return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
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
