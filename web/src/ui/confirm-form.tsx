'use client';
import { formatList } from '@xr/contracts';
import Link from 'next/link';
import { useActionState } from 'react';
import { confirmFactAction, type ConfirmState } from '../../app/(app)/facts-actions';
import { ErrorSummary, FieldError, describedBy } from './error-summary';
import { draftKey, useStoredDraft } from './stored-draft';
import { useSubmit } from './submit';

export const ANSWER_HINT =
  'A few words, like "catalogue number for the lantern prop". Recorded in Activity with your name, so do not type the number itself or any bank or tax details here.';

// The "What is it?" confirmation for text in a fact (layer1-facts-identifiers-activity#AC-23). The
// edit page hands over the box's text through session storage, so it never goes in an address.
export function ConfirmForm({
  ownerKind,
  ownerId,
  fact,
  noun,
  labels,
  editHref,
  where,
}: {
  ownerKind: 'project' | 'organisation';
  ownerId: string;
  fact: string;
  noun: string;
  labels: Record<string, string>;
  editHref: string;
  where: string;
}) {
  const draft = useStoredDraft(draftKey(ownerId, fact));
  const [state, action, pending] = useActionState<ConfirmState, FormData>(confirmFactAction, { errors: {}, answer: '' });
  const submit = useSubmit(action, pending);
  if (draft === undefined) return null;
  if (!draft || draft.held.length === 0) {
    return (
      <>
        <h2>Nothing to confirm</h2>
        <p>
          Start from the edit page: save the text, and if it is stopped, choose the confirm button there.{' '}
          <Link href={editHref}>Go back and edit the text</Link>
        </p>
      </>
    );
  }
  const nouns = [...new Set(draft.held.flatMap((m) => m.formats.map((f) => f.noun)))];
  const single = nouns.length === 1;
  return (
    <>
      <ErrorSummary errors={state.errors} ids={{ answer: 'answer' }} />
      <h2>{single ? `Confirm it is not ${formatList(nouns)}` : 'Confirm it is none of these'}</h2>
      {draft.held.map((m, i) => (
        <div key={i}>
          <p>
            You are saving this text in <strong>{labels[m.field] ?? m.field}</strong>:
          </p>
          <p className="quote">
            <mark>{m.text}</mark>
          </p>
          <p>
            It matches {m.formats.length === 1 ? 'the format for' : 'the formats for'} {formatList(m.formats.map((f) => f.noun))}.
          </p>
        </div>
      ))}
      <p>
        Confirm only if it is something else. Your confirmation is recorded in {where} with your name, the time and your answer below; the
        matching text itself is not copied there.
      </p>
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="ownerKind" value={ownerKind} />
        <input type="hidden" name="ownerId" value={ownerId} />
        <input type="hidden" name="fact" value={fact} />
        <input type="hidden" name="baseVersion" value={draft.baseVersion} />
        {draft.restoreFrom ? <input type="hidden" name="restoreFrom" value={draft.restoreFrom} /> : null}
        {Object.entries(draft.values).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <div className="field">
          <label htmlFor="answer">What is it?</label>
          <p className="hint" id="answer-hint">
            {ANSWER_HINT}
          </p>
          <FieldError id="answer-error" message={state.errors.answer} />
          <input
            id="answer"
            name="answer"
            type="text"
            defaultValue={state.answer}
            key={state.answer}
            aria-invalid={state.errors.answer ? true : undefined}
            aria-describedby={describedBy('answer-hint', state.errors.answer && 'answer-error')}
          />
        </div>
        <div className="actions">
          <button type="submit" disabled={pending} aria-disabled={pending}>
            Confirm and save {noun}
          </button>
          <Link href={`${editHref}?draft=1`}>Go back and edit the text</Link>
        </div>
      </form>
    </>
  );
}
