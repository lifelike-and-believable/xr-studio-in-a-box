'use client';
import { REVIEW_TYPE_ERROR, TEXT_MAX, TITLE_MAX, acceptedReviewType } from '@xr/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorSummary, FieldError, describedBy } from '@/ui/error-summary';

export type StageGroup = { area: string; stages: { id: string; label: string }[] };
type Held = { field: string; text: string; formats: { noun: string }[] };
type HeldFile = { uploadId: string; fileName: string; nouns: string[]; heldUntil: string };

const IDS = { title: 'title', handoff: 'handoff', whatChanged: 'what-changed', file: 'file', answer: 'answer', fileAnswer: 'file-answer' };
const FIELD_NAMES: Record<string, string> = { title: 'The title', whatChanged: 'What changed' };
const nounList = (nouns: string[]) => (nouns.length <= 1 ? `a ${nouns[0] ?? 'number'}` : `a ${nouns.slice(0, -1).join(', a ')} or a ${nouns.at(-1)}`);

function when(iso: string) {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date);
  return `${time} on ${day}`;
}

// The browser checks what it can, uploads the file through the slice 2 signed upload with the
// purpose "review", and sends the item through the API, which goes to the command layer
// (layer1-gates-and-queue#AC-13 to AC-18).
export function SendForm(props: {
  projectId: string;
  stages: StageGroup[];
  waiting: StageGroup[];
  whoDecides: Record<string, string>;
  start: { title: string; handoff: string; waitingOn: string };
}) {
  const router = useRouter();
  const api = `/api/v1/projects/${props.projectId}`;
  const [title, setTitle] = useState(props.start.title);
  const [handoff, setHandoff] = useState(props.start.handoff);
  const [whatChanged, setWhatChanged] = useState('');
  const [waitingOn, setWaitingOn] = useState(props.start.waitingOn);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [held, setHeld] = useState<Held[]>([]);
  const [answering, setAnswering] = useState(false);
  const [answer, setAnswer] = useState('');
  const [heldFile, setHeldFile] = useState<HeldFile | null>(null);
  const [fileAnswering, setFileAnswering] = useState(false);
  const [fileAnswer, setFileAnswer] = useState('');
  const [fileId, setFileId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const failed = Object.keys(errors).length > 0 || held.length > 0;

  useEffect(() => {
    if (failed) document.title = 'Error: Not sent - Send for review - XR Studio';
  }, [failed, errors, held]);

  async function upload(file: File): Promise<string | null> {
    const asked = await fetch(`${api}/uploads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestId: crypto.randomUUID(), title: file.name, fileName: file.name, mediaType: file.type, size: file.size, purpose: 'review' }),
    }).catch(() => null);
    const stopped = `The upload of ${file.name} stopped before it finished. Choose the file again to try again.`;
    if (!asked) return setErrors({ file: stopped }), null;
    const answerBody = (await asked.json().catch(() => ({}))) as { uploadId?: string; uploadUrl?: string; fields?: Record<string, string> };
    if (!asked.ok || !answerBody.uploadId || !answerBody.uploadUrl) return setErrors(answerBody.fields ?? { file: stopped }), null;
    const put = await fetch(answerBody.uploadUrl, { method: 'PUT', body: file }).catch(() => null);
    if (!put?.ok) return setErrors({ file: stopped }), null;
    const registered = await fetch(`${api}/uploads/${answerBody.uploadId}/register`, { method: 'POST' }).catch(() => null);
    const result = (await registered?.json().catch(() => ({}))) as
      | { state?: string; fileId?: string; heldUntil?: string; formats?: { noun: string }[]; fields?: Record<string, string> }
      | undefined;
    if (!registered?.ok || !result) return setErrors(result?.fields ?? { file: stopped }), null;
    if (result.state === 'held') {
      setHeldFile({ uploadId: answerBody.uploadId, fileName: file.name, nouns: (result.formats ?? []).map((f) => f.noun), heldUntil: result.heldUntil ?? '' });
      return null;
    }
    return result.fileId ?? null;
  }

  async function confirmHeld(): Promise<string | null> {
    if (!heldFile) return null;
    const confirmed = await fetch(`${api}/uploads/${heldFile.uploadId}/confirm`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answer: fileAnswer }),
    }).catch(() => null);
    const result = (await confirmed?.json().catch(() => ({}))) as { fileId?: string; fields?: Record<string, string> } | undefined;
    if (!confirmed?.ok || !result?.fileId) {
      setErrors({ fileAnswer: result?.fields?.answer ?? 'The file could not be added. Choose it again.' });
      return null;
    }
    setHeldFile(null);
    return result.fileId;
  }

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const input = event.currentTarget.elements.namedItem('file');
    const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
    const found: Record<string, string> = {};
    if (!title.trim()) found.title = 'Enter a title.';
    else if (title.trim().length > TITLE_MAX) found.title = `Keep the title to ${TITLE_MAX} characters or fewer.`;
    if (!handoff) found.handoff = 'Choose the stage this work is at.';
    if (!whatChanged.trim()) found.whatChanged = 'Say what changed.';
    else if (whatChanged.trim().length > TEXT_MAX) found.whatChanged = 'Keep what changed to 2,000 characters or fewer.';
    if (!file && !fileId && !heldFile) found.file = 'Choose a file to send.';
    else if (file && !acceptedReviewType(file.type, file.name)) found.file = REVIEW_TYPE_ERROR;
    setErrors(found);
    setHeld([]);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      let id = fileId;
      if (heldFile && fileAnswering) id = await confirmHeld();
      else if (file && !heldFile) id = await upload(file);
      if (!id) return;
      setFileId(id);
      const sent = await fetch(`${api}/review-items`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, handoff, whatChanged, fileId: id, waitingOn: waitingOn || null, ...(answering ? { answer } : {}) }),
      }).catch(() => null);
      const result = (await sent?.json().catch(() => ({}))) as { itemId?: string; fields?: Record<string, string>; held?: Held[]; message?: string } | undefined;
      if (!sent?.ok || !result?.itemId) {
        if (result?.held?.length) setHeld(result.held);
        setErrors(result?.fields ?? (result?.held?.length ? {} : { title: result?.message ?? 'The item could not be sent.' }));
        return;
      }
      router.push(`/projects/${props.projectId}/review/sent?${new URLSearchParams({ notice: 'sent', item: result.itemId })}`);
    } finally {
      setBusy(false);
    }
  }

  const heldNouns = [...new Set(held.flatMap((m) => m.formats.map((f) => f.noun)))];
  const summary: Record<string, string> = { ...errors };
  for (const m of held) {
    summary[m.field] = `${FIELD_NAMES[m.field] ?? m.field} has "${m.text}", which looks like ${nounList(m.formats.map((f) => f.noun))}. Agents can read this, so take it out, or confirm it is not one.`;
  }
  const say = props.whoDecides[handoff] ?? '';
  return (
    <>
      <ErrorSummary errors={summary} ids={IDS} />
      {heldFile ? (
        <div className="held">
          <p>
            {heldFile.fileName} is held, not sent: its text looks like it has {nounList(heldFile.nouns)}. It will be deleted at {when(heldFile.heldUntil)} unless you confirm
            it is not {nounList(heldFile.nouns)}. If the document really holds one, send a copy with those numbers removed and keep the original outside XR Studio.
          </p>
          {fileAnswering ? null : (
            <button type="button" className="secondary" onClick={() => setFileAnswering(true)}>
              {heldFile.nouns.length > 1 ? `It is none of these, add ${heldFile.fileName}` : `It is not a ${heldFile.nouns[0]}, add ${heldFile.fileName}`}
            </button>
          )}
        </div>
      ) : null}
      <form method="post" onSubmit={send} noValidate>
        <div className="field">
          <label htmlFor={IDS.title}>Title</label>
          <FieldError id="title-error" message={summary.title} />
          <input
            type="text"
            id={IDS.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={summary.title ? true : undefined}
            aria-describedby={describedBy(summary.title && 'title-error')}
          />
        </div>
        <div className="field">
          <label htmlFor={IDS.handoff}>Stage</label>
          <p className="hint" id="handoff-hint">
            Only stages that need someone&apos;s approval are listed. Work at any other stage moves on without review. Builds reach their gates from the build pipeline.
          </p>
          <FieldError id="handoff-error" message={summary.handoff} />
          <select
            id={IDS.handoff}
            value={handoff}
            onChange={(e) => setHandoff(e.target.value)}
            aria-invalid={summary.handoff ? true : undefined}
            aria-describedby={describedBy('handoff-hint', summary.handoff && 'handoff-error')}
          >
            <option value="">Choose a stage</option>
            {props.stages.map((g) => (
              <optgroup key={g.area} label={g.area}>
                {g.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="panel" aria-live="polite">
          {say ? <p>{say}</p> : null}
        </div>
        <div className="field">
          <label htmlFor={IDS.whatChanged}>What changed</label>
          <p className="hint" id="what-changed-hint">
            What the reviewer should look at. Keep bank details and tax numbers out: agents can read this.
          </p>
          <FieldError id="what-changed-error" message={summary.whatChanged} />
          <textarea
            id={IDS.whatChanged}
            value={whatChanged}
            onChange={(e) => setWhatChanged(e.target.value)}
            aria-invalid={summary.whatChanged ? true : undefined}
            aria-describedby={describedBy('what-changed-hint', summary.whatChanged && 'what-changed-error')}
          />
        </div>
        {held.length ? (
          answering ? (
            <div className="field">
              <label htmlFor={IDS.answer}>What is it?</label>
              <p className="hint" id="answer-hint">
                Say in a few words what the number is. It is recorded in Activity.
              </p>
              <FieldError id="answer-error" message={summary.answer} />
              <input type="text" id={IDS.answer} value={answer} onChange={(e) => setAnswer(e.target.value)} aria-describedby={describedBy('answer-hint', summary.answer && 'answer-error')} />
            </div>
          ) : (
            <button type="button" className="secondary" onClick={() => setAnswering(true)}>
              {heldNouns.length > 1 ? 'It is none of these' : `It is not a ${heldNouns[0]}`}
            </button>
          )
        ) : null}
        <div className="field">
          <label htmlFor={IDS.file}>File</label>
          <p className="hint" id="file-hint">
            A video, image, audio, PDF, Word or 3D model file (.glb, .gltf, .fbx or .usdz). The text of PDFs and Word documents is checked for bank details and tax numbers, as for work samples.
          </p>
          <FieldError id="file-error" message={summary.file} />
          <input
            type="file"
            id={IDS.file}
            name="file"
            onChange={() => {
              setFileId(null);
              setHeldFile(null);
              setFileAnswering(false);
            }}
            aria-invalid={summary.file ? true : undefined}
            aria-describedby={describedBy('file-hint', summary.file && 'file-error')}
          />
        </div>
        {heldFile && fileAnswering ? (
          <div className="field">
            <label htmlFor={IDS.fileAnswer}>What is it?</label>
            <FieldError id="file-answer-error" message={summary.fileAnswer} />
            <input type="text" id={IDS.fileAnswer} value={fileAnswer} onChange={(e) => setFileAnswer(e.target.value)} aria-describedby={describedBy(summary.fileAnswer && 'file-answer-error')} />
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="waiting">
            Is other work waiting on this decision? <span className="optional">(optional)</span>
          </label>
          <p className="hint" id="waiting-hint">
            Choose the stage that cannot start until this is decided. The item is then marked as blocking.
          </p>
          <select id="waiting" value={waitingOn} onChange={(e) => setWaitingOn(e.target.value)} aria-describedby="waiting-hint">
            <option value="">Nothing is waiting</option>
            {props.waiting.map((g) => (
              <optgroup key={g.area} label={g.area}>
                {g.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="actions">
          <button type="submit" disabled={busy} aria-disabled={busy}>
            Send for review
          </button>
          <Link href={`/projects/${props.projectId}/review`}>Cancel</Link>
        </div>
      </form>
    </>
  );
}
