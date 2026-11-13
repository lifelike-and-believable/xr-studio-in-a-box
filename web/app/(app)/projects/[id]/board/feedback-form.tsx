'use client';
import { useActionState, useEffect, useRef, useState } from 'react';
import { FieldError, describedBy } from '@/ui/error-summary';
import { useSubmit } from '@/ui/submit';
import { feedbackAction, type FeedbackState } from './actions';

const nounList = (nouns: string[]) => (nouns.length <= 1 ? `a ${nouns[0] ?? 'number'}` : `a ${nouns.slice(0, -1).join(', a ')} or a ${nouns.at(-1)}`);

// **Add feedback on version <n>** (layer1-versions-board-first-view#AC-22, AC-23). Adding feedback
// decides nothing.
export function FeedbackForm({ projectId, itemId, version, back }: { projectId: string; itemId: string; version: number; back: string }) {
  const [state, action, pending] = useActionState<FeedbackState, FormData>(feedbackAction, { errors: {}, text: '' });
  const submit = useSubmit(action, pending);
  const [answering, setAnswering] = useState(false);
  const held = state.held ?? [];
  const nouns = [...new Set(held.flatMap((m) => m.formats.map((f) => f.noun)))];
  const errors: Record<string, string> = { ...state.errors };
  for (const m of held) errors.text = `Your feedback has "${m.text}", which looks like ${nounList(m.formats.map((f) => f.noun))}. Agents can read this, so take it out, or confirm it is not one.`;
  const id = `add-feedback-${version}`;
  return (
    <>
      {Object.keys(errors).length ? <FeedbackSummary errors={errors} id={id} /> : null}
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="back" value={back} />
        <div className="field">
          <label htmlFor={id}>Add feedback on version {version}</label>
          <p className="hint" id={`${id}-hint`}>
            Everyone on the project who uses the dashboard can read it. It cannot be edited or removed afterwards.
          </p>
          <FieldError id={`${id}-error`} message={errors.text} />
          <textarea
            id={id}
            name="text"
            defaultValue={state.text}
            aria-invalid={errors.text ? true : undefined}
            aria-describedby={describedBy(`${id}-hint`, errors.text && `${id}-error`)}
          />
        </div>
        {held.length ? (
          answering ? (
            <div className="field">
              <label htmlFor={`${id}-answer`}>What is it?</label>
              <FieldError id={`${id}-answer-error`} message={errors.answer} />
              <input type="text" id={`${id}-answer`} name="answer" aria-describedby={describedBy(errors.answer && `${id}-answer-error`)} />
            </div>
          ) : (
            <button type="button" className="secondary" onClick={() => setAnswering(true)}>
              {nouns.length > 1 ? 'It is none of these' : `It is not a ${nouns[0]}`}
            </button>
          )
        ) : null}
        <div className="actions">
          <button type="submit" disabled={pending} aria-disabled={pending}>
            Add feedback
          </button>
        </div>
      </form>
    </>
  );
}


// "Feedback not added", taking focus, as other error summaries do.
function FeedbackSummary({ errors, id }: { errors: Record<string, string>; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(errors);
  useEffect(() => {
    ref.current?.focus();
    document.title = `Error: ${document.title.replace(/^Error: /, '')}`;
  }, [key]);
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="summary" aria-labelledby={`${id}-summary`}>
      <h3 id={`${id}-summary`}>Feedback not added</h3>
      <ul>
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <a href={`#${field === 'answer' ? `${id}-answer` : id}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
