'use client';
import { factDisplay, formatList, type Fact, type FactValue } from '@xr/contracts';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { saveFactAction, type FactFormState } from '../../app/(app)/facts-actions';
import type { HeldMatch } from '@/record/commands';
import { ErrorSummary, FieldError, describedBy } from './error-summary';
import { draftKey, useStoredDraft, type Draft } from './stored-draft';
import { useSubmit } from './submit';

export type FieldSpec = { name: string; label: string; hint?: string; multiline: boolean; inputMode?: 'numeric' };


const nounsOf = (held: HeldMatch[]) => [...new Set(held.flatMap((m) => m.formats.map((f) => f.noun)))];
const clock = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));

// The "Not saved" summary (layer1-facts-identifiers-activity#AC-21, AC-22): it takes focus, quotes
// each match in `mark`, names its field and formats, and the title starts "Error: Not saved".
function HeldSummary({ held, labels, intro }: { held: HeldMatch[]; labels: Record<string, string>; intro: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const nouns = nounsOf(held);
  const heading = `Not saved: this looks like ${formatList(nouns)}`;
  useEffect(() => {
    ref.current?.focus();
    const base = document.title.replace(/^Error: (Not saved: [^-]+ - )?/, '');
    document.title = `Error: ${heading} - ${base}`;
  }, [heading]);
  const single = nouns.length === 1;
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="summary" aria-labelledby="held-title">
      <h2 id="held-title">{heading}</h2>
      <ul>
        {held.map((m, i) => (
          <li key={i}>
            <a href={`#${m.field}`}>
              {labels[m.field] ?? m.field}: &quot;<mark>{m.text}</mark>&quot; matches{' '}
              {m.formats.length === 1
                ? `the format for ${formatList(m.formats.map((f) => f.noun))}`
                : `the formats for ${m.formats.map((f) => formatList([f.noun])).join(' and for ')}`}
            </a>
          </li>
        ))}
      </ul>
      <p>
        {intro} Take it out and save again, or, if it is {single ? `not ${formatList(nouns)}` : 'none of these'}, for example a catalogue
        or ticket number, choose <strong>{single ? `It is not ${formatList(nouns)}` : 'It is none of these'}</strong>. Any changes you make in
        the box first are kept.
      </p>
    </div>
  );
}

function ConflictSummary({ conflict, noun }: { conflict: NonNullable<FactFormState['conflict']>; noun: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const heading = `Check before saving: ${conflict.by} saved a new ${noun} at ${clock(conflict.at)}`;
  useEffect(() => {
    ref.current?.focus();
    document.title = `Error: ${document.title.replace(/^Error: /, '')}`;
  }, [heading]);
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="summary" aria-labelledby="conflict-title">
      <h2 id="conflict-title">{heading}</h2>
      <p>{conflict.by} saved after you opened this page, so your text has not been saved. Nothing is overwritten.</p>
      <ul>
        <li>
          <a href="#their-version">Read {conflict.by}&apos;s version</a>
        </li>
        <li>
          <a href="#fact-fields">Your text, still in the box</a>
        </li>
      </ul>
      <p>
        Save the text you want. {conflict.by}&apos;s version stays in the earlier versions either way. <strong>Cancel</strong> leaves without
        saving your text.
      </p>
    </div>
  );
}

export function FactForm({
  ownerKind,
  ownerId,
  fact,
  noun,
  fields,
  values,
  baseVersion,
  saveLabel,
  cancelHref,
  confirmHref,
  intro,
  held,
  restoreFrom,
  children,
}: {
  ownerKind: 'project' | 'organisation';
  ownerId: string;
  fact: Fact;
  noun: string;
  fields: FieldSpec[];
  values: Record<string, string>;
  baseVersion: number;
  saveLabel: string;
  cancelHref: string;
  confirmHref: string;
  intro: string;
  held?: HeldMatch[];
  restoreFrom?: number;
  children?: ReactNode;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const stored = useStoredDraft(draftKey(ownerId, fact));
  const [dismissed, setDismissed] = useState(false);
  // Back from the confirmation page: the text the person had is put back (AC-23).
  const draft = search.get('draft') === '1' && !dismissed ? stored : null;
  const [state, action, pending] = useActionState<FactFormState, FormData>(saveFactAction, {
    errors: {},
    values,
    baseVersion,
    held,
    restoreFrom,
  });
  const submit = useSubmit(action, pending);

  // "It is not a <format>" sends the box's text to the confirmation page (AC-23).
  useEffect(() => {
    if (!state.goConfirm || !state.held?.length) return;
    const next: Draft = { values: state.values, baseVersion: state.baseVersion, held: state.held, restoreFrom: state.restoreFrom ?? draft?.restoreFrom };
    sessionStorage.setItem(draftKey(ownerId, fact), JSON.stringify(next));
    router.push(confirmHref);
    // `draft` is read once, when the confirmation is asked for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ownerId, fact, router, confirmHref]);

  const shown = draft?.values ?? state.values;
  const base = draft?.baseVersion ?? state.baseVersion;
  const labels = Object.fromEntries(fields.map((f) => [f.name, f.label]));
  const heldNow = state.goConfirm ? undefined : state.held;
  const nouns = heldNow ? nounsOf(heldNow) : [];
  const fieldErrors: Record<string, string> = { ...state.errors };
  if (heldNow?.length) {
    for (const f of fields) {
      const here = heldNow.filter((m) => m.field === f.name);
      if (here.length === 0) continue;
      const texts = here.map((m) => `"${m.text}"`).join(' and ');
      fieldErrors[f.name] =
        nouns.length === 1 ? `Take out ${texts}, or confirm it is not ${formatList(nouns)}.` : `Take out ${texts}, or confirm it is none of these.`;
    }
  }
  const conflict = state.conflict;
  return (
    <>
      {heldNow?.length ? <HeldSummary held={heldNow} labels={labels} intro={intro} /> : null}
      {conflict ? <ConflictSummary conflict={conflict} noun={noun} /> : null}
      {!heldNow?.length && !conflict ? <ErrorSummary errors={state.errors} ids={Object.fromEntries(fields.map((f) => [f.name, f.name]))} /> : null}
      {children}
      {conflict ? (
        <>
          <h3 id="their-version" tabIndex={-1}>
            {conflict.by}&apos;s version, saved at {clock(conflict.at)}
          </h3>
          <p className="quote">{display(fact, conflict.values)}</p>
        </>
      ) : null}
      <form
        method="post"
        onSubmit={(event) => {
          submit(event);
          setDismissed(true);
        }}
        noValidate key={JSON.stringify(shown) + String(base)} id="fact-fields">
        <input type="hidden" name="ownerKind" value={ownerKind} />
        <input type="hidden" name="ownerId" value={ownerId} />
        <input type="hidden" name="fact" value={fact} />
        <input type="hidden" name="baseVersion" value={base} />
        {fields.map((f) => {
          const error = fieldErrors[f.name];
          const props = {
            id: f.name,
            name: f.name,
            defaultValue: shown[f.name] ?? '',
            'aria-invalid': error ? true : undefined,
            'aria-describedby': describedBy(f.hint && `${f.name}-hint`, error && `${f.name}-error`),
          };
          return (
            <div className="field" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              {f.hint ? (
                <p className="hint" id={`${f.name}-hint`}>
                  {f.hint}
                </p>
              ) : null}
              <FieldError id={`${f.name}-error`} message={error} />
              {f.multiline ? <textarea rows={6} {...props} /> : <input type="text" inputMode={f.inputMode} {...props} />}
            </div>
          );
        })}
        <div className="actions">
          <button type="submit" name="intent" value="save" disabled={pending} aria-disabled={pending}>
            {conflict ? `Save my ${noun}` : saveLabel}
          </button>
          {heldNow?.length ? (
            <button type="submit" name="intent" value="confirm" className="secondary" disabled={pending}>
              {nouns.length === 1 ? `It is not ${formatList(nouns)}` : 'It is none of these'}
            </button>
          ) : null}
          <Link href={cancelHref}>Cancel</Link>
        </div>
      </form>
    </>
  );
}

function display(fact: Fact, values: Record<string, string>): string {
  const n = (s: string | undefined) => Number(s ?? 0);
  const value: FactValue =
    'total' in values
      ? { total: n(values.total), note: values.note ?? '' }
      : 'guests' in values
        ? { guests: n(values.guests), online: n(values.online) }
        : 'applicantName' in values
          ? { applicantName: values.applicantName ?? '', category: values.category ?? '', profileNumber: values.profileNumber ?? '', mandate: values.mandate ?? '' }
          : { text: values.text ?? '' };
  return factDisplay(fact, value);
}
