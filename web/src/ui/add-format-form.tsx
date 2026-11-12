'use client';
import { patternMatches } from '@xr/contracts';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { addFormatAction, type FormatState } from '../../app/(app)/facts-actions';
import { ErrorSummary, FieldError, describedBy } from './error-summary';
import { useSubmit } from './submit';

const IDS = { name: 'format-name', pattern: 'format-pattern' };

// Add a format, with "Try it with an example" (layer1-facts-identifiers-activity#AC-28). The example
// is tried with the same matcher the server uses, after a pause in typing or on leaving the field.
export function AddFormatForm({ organisationId }: { organisationId: string }) {
  const [state, action, pending] = useActionState<FormatState, FormData>(addFormatAction, { errors: {}, values: { name: '', pattern: '', example: '' } });
  const submit = useSubmit(action, pending);
  const [result, setResult] = useState('');
  const pattern = useRef<HTMLInputElement>(null);
  const example = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const e = state.errors;

  const tryIt = () => {
    if (timer.current) clearTimeout(timer.current);
    const value = example.current?.value.trim() ?? '';
    if (!value) return setResult('');
    const matches = patternMatches(pattern.current?.value ?? '', value);
    setResult(`"${value}" ${matches ? 'matches' : 'does not match'} this pattern.`);
  };
  const later = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(tryIt, 600);
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <>
      <ErrorSummary errors={e} ids={IDS} />
      <form method="post" onSubmit={submit} noValidate key={JSON.stringify(state.values)}>
        <input type="hidden" name="organisationId" value={organisationId} />
        <div className="field">
          <label htmlFor={IDS.name}>Name</label>
          <p className="hint" id="format-name-hint">
            What people will see when text matches, for example &quot;Funder account number&quot;.
          </p>
          <FieldError id="format-name-error" message={e.name} />
          <input
            type="text"
            id={IDS.name}
            name="name"
            defaultValue={state.values.name}
            aria-invalid={e.name ? true : undefined}
            aria-describedby={describedBy('format-name-hint', e.name && 'format-name-error')}
          />
        </div>
        <div className="field">
          <label htmlFor={IDS.pattern}>Pattern</label>
          <p className="hint" id="format-pattern-hint">
            Write # for any digit and A for any letter. Other characters must match as typed, but spaces, hyphens and dots are ignored when checking. At least
            6 # or A.
          </p>
          <FieldError id="format-pattern-error" message={e.pattern} />
          <input
            ref={pattern}
            type="text"
            id={IDS.pattern}
            name="pattern"
            defaultValue={state.values.pattern}
            onChange={later}
            aria-invalid={e.pattern ? true : undefined}
            aria-describedby={describedBy('format-pattern-hint', e.pattern && 'format-pattern-error')}
          />
        </div>
        <div className="field">
          <label htmlFor="format-example">
            Try it with an example <span className="optional">(optional)</span>
          </label>
          <p className="hint" id="format-example-hint">
            Not saved. The result shows below when you stop typing or leave the field.
          </p>
          <input
            ref={example}
            type="text"
            id="format-example"
            name="example"
            defaultValue={state.values.example}
            onChange={later}
            onBlur={tryIt}
            aria-describedby="format-example-hint"
          />
        </div>
        <p className="notice-line" id="example-result" role="status">
          {result}
        </p>
        <div className="actions">
          <button type="submit" disabled={pending} aria-disabled={pending}>
            Add format
          </button>
          <Link href={`/organisations/${organisationId}/identifier-formats`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
