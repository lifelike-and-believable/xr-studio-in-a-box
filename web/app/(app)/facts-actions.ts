'use server';
import { factFormValues, isFunderFact, type Fact } from '@xr/contracts';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  addFormat,
  confirmFact,
  confirmUpload,
  deleteUpload,
  removeFormat,
  removeWorkSample,
  restoreFact,
  saveFact,
  setFormat,
  type HeldMatch,
  type Owner,
} from '@/record/commands';
import { signedIn } from '@/record/principal';
import { factsPath, historyPath, editPath, samplesPath } from '@/ui/paths';

// Server actions for the slice 2 forms. Each goes to the command layer and answers with the
// state the form shows again, or redirects to the page that shows the outcome.

async function principal() {
  const me = await signedIn(await headers());
  if (!me) redirect('/sign-in');
  return me.principal;
}

function ownerFrom(form: FormData): Owner {
  return { kind: form.get('ownerKind') === 'organisation' ? 'organisation' : 'project', id: String(form.get('ownerId') ?? '') };
}

const FIELDS = ['text', 'total', 'note', 'guests', 'online', 'applicantName', 'category', 'profileNumber', 'mandate'];
const valuesFrom = (form: FormData) =>
  Object.fromEntries(FIELDS.filter((f) => form.has(f)).map((f) => [f, String(form.get(f) ?? '')]));

export type FactFormState = {
  errors: Record<string, string>;
  values: Record<string, string>;
  baseVersion: number;
  held?: HeldMatch[];
  conflict?: { by: string; at: string; version: number; values: Record<string, string> };
  goConfirm?: boolean;
  restoreFrom?: number;
};

// The organisation page already uses `saved` for its own name and stewards (slice 1).
const savedNotice = (owner: Owner, fact: Fact) => (isFunderFact(fact) ? 'profile-saved' : owner.kind === 'organisation' ? 'fact-saved' : 'saved');

const q = (params: Record<string, string | number>) => new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();

export async function saveFactAction(prev: FactFormState, form: FormData): Promise<FactFormState> {
  const owner = ownerFrom(form);
  const fact = String(form.get('fact') ?? '') as Fact;
  const values = valuesFrom(form);
  const intent = String(form.get('intent') ?? 'save');
  const baseVersion = Number(form.get('baseVersion') ?? 0);
  const restoreFrom = prev.restoreFrom;
  const result = await saveFact(await principal(), owner, fact, { values, baseVersion });
  if (result.ok) redirect(`${factsPath(owner)}?${q({ notice: savedNotice(owner, fact), fact })}`);
  if (result.status === 403 || result.status === 404) return { errors: { text: 'Not allowed.' }, values, baseVersion };
  if (result.conflict) {
    return {
      errors: {},
      values,
      // Saving again from here saves over the version the person has now seen (AC-8).
      baseVersion: result.conflict.version,
      conflict: { ...result.conflict, at: result.conflict.at.toISOString(), values: factFormValues(fact, result.conflict.values) },
      restoreFrom,
    };
  }
  if (result.held) return { errors: {}, values, baseVersion, held: result.held, goConfirm: intent === 'confirm', restoreFrom };
  return { errors: result.fields ?? {}, values, baseVersion, restoreFrom };
}

export type ConfirmState = { errors: Record<string, string>; answer: string; conflict?: boolean };

export async function confirmFactAction(_prev: ConfirmState, form: FormData): Promise<ConfirmState> {
  const owner = ownerFrom(form);
  const fact = String(form.get('fact') ?? '') as Fact;
  const answer = String(form.get('answer') ?? '');
  const restore = Number(form.get('restoreFrom') ?? 0);
  const result = await confirmFact(await principal(), owner, fact, {
    values: valuesFrom(form),
    baseVersion: Number(form.get('baseVersion') ?? 0),
    answer,
    restoreFrom: restore > 0 ? restore : undefined,
  });
  if (result.ok) {
    const first = result.value.confirmed[0];
    if (first) {
      // The confirmed text is shown once in the notice and is not put in the address.
      (await cookies()).set('xr-confirmed', JSON.stringify({ text: first.text, nouns: result.value.confirmed.flatMap((m) => m.formats.map((f) => f.noun)) }), {
        path: '/',
        maxAge: 60,
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    redirect(`${factsPath(owner)}?${q({ notice: first ? 'confirmed' : savedNotice(owner, fact), fact })}`);
  }
  if (result.conflict) return { errors: { answer: 'Someone else saved this fact meanwhile. Go back and edit the text to see their version.' }, answer, conflict: true };
  return { errors: result.fields ?? { answer: result.message ?? 'Not allowed.' }, answer };
}

export async function restoreFactAction(form: FormData): Promise<void> {
  const owner = ownerFrom(form);
  const fact = String(form.get('fact') ?? '') as Fact;
  const version = Number(form.get('version') ?? 0);
  const result = await restoreFact(await principal(), owner, fact, version);
  if (result.ok) redirect(`${factsPath(owner)}?${q({ notice: 'restored', fact, from: version, to: result.value.version })}`);
  if (result.held) redirect(`${editPath(owner, fact)}?${q({ restore: version })}`);
  redirect(historyPath(owner, fact));
}

export async function removeSampleAction(form: FormData): Promise<void> {
  const owner = ownerFrom(form);
  const result = await removeWorkSample(await principal(), owner, String(form.get('fileId') ?? ''));
  redirect(`${samplesPath(owner)}${result.ok ? `?${q({ notice: 'removed', title: result.value.title })}` : ''}`);
}

export async function deleteUploadAction(form: FormData): Promise<void> {
  const owner = ownerFrom(form);
  const result = await deleteUpload(await principal(), owner, String(form.get('uploadId') ?? ''));
  redirect(`${samplesPath(owner)}${result.ok ? `?${q({ notice: 'deleted', file: result.value.fileName })}` : ''}`);
}

export type UploadConfirmState = { errors: Record<string, string>; answer: string };

export async function confirmUploadAction(_prev: UploadConfirmState, form: FormData): Promise<UploadConfirmState> {
  const owner = ownerFrom(form);
  const answer = String(form.get('answer') ?? '');
  const result = await confirmUpload(await principal(), owner, String(form.get('uploadId') ?? ''), { answer });
  if (result.ok) redirect(`${samplesPath(owner)}?${q({ notice: 'confirmed', title: result.value.title, file: result.value.fileName, nouns: result.value.formats.map((f) => f.noun).join('|') })}`);
  if (result.status === 404) return { errors: { answer: 'This file can no longer be confirmed. It was deleted at the end of its time, or already added.' }, answer };
  return { errors: result.fields ?? { answer: result.message ?? 'Not allowed.' }, answer };
}

export type FormatState = { errors: Record<string, string>; values: Record<string, string> };

export async function addFormatAction(_prev: FormatState, form: FormData): Promise<FormatState> {
  const organisationId = String(form.get('organisationId') ?? '');
  const values = { name: String(form.get('name') ?? ''), pattern: String(form.get('pattern') ?? ''), example: String(form.get('example') ?? '') };
  const result = await addFormat(await principal(), organisationId, values);
  if (result.ok) redirect(`/organisations/${organisationId}/identifier-formats?${q({ notice: 'added', name: result.value.name })}`);
  return { errors: result.fields ?? { name: result.message ?? 'Not allowed.' }, values };
}

export async function setFormatAction(form: FormData): Promise<void> {
  const organisationId = String(form.get('organisationId') ?? '');
  const on = form.get('on') === 'true';
  const result = await setFormat(await principal(), organisationId, String(form.get('formatId') ?? ''), { on });
  redirect(`/organisations/${organisationId}/identifier-formats${result.ok ? `?${q({ notice: on ? 'on' : 'off', name: result.value.name })}` : ''}`);
}

export async function removeFormatAction(form: FormData): Promise<void> {
  const organisationId = String(form.get('organisationId') ?? '');
  const result = await removeFormat(await principal(), organisationId, String(form.get('formatId') ?? ''));
  redirect(`/organisations/${organisationId}/identifier-formats${result.ok ? `?${q({ notice: 'removed', name: result.value.name })}` : ''}`);
}

