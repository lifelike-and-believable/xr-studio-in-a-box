'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { Submit, useSubmit } from '@/ui/submit';
import { setAreaAction, setHolderAction, type ApproverState } from './actions';

type Choice = { id: string; label: string };

const LIST_HINT = 'Only people on this project who use the dashboard are listed. An agent can never approve.';

// **<Area>: approver and delegate** (layer1-gates-and-queue#AC-6, AC-8, AC-9).
export function AreaForm(props: { projectId: string; area: string; label: string; choices: Choice[]; approver: string; delegate: string }) {
  const [state, action, pending] = useActionState<ApproverState, FormData>(setAreaAction, {
    errors: {},
    values: { approver: props.approver, delegate: props.delegate },
  });
  const submit = useSubmit(action, pending);
  const e = state.errors;
  return (
    <>
      <ErrorSummary errors={e} ids={{ approver: 'approver', delegate: 'delegate' }} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={props.projectId} />
        <input type="hidden" name="area" value={props.area} />
        <div className="field">
          <label htmlFor="approver">Approver</label>
          <p className="hint" id="approver-hint">
            {LIST_HINT}
          </p>
          <FieldError id="approver-error" message={e.approver} />
          <select
            id="approver"
            name="approver"
            defaultValue={state.values.approver}
            key={`a-${state.values.approver}`}
            aria-invalid={e.approver ? true : undefined}
            aria-describedby={describedBy('approver-hint', e.approver && 'approver-error')}
          >
            {props.choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="delegate">
            Delegate <span className="optional">(optional)</span>
          </label>
          <p className="hint" id="delegate-hint">
            The delegate can decide every item in {props.label}, and the approver can hand items to them.
          </p>
          <FieldError id="delegate-error" message={e.delegate} />
          <select
            id="delegate"
            name="delegate"
            defaultValue={state.values.delegate}
            key={`d-${state.values.delegate}`}
            aria-invalid={e.delegate ? true : undefined}
            aria-describedby={describedBy('delegate-hint', e.delegate && 'delegate-error')}
          >
            <option value="">No delegate</option>
            {props.choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <Submit pending={pending}>{`Save ${props.label}`}</Submit>
          <Link href={`/projects/${props.projectId}/approvers`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}

// **<Approval>: holder** (AC-7).
export function HolderForm(props: { projectId: string; approval: string; label: string; choices: Choice[]; holder: string }) {
  const [state, action, pending] = useActionState<ApproverState, FormData>(setHolderAction, { errors: {}, values: { holder: props.holder } });
  const submit = useSubmit(action, pending);
  const e = state.errors;
  return (
    <>
      <ErrorSummary errors={e} ids={{ holder: 'holder' }} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={props.projectId} />
        <input type="hidden" name="approval" value={props.approval} />
        <div className="field">
          <label htmlFor="holder">Holder</label>
          <p className="hint" id="holder-hint">
            Only people on this project who use the dashboard are listed. Agents are never listed.
          </p>
          <FieldError id="holder-error" message={e.holder} />
          <select
            id="holder"
            name="holder"
            defaultValue={state.values.holder}
            key={`h-${state.values.holder}`}
            aria-invalid={e.holder ? true : undefined}
            aria-describedby={describedBy('holder-hint', e.holder && 'holder-error')}
          >
            {props.choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <Submit pending={pending}>{`Save ${props.label.toLowerCase()}`}</Submit>
          <Link href={`/projects/${props.projectId}/approvers`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
