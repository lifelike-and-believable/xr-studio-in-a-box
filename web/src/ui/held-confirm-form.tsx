'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { confirmUploadAction, type UploadConfirmState } from '../../app/(app)/facts-actions';
import { ANSWER_HINT } from './confirm-form';
import { ErrorSummary, FieldError, describedBy } from './error-summary';
import { useSubmit } from './submit';

// "What is it?" for a held file; confirming adds it (layer1-facts-identifiers-activity#AC-25).
export function HeldConfirmForm({ ownerKind, ownerId, uploadId, fileName, backHref }: { ownerKind: string; ownerId: string; uploadId: string; fileName: string; backHref: string }) {
  const [state, action, pending] = useActionState<UploadConfirmState, FormData>(confirmUploadAction, { errors: {}, answer: '' });
  const submit = useSubmit(action, pending);
  return (
    <>
      <ErrorSummary errors={state.errors} ids={{ answer: 'answer' }} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="ownerKind" value={ownerKind} />
        <input type="hidden" name="ownerId" value={ownerId} />
        <input type="hidden" name="uploadId" value={uploadId} />
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
            Confirm and add {fileName}
          </button>
          <Link href={backHref}>Go back</Link>
        </div>
      </form>
    </>
  );
}
