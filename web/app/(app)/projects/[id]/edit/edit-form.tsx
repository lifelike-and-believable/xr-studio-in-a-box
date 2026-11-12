'use client';
import { useActionState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { Submit, useSubmit } from '@/ui/submit';
import { editProjectAction, type FormState } from '../../actions';

export function EditForm({ id, name, brief }: { id: string; name: string; brief: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(editProjectAction, { errors: {}, values: { name, brief } });
  const submit = useSubmit(action, pending);
  const e = state.errors;
  return (
    <>
      <ErrorSummary errors={e} ids={{ name: 'name' }} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={id} />
        <label htmlFor="name">Project name</label>
        <FieldError id="name-error" message={e.name} />
        <input id="name" name="name" type="text" defaultValue={state.values.name} aria-invalid={e.name ? true : undefined} aria-describedby={describedBy(e.name && 'name-error')} />
        <label htmlFor="brief">Brief (optional)</label>
        <textarea id="brief" name="brief" rows={4} defaultValue={state.values.brief} />
        <div className="actions">
          <Submit pending={pending}>Save changes</Submit>
        </div>
      </form>
    </>
  );
}
