import 'server-only';
import { formatList } from '@xr/contracts';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Owner } from '@/record/commands';
import { factValue, heldUploads, samplesIn, type HeldUpload } from '@/record/facts';
import { deleteUploadAction, removeSampleAction } from '../../app/(app)/facts-actions';
import { ConfirmDialog } from './dialog';
import { HeldConfirmForm } from './held-confirm-form';
import { HeldFileSummary } from './held-summary';
import { Notice } from './notice';
import { samplesPath } from './paths';
import { dayOf, timeOf } from './time';
import { UploadForm } from './upload-form';

// A work samples page, a project's or an organisation's standard ones (layer1-facts-identifiers-activity
// #AC-9 to AC-12, AC-17, AC-25, AC-26). A held upload's states are `?held=<id>` and `&confirm=1`.

export type SamplesSearch = { notice?: string; title?: string; file?: string; nouns?: string; held?: string; confirm?: string };

const sizeText = (bytes: number) =>
  bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : bytes >= 1024 ** 2 ? `${(bytes / 1024 ** 2).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function samplesNotice(owner: Owner, s: SamplesSearch): string | undefined {
  const where = owner.kind === 'project' ? 'the work samples' : 'the standard work samples';
  const label = owner.kind === 'project' ? 'Work samples' : 'Standard work samples';
  switch (s.notice) {
    case 'added':
      return `${s.title} added to ${where}.`;
    case 'removed':
      return `${s.title} removed from ${where}. It stays in the earlier versions of ${label}.`;
    case 'deleted':
      return `${s.file} deleted.`;
    case 'confirmed':
      return `${s.title} added to ${where}. Your confirmation that ${s.file} does not have ${formatList((s.nouns ?? '').split('|').filter(Boolean))} is recorded in Activity.`;
    default:
      return undefined;
  }
}

const matchLine = (h: HeldUpload, m: HeldUpload['matches'][number], nouns: (id: string) => string) => {
  const names = m.formatIds.map(nouns);
  const formats = names.length === 1 ? `the format for ${formatList(names)}` : `the formats for ${names.map((n) => formatList([n])).join(' and for ')}`;
  return m.page ? `Page ${m.page} of ${h.fileName} has text matching ${formats}` : `${h.fileName} has text matching ${formats}`;
};

export async function SamplesView({
  owner,
  name,
  api,
  canEdit,
  zone,
  search,
  intro,
}: {
  owner: Owner;
  name: string;
  api: string;
  canEdit: boolean;
  zone: string;
  search: SamplesSearch;
  intro: ReactNode;
}) {
  const current = await factValue(owner, owner.kind === 'project' ? 'work-samples' : 'standard-work-samples');
  const samples = await samplesIn(current?.value);
  const held = await heldUploads(owner);
  const here = samplesPath(owner);
  const message = samplesNotice(owner, search);
  const focus = search.held ? held.find((h) => h.id === search.held) : undefined;
  const fields = { ownerKind: owner.kind, ownerId: owner.id };
  const caption = owner.kind === 'project' ? `Work samples for ${name}` : `Standard work samples for ${name}`;

  if (focus && search.confirm === '1') {
    return (
      <>
        <h2>
          Confirm {focus.fileName} does not have {formatList(focus.nouns)}
        </h2>
        <p>
          Its text matches the format for {formatList(focus.nouns)}. Confirm only if it is something else. Your confirmation is recorded in{' '}
          {owner.kind === 'project' ? "the project's" : "the organisation's"} activity with your name, the time and your answer below.
        </p>
        <HeldConfirmForm ownerKind={owner.kind} ownerId={owner.id} uploadId={focus.id} fileName={focus.fileName} backHref={here} />
      </>
    );
  }

  const nounOf = (h: HeldUpload) => (id: string) => h.nouns[[...new Set(h.matches.flatMap((m) => m.formatIds))].indexOf(id)] ?? 'identifier';
  return (
    <>
      {message ? <Notice title={message.split('. ')[0]?.replace(/\.$/, '')}>{message}</Notice> : null}
      {intro}
      {held
        .filter((h) => h !== focus)
        .map((h) => (
          <div className="held" key={h.id}>
            <p>
              Held: {h.fileName}. Not added: its text looks like it has {formatList(h.nouns)}. It will be deleted at {timeOf(h.heldUntil, zone)} on{' '}
              {dayOf(h.heldUntil, zone)} unless you confirm it is not {formatList(h.nouns)}.
            </p>
            <div className="actions">
              <form method="get" action={here} className="inline">
                <input type="hidden" name="held" value={h.id} />
                <input type="hidden" name="confirm" value="1" />
                <button type="submit" className="secondary">
                  Confirm {h.fileName} is not {formatList(h.nouns)}
                </button>
              </form>
              <form action={deleteUploadAction} className="inline">
                <input type="hidden" name="ownerKind" value={owner.kind} />
                <input type="hidden" name="ownerId" value={owner.id} />
                <input type="hidden" name="uploadId" value={h.id} />
                <button type="submit" className="link">
                  Delete {h.fileName} now
                </button>
              </form>
            </div>
          </div>
        ))}
      {samples.length > 0 ? (
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">File</th>
              <th scope="col">Added</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.fileId}>
                <td data-label="Title">{s.title}</td>
                <td data-label="File">
                  {s.fileName}, {sizeText(s.size)}
                </td>
                <td data-label="Added">
                  {s.by}, {dayOf(s.at, zone)}
                </td>
                <td>
                  {canEdit ? (
                    <ConfirmDialog
                      trigger={
                        <>
                          Remove<span className="visually-hidden"> {s.title}</span>
                        </>
                      }
                      heading={`Remove ${s.title}?`}
                      description={`It leaves the current ${owner.kind === 'project' ? 'work samples' : 'standard work samples'} and stays in the earlier versions, so restoring an earlier version brings it back.`}
                      safe={`Keep ${s.title}`}
                      confirm={`Remove ${s.title}`}
                      action={removeSampleAction}
                      fields={{ ...fields, fileId: s.fileId }}
                      danger
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No samples yet.</p>
      )}
      {current ? (
        <p>
          <Link href={`${here}/history`}>
            Earlier versions<span className="visually-hidden"> of {owner.kind === 'project' ? 'work samples' : 'standard work samples'}</span>
          </Link>
        </p>
      ) : null}
      {focus ? (
        <UploadForm api={api} samplesHref={here} title={focus.title} fileLabel="Or choose a different file" submitLabel="Upload a different file" key={focus.id}>
          <HeldFileSummary heading={`Not added: ${focus.fileName} looks like it has ${formatList(focus.nouns)}`}>
            <ul>
              {focus.matches.map((m, i) => (
                <li key={i}>
                  <a href="#sample-file">{matchLine(focus, m, nounOf(focus))}</a>
                </li>
              ))}
            </ul>
            <p>
              Work samples can be read by agents, so the file was not added. It is held until {timeOf(focus.heldUntil, zone)} on {dayOf(focus.heldUntil, zone)}, then
              deleted, unless you confirm it. Held files are listed on this page until then.
            </p>
            <p>Remove the number from the document and choose the file again, or, if it is not {formatList(focus.nouns)}, confirm and add it.</p>
          </HeldFileSummary>
          <h2>Add a work sample</h2>
          <form method="get" action={here} className="inline">
            <input type="hidden" name="held" value={focus.id} />
            <input type="hidden" name="confirm" value="1" />
            <button type="submit" className="secondary">
              {focus.nouns.length === 1 ? `It is not ${formatList(focus.nouns)}` : 'It is none of these'}, add {focus.fileName}
            </button>
          </form>
        </UploadForm>
      ) : (
        <UploadForm api={api} samplesHref={here} key={search.notice ?? 'add'}>
          <h2>Add a work sample</h2>
        </UploadForm>
      )}
    </>
  );
}
