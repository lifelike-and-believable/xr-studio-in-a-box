'use client';
import { ROLE_IDS, ROLE_LABELS, ROLE_PURPOSE, ROLE_TODAY, type RoleId } from '@xr/contracts';

// The eleven roles, each tied to what it is for and what it gives today (design-people-and-roles).
export function RoleCheckboxes({
  value,
  onChange,
  error,
  locked = [],
  lockedNote,
}: {
  value: RoleId[];
  onChange: (roles: RoleId[]) => void;
  error?: string;
  locked?: RoleId[];
  lockedNote?: string;
}) {
  return (
    <fieldset aria-describedby={['roles-hint', error ? 'roles-error' : ''].filter(Boolean).join(' ')}>
      <legend id="roles">Roles</legend>
      <p id="roles-hint" className="hint">
        Choose one or more, listed in this order everywhere. A person can see and do what any of their roles allows. No role gives an approval: approvers are named separately.
      </p>
      {error ? (
        <p id="roles-error" className="field-error">
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
      {ROLE_IDS.map((role) => {
        const isLocked = locked.includes(role);
        return (
          <div className="check" key={role}>
            <input
              type="checkbox"
              id={`role-${role}`}
              name="roles"
              value={role}
              checked={value.includes(role)}
              onChange={(e) => onChange(e.target.checked ? [...value, role] : value.filter((r) => r !== role))}
              disabled={isLocked}
              aria-describedby={`role-${role}-hint${isLocked ? ` role-${role}-locked` : ''}`}
            />
            {isLocked ? <input type="hidden" name="roles" value={role} /> : null}
            <div>
              <label htmlFor={`role-${role}`}>{ROLE_LABELS[role]}</label>
              <p id={`role-${role}-hint`} className="hint">
                {ROLE_PURPOSE[role]} In the dashboard today: {ROLE_TODAY[role]}
              </p>
              {isLocked && lockedNote ? (
                <p id={`role-${role}-locked`} className="hint">
                  {lockedNote}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}
