'use client';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { FieldError, describedBy } from '@/ui/error-summary';
import { useSubmit } from '@/ui/submit';
import { restoreAction, type RestoreState } from './actions';

const nounList = (nouns: string[]) => (nouns.length <= 1 ? `a ${nouns[0] ?? 'number'}` : `a ${nouns.slice(0, -1).join(', a ')} or a ${nouns.at(-1)}`);

// **Restore version <n>** and its confirmation (layer1-versions-board-first-view#AC-30, AC-31):
// focus starts on the heading, Go back comes first and is what Escape does, and closing returns
// focus to the button that opened it.
export function RestoreDialog(props: { projectId: string; workId: string; title: string; version: number; next: number; stage: string; deciders: string; seers: string; kept: string }) {
  const [state, action, pending] = useActionState<RestoreState, FormData>(restoreAction, { errors: {} });
  const submit = useSubmit(action, pending);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const conflictRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string | undefined>(undefined);
  const [answering, setAnswering] = useState(false);
  // A refusal because another version was sent meanwhile replaces the dialog with the reason.
  const conflict = state.conflict && state.conflict !== dismissed ? state.conflict : undefined;
  const showing = open && !conflict;
  const id = useId();
  useEffect(() => {
    if (showing) {
      dialog.current?.showModal();
      heading.current?.focus();
    }
  }, [showing]);
  useEffect(() => {
    if (conflict) conflictRef.current?.focus();
  }, [conflict]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
  };
  const held = state.held ?? [];
  const errors: Record<string, string> = { ...state.errors };
  for (const m of held) errors.whatChanged = `What changed has "${m.text}", which looks like ${nounList(m.formats.map((f) => f.noun))}. Take it out, or confirm it is not one.`;
  return (
    <>
      {conflict ? (
        <div ref={conflictRef} role="alert" tabIndex={-1} className="notice">
          {conflict}
        </div>
      ) : null}
      <button
        ref={opener}
        type="button"
        className="link"
        onClick={() => {
          setDismissed(state.conflict);
          setOpen(true);
        }}
      >
        Restore version {props.version}
      </button>
      {showing ? (
        <dialog
          ref={dialog}
          className="dialog"
          aria-labelledby={`${id}-h`}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <h2 id={`${id}-h`} ref={heading} tabIndex={-1}>
            Restore version {props.version} of {props.title}?
          </h2>
          <p>
            Version {props.version}&apos;s file is sent for review again as version {props.next}, at {props.stage}. It waits for {props.deciders}. {props.kept}
          </p>
          {state.heldFile ? (
            <div className="held">
              <p>
                {state.heldFile.fileName} is held, not sent: its text looks like it has {nounList(state.heldFile.nouns)}.
              </p>
              {answering ? null : (
                <button type="button" className="secondary" onClick={() => setAnswering(true)}>
                  {state.heldFile.nouns.length > 1 ? `It is none of these, add ${state.heldFile.fileName}` : `It is not a ${state.heldFile.nouns[0]}, add ${state.heldFile.fileName}`}
                </button>
              )}
            </div>
          ) : null}
          <form method="post" onSubmit={submit} noValidate>
            <input type="hidden" name="projectId" value={props.projectId} />
            <input type="hidden" name="workId" value={props.workId} />
            <input type="hidden" name="version" value={props.version} />
            <div className="field">
              <label htmlFor={`${id}-w`}>What changed</label>
              <p className="hint" id={`${id}-hint`}>
                {props.seers} see this. Say why you are going back.
              </p>
              <FieldError id={`${id}-error`} message={errors.whatChanged} />
              <textarea
                id={`${id}-w`}
                name="whatChanged"
                defaultValue={`Restored version ${props.version}.`}
                aria-invalid={errors.whatChanged ? true : undefined}
                aria-describedby={describedBy(`${id}-hint`, errors.whatChanged && `${id}-error`)}
              />
            </div>
            {held.length ? (
              <div className="field">
                <label htmlFor={`${id}-a`}>What is it?</label>
                <FieldError id={`${id}-a-error`} message={errors.answer} />
                <input type="text" id={`${id}-a`} name="answer" aria-describedby={describedBy(errors.answer && `${id}-a-error`)} />
              </div>
            ) : null}
            {state.heldFile && answering ? (
              <div className="field">
                <label htmlFor={`${id}-f`}>What is it?</label>
                <FieldError id={`${id}-f-error`} message={errors.fileAnswer} />
                <input type="text" id={`${id}-f`} name="fileAnswer" aria-describedby={describedBy(errors.fileAnswer && `${id}-f-error`)} />
              </div>
            ) : null}
            <div className="actions">
              <button type="button" className="secondary" onClick={close}>
                Go back
              </button>
              <button type="submit" disabled={pending} aria-disabled={pending}>
                Restore version {props.version}
              </button>
            </div>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
