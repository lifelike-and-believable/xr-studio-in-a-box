'use client';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { useSubmit } from '@/ui/submit';
import { addWorkAction, type AddWorkState } from '../actions';

type StageGroup = { area: string; stages: { id: string; label: string }[] };
const IDS = { title: 'title', handoff: 'handoff', owner: 'owner', answer: 'answer' };
const nounList = (nouns: string[]) => (nouns.length <= 1 ? `a ${nouns[0] ?? 'number'}` : `a ${nouns.slice(0, -1).join(', a ')} or a ${nouns.at(-1)}`);

// The form keeps what was typed and chosen when the command answers with errors (AC-14).
export function AddWorkForm(props: { projectId: string; stages: StageGroup[]; owners: { id: string; label: string }[]; whoDecides: Record<string, string> }) {
  const [state, action, pending] = useActionState<AddWorkState, FormData>(addWorkAction, { errors: {} });
  const submit = useSubmit(action, pending);
  const [handoff, setHandoff] = useState('');
  const [answering, setAnswering] = useState(false);
  const held = state.held ?? [];
  const nouns = [...new Set(held.flatMap((m) => m.formats.map((f) => f.noun)))];
  const errors: Record<string, string> = { ...state.errors };
  for (const m of held) errors.title = `The title has "${m.text}", which looks like ${nounList(m.formats.map((f) => f.noun))}. Agents can read this, so take it out, or confirm it is not one.`;
  return (
    <>
      <ErrorSummary errors={errors} ids={IDS} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={props.projectId} />
        <div className="field">
          <label htmlFor={IDS.title}>Title</label>
          <FieldError id="title-error" message={errors.title} />
          <input type="text" id={IDS.title} name="title" aria-invalid={errors.title ? true : undefined} aria-describedby={describedBy(errors.title && 'title-error')} />
        </div>
        {held.length ? (
          answering ? (
            <div className="field">
              <label htmlFor={IDS.answer}>What is it?</label>
              <p className="hint" id="answer-hint">
                Say in a few words what the number is. It is recorded in Activity.
              </p>
              <FieldError id="answer-error" message={errors.answer} />
              <input type="text" id={IDS.answer} name="answer" aria-describedby={describedBy('answer-hint', errors.answer && 'answer-error')} />
            </div>
          ) : (
            <button type="button" className="secondary" onClick={() => setAnswering(true)}>
              {nouns.length > 1 ? 'It is none of these' : `It is not a ${nouns[0]}`}
            </button>
          )
        ) : null}
        <div className="field">
          <label htmlFor={IDS.handoff}>Stage</label>
          <FieldError id="handoff-error" message={errors.handoff} />
          <select
            id={IDS.handoff}
            name="handoff"
            value={handoff}
            onChange={(e) => setHandoff(e.target.value)}
            aria-invalid={errors.handoff ? true : undefined}
            aria-describedby={describedBy(errors.handoff && 'handoff-error')}
          >
            <option value="">Choose a stage</option>
            {props.stages.map((g) => (
              <optgroup key={g.area} label={g.area}>
                {g.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="panel" aria-live="polite">
          {props.whoDecides[handoff] ? <p>{props.whoDecides[handoff]}</p> : null}
        </div>
        <div className="field">
          <label htmlFor={IDS.owner}>Owner</label>
          <p className="hint" id="owner-hint">
            The person who makes it. They see it under What needs you.
          </p>
          <FieldError id="owner-error" message={errors.owner} />
          <select id={IDS.owner} name="ownerId" defaultValue="" aria-invalid={errors.owner ? true : undefined} aria-describedby={describedBy('owner-hint', errors.owner && 'owner-error')}>
            <option value="">Choose a person</option>
            {props.owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button type="submit" disabled={pending} aria-disabled={pending}>
            Add work
          </button>
          <Link href={`/projects/${props.projectId}/board`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
