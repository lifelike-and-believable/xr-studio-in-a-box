'use client';
import { startTransition, useEffect, useRef } from 'react';

// Cannot be pressed twice while the request is in progress (design-organisations-and-projects).
export function Submit({ children, className, pending }: { children: string; className?: string; pending: boolean }) {
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {children}
    </button>
  );
}

// Sends a form to its action without React's automatic reset, so everything typed or ticked is
// kept when the action answers with errors (AC-26, AC-34), and ignores a second submit while the
// first is in progress (AC-26).
export function useSubmit(dispatch: (form: FormData) => void, pending: boolean) {
  const sending = useRef(false);
  useEffect(() => {
    if (!pending) sending.current = false;
  }, [pending]);
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    // The submitter is included, so a form with two submit buttons (Save, or "It is not a <format>")
    // sends which was pressed.
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const form = new FormData(event.currentTarget, submitter instanceof HTMLButtonElement ? submitter : null);
    startTransition(() => dispatch(form));
  };
}
