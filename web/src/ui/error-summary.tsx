'use client';
import { useEffect, useRef } from 'react';

export type FieldErrors = Record<string, string>;

// The error summary takes focus, links to each field, and the page title starts "Error:"
// (design-organisations-and-projects, Accessibility).
export function ErrorSummary({ errors, ids }: { errors: FieldErrors; ids: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors);
  const key = JSON.stringify(errors);
  useEffect(() => {
    if (entries.length === 0) return;
    ref.current?.focus();
    const base = document.title.replace(/^Error: /, '');
    document.title = `Error: ${base}`;
    // `key` stands for the errors; the effect runs once per new set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  if (entries.length === 0) return null;
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="summary" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title">There is a problem</h2>
      <ul>
        {entries.map(([field, message]) => (
          <li key={field}>
            <a href={`#${ids[field] ?? field}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <span className="visually-hidden">Error: </span>
      {message}
    </p>
  );
}

export function describedBy(...ids: (string | false | undefined)[]): string | undefined {
  const list = ids.filter((id): id is string => Boolean(id));
  return list.length ? list.join(' ') : undefined;
}
