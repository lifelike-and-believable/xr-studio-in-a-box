'use client';
import { useActionState, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { Submit, useSubmit } from '@/ui/submit';
import { startProjectAction, type FormState } from '../actions';

type Org = { id: string; name: string; owners: { id: string; label: string }[] };

const IDS = { name: 'name', brief: 'brief', organisationId: 'organisation', ownerId: 'owner' };

// **Start a project** (layer1-organisations-projects-people#AC-19, AC-20, AC-21, AC-26).
export function StartForm({ me, organisations, preselect }: { me: { id: string; label: string }; organisations: Org[]; preselect?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(startProjectAction, { errors: {}, values: {} });
  const submit = useSubmit(action, pending);
  const [orgId, setOrgId] = useState(state.values.organisationId || preselect || organisations[0]?.id || '');
  const owners = organisations.find((o) => o.id === orgId)?.owners ?? [me];
  const [ownerId, setOwnerId] = useState(state.values.ownerId || me.id);
  const owner = owners.find((o) => o.id === ownerId) ?? me;
  const e = state.errors;
  return (
    <>
      <ErrorSummary errors={e} ids={IDS} />
      <form onSubmit={submit} noValidate>
        <label htmlFor="name">Project name</label>
        <FieldError id="name-error" message={e.name} />
        <input id="name" name="name" type="text" defaultValue={state.values.name} aria-invalid={e.name ? true : undefined} aria-describedby={describedBy(e.name && 'name-error')} />

        <label htmlFor="brief">Brief (optional)</label>
        <p id="brief-hint" className="hint">A few lines on the show. You can change it later.</p>
        <textarea id="brief" name="brief" rows={4} defaultValue={state.values.brief} aria-describedby="brief-hint" />

        {organisations.length > 0 ? (
          <>
            <label htmlFor="organisation">Organisation</label>
            <p id="organisation-hint" className="hint">Any organisation you look after or have projects in.</p>
            <FieldError id="organisation-error" message={e.organisationId} />
            <select
              id="organisation"
              name="organisationId"
              value={orgId}
              onChange={(ev) => {
                setOrgId(ev.target.value);
                setOwnerId(me.id);
              }}
              aria-describedby={describedBy('organisation-hint', e.organisationId && 'organisation-error')}
            >
              {organisations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <p className="label">Organisation</p>
            <p>A new organisation with the same name as the project will be made. You will look after it and can rename it later.</p>
            <input type="hidden" name="organisationId" value="" />
          </>
        )}

        <label htmlFor="owner">Owner</label>
        {organisations.length > 0 ? (
          <p id="owner-hint" className="hint">
            People already on this organisation&apos;s projects are listed. You cannot change the owner after the project starts yet.
          </p>
        ) : null}
        <FieldError id="owner-error" message={e.ownerId} />
        <select
          id="owner"
          name="ownerId"
          value={ownerId}
          onChange={(ev) => setOwnerId(ev.target.value)}
          aria-invalid={e.ownerId ? true : undefined}
          aria-describedby={describedBy(organisations.length > 0 && 'owner-hint', e.ownerId && 'owner-error')}
        >
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <section className="panel" aria-labelledby="when-title" aria-live="polite">
          <h2 id="when-title">When you start it</h2>
          <p>
            {owner.id === me.id
              ? 'You will own it and have the Director and Producer roles.'
              : `${owner.label} will own it and have the Director and Producer roles. You will have the Producer role.`}
          </p>
        </section>
        <div className="actions">
          <Submit pending={pending}>Start project</Submit>
        </div>
      </form>
    </>
  );
}
