'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

// A confirmation dialog (design-project-facts and design-identifier-filter, Accessibility): focus
// starts on its heading, the safe choice comes first, Escape is the safe choice, and closing
// returns focus to the control that opened it. The action is a form posted to a server action.
export function ConfirmDialog({
  trigger,
  triggerClass = 'link',
  heading,
  description,
  safe,
  confirm,
  action,
  fields,
  danger = false,
}: {
  trigger: ReactNode;
  triggerClass?: string;
  heading: string;
  description: string;
  safe: string;
  confirm: string;
  action: (form: FormData) => Promise<void>;
  fields: Record<string, string>;
  danger?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      title.current?.focus();
    }
  }, [open]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
  };
  return (
    <>
      <button ref={opener} type="button" className={triggerClass} onClick={() => setOpen(true)}>
        {trigger}
      </button>
      {open ? (
        <dialog
          ref={dialog}
          className="dialog"
          aria-labelledby={`${id}-h`}
          aria-describedby={`${id}-d`}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <h2 id={`${id}-h`} ref={title} tabIndex={-1}>
            {heading}
          </h2>
          <p id={`${id}-d`}>{description}</p>
          <form action={action} className="actions">
            {Object.entries(fields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <button type="button" className="secondary" onClick={close}>
              {safe}
            </button>
            <button type="submit" className={danger ? 'danger' : undefined}>
              {confirm}
            </button>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
