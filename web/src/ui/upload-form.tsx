'use client';
import { MAX_SAMPLE_BYTES, SAMPLE_SIZE_ERROR, SAMPLE_TYPE_ERROR, acceptedSampleType } from '@xr/contracts';
import { useRouter } from 'next/navigation';
import { useRef, useState, type ReactNode } from 'react';
import { ErrorSummary, FieldError, describedBy } from './error-summary';

export const FILE_HINT =
  'Video, images, audio, a PDF or a Word document (.docx), up to 2 GB. Text in PDFs and Word documents is checked for bank details and tax numbers; scanned PDFs, video, images and audio are not checked.';

const IDS = { title: 'sample-title', file: 'sample-file' };

function remaining(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'less than a minute';
  if (seconds < 60) return 'less than a minute';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}

type Upload = { name: string; size: number; percent: number; status: string };

// Adds a work sample (layer1-facts-identifiers-activity#AC-10, AC-11): the browser checks the
// title, file, type and size, asks for a signed upload address, sends the bytes there with
// progress, and registers the upload through the API, which goes to the command layer.
export function UploadForm({
  api,
  samplesHref,
  title: initialTitle = '',
  fileLabel = 'File',
  submitLabel = 'Add work sample',
  children,
}: {
  api: string;
  samplesHref: string;
  title?: string;
  fileLabel?: string;
  submitLabel?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [title, setTitle] = useState(initialTitle);
  const [progress, setProgress] = useState<Upload | null>(null);
  const xhr = useRef<XMLHttpRequest | null>(null);
  const stopped = useRef(false);

  async function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (progress) return;
    const input = event.currentTarget.elements.namedItem('file');
    const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
    const found: Record<string, string> = {};
    if (!title.trim()) found.title = 'Enter a title for the work sample.';
    if (!file) found.file = 'Choose a file to add.';
    else if (!acceptedSampleType(file.type, file.name)) found.file = SAMPLE_TYPE_ERROR;
    else if (file.size > MAX_SAMPLE_BYTES) found.file = SAMPLE_SIZE_ERROR;
    setErrors(found);
    if (!file || Object.keys(found).length > 0) return;

    const asked = await fetch(`${api}/uploads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestId: crypto.randomUUID(), title, fileName: file.name, mediaType: file.type, size: file.size }),
    }).catch(() => null);
    if (!asked) return setErrors({ file: `The upload of ${file.name} stopped before it finished. Choose the file again to try again.` });
    const answer = (await asked.json().catch(() => ({}))) as { uploadId?: string; uploadUrl?: string; fields?: Record<string, string>; message?: string };
    if (!asked.ok || !answer.uploadId || !answer.uploadUrl) return setErrors(answer.fields ?? { file: answer.message ?? 'The file could not be added.' });

    stopped.current = false;
    const began = Date.now();
    let lastSaid = 0;
    setProgress({ name: file.name, size: file.size, percent: 0, status: '' });
    const sent = await new Promise<boolean>((resolve) => {
      const request = new XMLHttpRequest();
      xhr.current = request;
      request.open('PUT', answer.uploadUrl ?? '');
      request.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const percent = Math.floor((e.loaded / e.total) * 100);
        const now = Date.now();
        // The status line is updated every few seconds, not on every change.
        const say = now - lastSaid > 3000;
        if (say) lastSaid = now;
        const rate = e.loaded / Math.max(1, (now - began) / 1000);
        setProgress((p) =>
          p
            ? {
                ...p,
                percent,
                status: say ? `${percent}% uploaded, about ${remaining((e.total - e.loaded) / rate)} left. Keep this page open.` : p.status,
              }
            : p,
        );
      };
      request.onload = () => resolve(request.status >= 200 && request.status < 300);
      request.onerror = () => resolve(false);
      request.onabort = () => resolve(false);
      request.send(file);
    });
    xhr.current = null;
    setProgress(null);
    if (stopped.current) return;
    if (!sent) return setErrors({ file: `The upload of ${file.name} stopped before it finished. Choose the file again to try again.` });

    const registered = await fetch(`${api}/uploads/${answer.uploadId}/register`, { method: 'POST' }).catch(() => null);
    const result = (await registered?.json().catch(() => ({}))) as { state?: string; fields?: Record<string, string> } | undefined;
    if (!registered?.ok || !result) return setErrors(result?.fields ?? { file: `The upload of ${file.name} stopped before it finished. Choose the file again to try again.` });
    if (result.state === 'held') {
      router.push(`${samplesHref}?held=${answer.uploadId}`);
      return;
    }
    router.push(`${samplesHref}?${new URLSearchParams({ notice: 'added', title: title.trim() })}`);
  }

  const busy = progress !== null;
  return (
    <>
      <ErrorSummary errors={errors} ids={IDS} />
      {children}
      <form method="post" encType="multipart/form-data" onSubmit={start} noValidate>
        <div className="field">
          <label htmlFor={IDS.title}>Title</label>
          <FieldError id={`${IDS.title}-error`} message={errors.title} />
          <input
            type="text"
            id={IDS.title}
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={describedBy(errors.title && `${IDS.title}-error`)}
          />
        </div>
        <div className="field">
          <label htmlFor={IDS.file}>{fileLabel}</label>
          <p className="hint" id={`${IDS.file}-hint`}>
            {FILE_HINT}
          </p>
          <FieldError id={`${IDS.file}-error`} message={errors.file} />
          <input
            type="file"
            id={IDS.file}
            name="file"
            disabled={busy}
            aria-invalid={errors.file ? true : undefined}
            aria-describedby={describedBy(`${IDS.file}-hint`, errors.file && `${IDS.file}-error`)}
          />
        </div>
        {progress ? (
          <>
            <p className="label-like" id="upload-label">
              Uploading {progress.name}
            </p>
            <progress value={progress.percent} max={100} aria-labelledby="upload-label">
              {progress.percent}%
            </progress>
          </>
        ) : null}
        {/* A polite live region, not role="status", so the page's own notice stays its only status. */}
        <p className="hint" aria-live="polite">
          {progress?.status ?? ''}
        </p>
        <div className="actions">
          <button type="submit" disabled={busy} aria-disabled={busy}>
            {busy ? 'Uploading' : submitLabel}
          </button>
          {busy ? (
            <button
              type="button"
              className="link"
              onClick={() => {
                stopped.current = true;
                xhr.current?.abort();
              }}
            >
              Stop uploading
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
}
