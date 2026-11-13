'use client';
import Link from 'next/link';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { ReviewPreview } from '@/ui/review-preview';
import { batchAction, type BatchState } from './actions';

export type QueueItem = {
  id: string;
  title: string;
  version: number;
  stage: string;
  area: string;
  requester: string;
  sent: string;
  whatChanged: string;
  blocking: boolean;
  waitingStage: string | null;
  handedTo: string | null;
  recommendation: { result: string; reason: string } | null;
  file: { name: string; mediaType: string } | null;
  href: string;
  fileSrc: string;
};
export type QueueGroup = { handoff: string; stage: string; area: string; blocking: number; items: QueueItem[] };

type Pending = { decision: 'accept' | 'revise' | 'reject'; ids: string[]; group: string | null };

const RESULT = { accept: 'Accept', revise: 'Request revision', reject: 'Reject' } as const;
const count = (n: number) => `${n} item${n === 1 ? '' : 's'}`;

// The queue's groups, checkboxes and batch decisions (layer1-gates-and-queue#AC-21, AC-22, AC-29).
export function QueueForm({ projectId, groups }: { projectId: string; groups: QueueGroup[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [none, setNone] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const noneRef = useRef<HTMLParagraphElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (none) noneRef.current?.focus();
  }, [none]);

  const open = (decision: Pending['decision'], ids: string[], group: string | null, button: HTMLButtonElement) => {
    if (ids.length === 0) {
      setNone(true);
      return;
    }
    setNone(false);
    opener.current = button;
    setPending({ decision, ids, group });
  };
  const close = () => {
    setPending(null);
    opener.current?.focus();
  };
  const all = groups.flatMap((g) => g.items);

  return (
    <>
      <div className="batch" role="group" aria-labelledby="batch-label">
        <p id="batch-label">
          <strong>With the items you select</strong>
        </p>
        {none ? (
          <p ref={noneRef} tabIndex={-1} className="field-error">
            Select at least one item.
          </p>
        ) : null}
        <div className="actions">
          <button type="button" onClick={(e) => open('accept', selected, null, e.currentTarget)}>
            Accept selected
          </button>
          <button type="button" className="secondary" onClick={(e) => open('revise', selected, null, e.currentTarget)}>
            Request revision for selected
          </button>
          <button type="button" className="secondary" onClick={(e) => open('reject', selected, null, e.currentTarget)}>
            Reject selected
          </button>
        </div>
      </div>
      {groups.map((g) => {
        const headId = `g-${g.handoff}`;
        return (
          <section key={g.handoff} aria-labelledby={headId}>
            <div className="group-head">
              <h2 id={headId}>{g.stage}</h2>
              <p className="hint">
                {g.area}. {count(g.items.length)}
                {g.blocking ? `, ${g.blocking} blocking` : ''}.
              </p>
            </div>
            {g.items.length > 1 ? (
              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={(e) =>
                    open(
                      'accept',
                      g.items.map((i) => i.id),
                      g.stage,
                      e.currentTarget,
                    )
                  }
                >
                  Accept all {g.items.length} in {g.stage}
                </button>
              </div>
            ) : null}
            <ul className="items">
              {g.items.map((i) => (
                <li key={i.id} className="item">
                  <input
                    type="checkbox"
                    aria-label={`Select ${i.title}`}
                    checked={selected.includes(i.id)}
                    onChange={(e) => setSelected((s) => (e.target.checked ? [...s, i.id] : s.filter((x) => x !== i.id)))}
                  />
                  {i.file ? <ReviewPreview src={i.fileSrc} file={i.file} /> : <span />}
                  <div>
                    <h3>
                      <Link href={i.href}>{i.title}</Link>
                      {i.version > 1 ? <span className="version"> Version {i.version}</span> : null}
                    </h3>
                    <dl className="meta">
                      <dt>Stage</dt>
                      <dd>
                        {i.stage} ({i.area})
                      </dd>
                      <dt>Requested by</dt>
                      <dd>
                        {i.requester}, {i.sent}
                      </dd>
                      <dt>What changed</dt>
                      <dd>{i.whatChanged}</dd>
                    </dl>
                    {i.blocking ? (
                      <p>
                        <span className="tag">Blocking</span> {i.waitingStage} waits on this decision.
                      </p>
                    ) : null}
                    {i.handedTo ? (
                      <p>
                        <span className="tag">Handed to {i.handedTo}</span>
                      </p>
                    ) : null}
                    {i.recommendation ? (
                      <p className="ai">
                        <strong>AI recommendation, not a decision:</strong> {RESULT[i.recommendation.result as keyof typeof RESULT] ?? i.recommendation.result}.{' '}
                        {i.recommendation.reason}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {pending ? <BatchDialog projectId={projectId} pending={pending} items={all.filter((i) => pending.ids.includes(i.id))} onClose={close} /> : null}
    </>
  );
}

function BatchDialog({ projectId, pending, items, onClose }: { projectId: string; pending: Pending; items: QueueItem[]; onClose: () => void }) {
  const [state, action, busy] = useActionState<BatchState, FormData>(batchAction, { errors: {} });
  const [feedback, setFeedback] = useState('');
  const [missing, setMissing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const id = useId();
  useEffect(() => {
    dialog.current?.showModal();
    title.current?.focus();
  }, []);
  // The modal is closed first, so focus can return to the button that opened it.
  const close = () => {
    dialog.current?.close();
    onClose();
  };
  const n = count(items.length);
  const heading = {
    accept: `Accept ${n}${pending.group ? ` in ${pending.group}` : ''}?`,
    revise: `Request a revision of ${n}?`,
    reject: `Reject ${n}?`,
  }[pending.decision];
  const confirm = { accept: `Accept ${n}`, revise: `Request revision of ${n}`, reject: `Reject ${n}` }[pending.decision];
  const error = (missing ? 'Write the feedback each requester will see.' : '') || state.errors.feedback || state.message;
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
      <h2 id={`${id}-h`} ref={title} tabIndex={-1}>
        {heading}
      </h2>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.title}, from {i.requester}
          </li>
        ))}
      </ul>
      <p>
        {pending.decision === 'reject'
          ? 'A rejected item does not move on. Each requester sees your decision, and can send the work again.'
          : 'Each decision is recorded with your name and the time, and cannot be changed afterwards.'}
      </p>
      <form
        action={action}
        onSubmit={(event) => {
          if (pending.decision === 'revise' && !feedback.trim()) {
            event.preventDefault();
            setMissing(true);
          }
        }}
      >
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="decision" value={pending.decision} />
        {pending.group ? <input type="hidden" name="group" value={pending.group} /> : null}
        {items.map((i) => (
          <input key={i.id} type="hidden" name="items" value={i.id} />
        ))}
        {pending.decision !== 'accept' ? (
          <div className="field">
            <label htmlFor={`${id}-f`}>
              Feedback {pending.decision === 'reject' ? <span className="optional">(optional)</span> : null}
            </label>
            <p className="hint" id={`${id}-fh`}>
              Each requester sees this with their item. {pending.decision === 'reject' ? 'Say why.' : 'Say what to change.'}
            </p>
            {error ? (
              <p className="field-error" id={`${id}-fe`} role="alert">
                {error}
              </p>
            ) : null}
            <textarea
              id={`${id}-f`}
              name="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={[`${id}-fh`, error ? `${id}-fe` : ''].filter(Boolean).join(' ')}
            />
          </div>
        ) : error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button type="button" className="secondary" onClick={close}>
            Go back
          </button>
          <button type="submit" disabled={busy} className={pending.decision === 'reject' ? 'danger' : undefined}>
            {confirm}
          </button>
        </div>
      </form>
    </dialog>
  );
}
