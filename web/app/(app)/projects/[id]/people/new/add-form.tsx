'use client';
import { usesDashboard, type RoleId } from '@xr/contracts';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { RoleCheckboxes } from '@/ui/role-checkboxes';
import { Submit, useSubmit } from '@/ui/submit';
import { addPersonAction, type PeopleState } from '../actions';

// **Add a person** (layer1-organisations-projects-people#AC-29, AC-30, AC-34).
export function AddForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState<PeopleState, FormData>(addPersonAction, {
    errors: {},
    values: { email: '', name: '', roles: [] },
  });
  const submit = useSubmit(action, pending);
  const [roles, setRoles] = useState<RoleId[]>(state.values.roles);
  const [email, setEmail] = useState(state.values.email);
  const [name, setName] = useState(state.values.name);
  const who = name.trim() || email.trim() || 'this person';
  const e = state.errors;
  const dashboard = usesDashboard(roles);
  return (
    <>
      <ErrorSummary errors={e} ids={{ email: 'email', roles: 'roles' }} />
      <form onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={projectId} />
        <label htmlFor="email">Email address</label>
        <FieldError id="email-error" message={e.email} />
        {state.existing && e.email ? (
          <p>
            <Link href={`/projects/${projectId}/people/${state.existing}`}>Change roles or remove</Link>
          </p>
        ) : null}
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          aria-invalid={e.email ? true : undefined}
          aria-describedby={describedBy(e.email && 'email-error')}
        />
        <label htmlFor="person-name">Name (optional)</label>
        <p id="name-hint" className="hint">If you leave it empty, the email address is shown instead.</p>
        <input id="person-name" name="name" type="text" value={name} onChange={(ev) => setName(ev.target.value)} aria-describedby="name-hint" />
        <RoleCheckboxes value={roles} onChange={setRoles} error={e.roles} />
        <section className="panel" aria-labelledby="before-title">
          <h2 id="before-title">Before you add {who}</h2>
          <div aria-live="polite">
            {roles.length === 0 ? (
              <p>Choose at least one role to see what they will be able to do.</p>
            ) : dashboard ? (
              <p>They will be able to open the project in the dashboard. They will get an invitation email with a link that works once, for 7 days.</p>
            ) : (
              <p>They will not use the dashboard, and XR Studio will not email them. They will get a link to their own page when there is something for them, so let them know.</p>
            )}
          </div>
        </section>
        <div className="actions">
          <Submit pending={pending}>Add person</Submit>
          <Link href={`/projects/${projectId}/people`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
