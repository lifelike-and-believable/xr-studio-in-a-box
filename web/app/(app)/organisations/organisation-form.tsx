'use client';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { Submit, useSubmit } from '@/ui/submit';
import { createOrganisationAction, editOrganisationAction, type OrgState } from './actions';

type Choice = { id: string; label: string };

// Create or edit an organisation with **Looked after by**, which is never left empty
// (layer1-organisations-projects-people#AC-18, AC-23, AC-26).
export function OrganisationForm(props: {
  mode: 'create' | 'edit';
  organisationId?: string;
  name: string;
  choices: Choice[];
  stewardIds: string[];
}) {
  const [state, action, pending] = useActionState<OrgState, FormData>(
    props.mode === 'create' ? createOrganisationAction : editOrganisationAction,
    { errors: {}, values: { name: props.name, stewardIds: props.stewardIds } },
  );
  const submit = useSubmit(action, pending);
  const [ticked, setTicked] = useState<string[]>(state.values.stewardIds);
  const e = state.errors;
  return (
    <>
      <ErrorSummary errors={e} ids={{ name: 'name', stewardIds: 'stewards' }} />
      <form method="post" onSubmit={submit} noValidate>
        {props.organisationId ? <input type="hidden" name="organisationId" value={props.organisationId} /> : null}
        <label htmlFor="name">Organisation name</label>
        <FieldError id="name-error" message={e.name} />
        <input id="name" name="name" type="text" defaultValue={state.values.name} aria-invalid={e.name ? true : undefined} aria-describedby={describedBy(e.name && 'name-error')} />
        <fieldset aria-describedby="stewards-hint">
          <legend id="stewards">Looked after by</legend>
          <p id="stewards-hint" className="hint">
            People who look after an organisation can rename it and change who looks after it. You can add people from your projects.
          </p>
          <FieldError id="stewards-error" message={e.stewardIds} />
          {props.choices.map((c) => {
            const only = ticked.length === 1 && ticked[0] === c.id;
            return (
              <div className="check" key={c.id}>
                <input
                  type="checkbox"
                  id={`steward-${c.id}`}
                  name="stewardIds"
                  value={c.id}
                  checked={ticked.includes(c.id)}
                  disabled={only}
                  aria-describedby={only ? `steward-${c.id}-note` : undefined}
                  onChange={(ev) => setTicked(ev.target.checked ? [...ticked, c.id] : ticked.filter((id) => id !== c.id))}
                />
                {only ? <input type="hidden" name="stewardIds" value={c.id} /> : null}
                <div>
                  <label htmlFor={`steward-${c.id}`}>{c.label}</label>
                  {only ? (
                    <p id={`steward-${c.id}-note`} className="hint">
                      An organisation always has at least one person looking after it. Tick someone else first.
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </fieldset>
        <div className="actions">
          <Submit pending={pending}>{props.mode === 'create' ? 'Create organisation' : 'Save changes'}</Submit>
          <Link href={props.organisationId ? `/organisations/${props.organisationId}` : '/organisations'}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
