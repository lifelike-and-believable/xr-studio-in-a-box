'use server';
import type { RoleId } from '@xr/contracts';
import { RoleIdSchema } from '@xr/contracts';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addPerson, reissueInvitation, removePerson, setRoles } from '@/record/commands';
import { sentWithinAMinute } from '@/record/mail';
import { signedIn } from '@/record/principal';
import { sendAddedMail, sendInvitation } from '@/record/sign-in';
import { originOf } from '@/record/settings';

export type PeopleState = { errors: Record<string, string>; values: { email: string; name: string; roles: RoleId[] }; existing?: string };

async function me() {
  const h = await headers();
  const found = await signedIn(h);
  if (!found) redirect('/sign-in');
  return { ...found, origin: originOf(h) };
}

const rolesFrom = (form: FormData): RoleId[] =>
  form.getAll('roles').flatMap((r) => {
    const parsed = RoleIdSchema.safeParse(r);
    return parsed.success ? [parsed.data] : [];
  });

export async function addPersonAction(_prev: PeopleState, form: FormData): Promise<PeopleState> {
  const projectId = String(form.get('projectId') ?? '');
  const values = { email: String(form.get('email') ?? ''), name: String(form.get('name') ?? ''), roles: rolesFrom(form) };
  const actor = await me();
  const result = await addPerson(actor.principal, projectId, values);
  if (!result.ok) return { errors: result.fields ?? { email: result.message ?? 'Not allowed.' }, values, existing: result.personId };
  const mail = await sendAddedMail(result.value, { projectId, adder: actor.person.display, origin: actor.origin });
  const kind = mail === 'none' ? 'none' : mail === 'sent' ? result.value.outcome : 'failed';
  const q = new URLSearchParams({ notice: 'added', person: result.value.personId, mail: kind });
  revalidatePath('/', 'layout');
  redirect(`/projects/${projectId}/people?${q}`);
}

export async function resendAction(form: FormData): Promise<void> {
  const projectId = String(form.get('projectId') ?? '');
  const personId = String(form.get('personId') ?? '');
  const actor = await me();
  const q = new URLSearchParams({ person: personId });
  const email = String(form.get('email') ?? '');
  // Checked first, so a refused resend leaves the earlier link working (AC-31).
  if (email && (await sentWithinAMinute(email))) {
    q.set('notice', 'wait');
    revalidatePath('/', 'layout');
    redirect(`/projects/${projectId}/people?${q}`);
  }
  const result = await reissueInvitation(actor.principal, projectId, personId);
  if (!result.ok) redirect(`/projects/${projectId}/people`);
  const outcome = await sendInvitation(result.value.email, result.value.token, {
    projectName: String(form.get('projectName') ?? ''),
    adder: actor.person.display,
    origin: actor.origin,
    roles: result.value.roles,
  });
  q.set('notice', outcome === 'sent' ? 'resent' : outcome === 'limited' ? 'wait' : 'resend-failed');
  revalidatePath('/', 'layout');
  redirect(`/projects/${projectId}/people?${q}`);
}

export type RolesState = { errors: Record<string, string>; message?: string };

export async function setRolesAction(_prev: RolesState, form: FormData): Promise<RolesState> {
  const projectId = String(form.get('projectId') ?? '');
  const personId = String(form.get('personId') ?? '');
  const roles = rolesFrom(form);
  // Unticking every role is a removal, with the same confirmation (AC-32).
  if (roles.length === 0) redirect(`/projects/${projectId}/people/${personId}/remove`);
  const result = await setRoles((await me()).principal, projectId, personId, { roles });
  if (!result.ok) return { errors: result.fields ?? {}, message: result.message };
  revalidatePath('/', 'layout');
  redirect(`/projects/${projectId}/people?notice=roles&person=${personId}`);
}

export async function removeAction(form: FormData): Promise<void> {
  const projectId = String(form.get('projectId') ?? '');
  const personId = String(form.get('personId') ?? '');
  const result = await removePerson((await me()).principal, projectId, personId);
  if (!result.ok) redirect(`/projects/${projectId}/people/${personId}`);
  const q = new URLSearchParams({ notice: 'removed', who: result.value.display });
  revalidatePath('/', 'layout');
  redirect(`/projects/${projectId}/people?${q}`);
}
