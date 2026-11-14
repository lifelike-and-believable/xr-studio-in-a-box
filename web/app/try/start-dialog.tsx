'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { DIALOGS } from '@/try/starting-points';
import { startTutorial } from './actions.try';

function StartButton() {
  const { pending } = useFormStatus();
  // Reads "Starting" and stays unavailable until the page reloads (design, States and errors).
  return (
    <button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Starting' : 'Start'}
    </button>
  );
}

// The Start dialog (trying-the-product#AC-9): native, focus on the safe choice, Escape keeps what
// is here, and closing returns focus to the Start that opened it.
export function StartDialog({ id, title, startsWith }: { id: string; title: string; startsWith: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const keep = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const labels = useId();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      keep.current?.focus();
    }
  }, [open]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
  };
  return (
    <>
      <button ref={opener} type="button" aria-label={`Start: ${title}`} onClick={() => setOpen(true)}>
        Start
      </button>
      {open ? createPortal(
        <dialog
          ref={dialog}
          className="dialog"
          aria-labelledby={`${labels}-h`}
          aria-describedby={`${labels}-d`}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <h2 id={`${labels}-h`}>Start {title}?</h2>
          <p id={`${labels}-d`}>
            Everything done in this trial copy so far is replaced by the tutorial&apos;s starting point: {startsWith}. Anyone else using this
            copy loses what they did.
          </p>
          <form action={startTutorial} className="actions">
            <input type="hidden" name="tutorial" value={id} />
            <button ref={keep} type="button" className="secondary" onClick={close}>
              Keep what is here
            </button>
            <StartButton />
          </form>
        </dialog>,
        document.getElementById(DIALOGS) ?? document.body,
      ) : null}
    </>
  );
}
