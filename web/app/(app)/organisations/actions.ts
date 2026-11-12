'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createOrganisation, editOrganisation } from '@/record/commands';
import { signedIn } from '@/record/principal';

export type OrgState = { errors: Record<string, string>; values: { name: string; stewardIds: string[] } };

async function principal() {
  const me = await signedIn(await headers());
  if (!me) redirect('/sign-in');
  return me.principal;
}

const read = (form: FormData) => ({
  name: String(form.get('name') ?? ''),
  stewardIds: form.getAll('stewardIds').map(String),
});

export async function createOrganisationAction(_prev: OrgState, form: FormData): Promise<OrgState> {
  const values = read(form);
  const result = await createOrganisation(await principal(), values);
  if (!result.ok) return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
  revalidatePath('/', 'layout');
  redirect(`/organisations/${result.value.id}`);
}

export async function editOrganisationAction(_prev: OrgState, form: FormData): Promise<OrgState> {
  const id = String(form.get('organisationId') ?? '');
  const values = read(form);
  const result = await editOrganisation(await principal(), id, values);
  if (!result.ok) return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
  revalidatePath('/', 'layout');
  redirect(`/organisations/${id}?notice=saved`);
}
