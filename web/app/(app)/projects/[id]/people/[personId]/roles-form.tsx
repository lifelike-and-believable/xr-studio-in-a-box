'use client';
import { permissionsFor, type RoleId } from '@xr/contracts';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { ErrorSummary } from '@/ui/error-summary';
import { RoleCheckboxes } from '@/ui/role-checkboxes';
import { Submit, useSubmit } from '@/ui/submit';
import { setRolesAction, type RolesState } from '../actions';

export const LAST_MANAGER =
  'You are the only person on this project who can add people and change roles, so this role stays until you give someone else the Director or Producer role.';

// **Change roles or remove** (layer1-organisations-projects-people#AC-32, AC-33).
export function RolesForm(props: {
  projectId: string;
  personId: string;
  display: string;
  roles: RoleId[];
  self: boolean;
  lastManager: boolean;
  otherManagers: string;
}) {
  const [state, action, pending] = useActionState<RolesState, FormData>(setRolesAction, { errors: {} });
  const submit = useSubmit(action, pending);
  const [roles, setRoles] = useState<RoleId[]>(props.roles);
  const locked: RoleId[] = props.lastManager ? props.roles.filter((r) => r === 'director' || r === 'producer') : [];
  const stillManages = permissionsFor(roles).has('manage-people');
  const errors = { ...state.errors, ...(state.message ? { roles: state.message } : {}) };
  return (
    <>
      <ErrorSummary errors={errors} ids={{ roles: 'roles' }} />
      <form onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={props.projectId} />
        <input type="hidden" name="personId" value={props.personId} />
        <RoleCheckboxes value={roles} onChange={setRoles} error={errors.roles} locked={locked} lockedNote={LAST_MANAGER} />
        {props.self ? (
          <section className="panel" aria-labelledby="before-save-title">
            <h2 id="before-save-title">Before you save</h2>
            <p aria-live="polite">
              {stillManages
                ? 'You will still be able to add people and change roles.'
                : `You will no longer be able to add people and change roles. ${props.otherManagers} can.`}
            </p>
          </section>
        ) : null}
        <div className="actions">
          <Submit pending={pending}>Save roles</Submit>
          <Link href={`/projects/${props.projectId}/people`}>Cancel</Link>
        </div>
      </form>
      {props.lastManager ? (
        <p>{LAST_MANAGER}</p>
      ) : (
        <form action={`/projects/${props.projectId}/people/${props.personId}/remove`} method="get">
          <button type="submit" className="danger">
            Remove {props.display} from the project
          </button>
        </form>
      )}
    </>
  );
}
