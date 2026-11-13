'use client';
import Link from 'next/link';
import { startTransition, useActionState, useEffect, useId, useRef, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';
import { useSubmit } from '@/ui/submit';
import { decideAction, type DecisionState } from '../actions';

const WORD: Record<string, string> = { accept: 'accepted', revise: 'asked for a revision of', reject: 'rejected', withdraw: 'withdrew' };

function when(iso: string) {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date);
  return `${time} on ${day}`;
}

// **Your decision** (layer1-gates-and-queue#AC-26 to AC-28).
export function DecisionForm({ projectId, itemId, title, requester }: { projectId: string; itemId: string; title: string; requester: string }) {
  const [state, action, pending] = useActionState<DecisionState, FormData>(decideAction, { errors: {}, feedback: '' });
  const submit = useSubmit(action, pending);
  const [feedback, setFeedback] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [answering, setAnswering] = useState(false);
  const rejectButton = useRef<HTMLButtonElement>(null);
  const conflictRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.conflict) conflictRef.current?.focus();
  }, [state.conflict]);

  if (state.conflict) {
    const c = state.conflict;
    const text =
      c.decision === 'withdraw'
        ? `Your decision was not recorded: ${c.by} withdrew this item at ${when(c.at)}.`
        : `Your decision was not recorded: ${c.by} ${WORD[c.decision] ?? c.decision} this item at ${when(c.at)}, while you had it open. It has left your queue.`;
    return (
      <>
        <div ref={conflictRef} role="alert" tabIndex={-1} className="notice">
          {text}
        </div>
        <div className="actions">
          <Link href={`/projects/${projectId}/review`} className="button">
            Back to Review
          </Link>
        </div>
      </>
    );
  }

  const held = state.held ?? [];
  const nouns = [...new Set(held.flatMap((m) => m.formats.map((f) => f.noun)))];
  const errors = { ...state.errors, ...(held.length ? { feedback: `Your feedback has text that looks like ${nouns.length > 1 ? 'one of these' : `a ${nouns[0]}`}: ${held.map((m) => `"${m.text}"`).join(', ')}.` } : {}) };
  return (
    <section aria-labelledby="decision-title">
      <h3 id="decision-title">Your decision</h3>
      <ErrorSummary errors={errors} ids={{ feedback: 'feedback', answer: 'answer' }} />
      <form method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="itemId" value={itemId} />
        <div className="field">
          <label htmlFor="feedback">
            Feedback for {requester} <span className="optional">(needed to request a revision)</span>
          </label>
          <p className="hint" id="feedback-hint">
            {requester.split(' ')[0]} sees this. Say what to change, or why you reject it.
          </p>
          <FieldError id="feedback-error" message={errors.feedback} />
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            aria-invalid={errors.feedback ? true : undefined}
            aria-describedby={describedBy('feedback-hint', errors.feedback && 'feedback-error')}
          />
        </div>
        {held.length ? (
          answering ? (
            <div className="field">
              <label htmlFor="answer">What is it?</label>
              <FieldError id="answer-error" message={state.errors.answer} />
              <input type="text" id="answer" name="answer" aria-describedby={describedBy(state.errors.answer && 'answer-error')} />
            </div>
          ) : (
            <button type="button" className="secondary" onClick={() => setAnswering(true)}>
              {nouns.length > 1 ? 'It is none of these' : `It is not a ${nouns[0]}`}
            </button>
          )
        ) : null}
        <div className="actions">
          <button type="submit" name="decision" value="accept" disabled={pending}>
            Accept
          </button>
          <button type="submit" name="decision" value="revise" className="secondary" disabled={pending}>
            Request revision
          </button>
          <button ref={rejectButton} type="button" className="secondary" onClick={() => setConfirming(true)}>
            Reject
          </button>
        </div>
      </form>
      {confirming ? (
        <RejectDialog
          title={title}
          requester={requester}
          feedback={feedback}
          onClose={() => {
            setConfirming(false);
            rejectButton.current?.focus();
          }}
          onConfirm={(text) => {
            const form = new FormData();
            form.set('projectId', projectId);
            form.set('itemId', itemId);
            form.set('feedback', text);
            form.set('decision', 'reject');
            setConfirming(false);
            startTransition(() => action(form));
          }}
        />
      ) : null}
    </section>
  );
}

function RejectDialog({ title, requester, feedback, onClose, onConfirm }: { title: string; requester: string; feedback: string; onClose: () => void; onConfirm: (feedback: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [text, setText] = useState(feedback);
  const id = useId();
  useEffect(() => {
    dialog.current?.showModal();
    heading.current?.focus();
  }, []);
  // The modal is closed first, so focus can return to the button that opened it.
  const close = () => {
    dialog.current?.close();
    onClose();
  };
  return (
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
        Reject {title}?
      </h2>
      <p>A rejected item does not move on. {requester} sees your decision, and can send the work again.</p>
      <div className="field">
        <label htmlFor={`${id}-f`}>
          Feedback <span className="optional">(optional)</span>
        </label>
        <textarea id={`${id}-f`} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="actions">
        <button type="button" className="secondary" onClick={close}>
          Go back
        </button>
        <button type="button" className="danger" onClick={() => onConfirm(text)}>
          Reject 1 item
        </button>
      </div>
    </dialog>
  );
}
