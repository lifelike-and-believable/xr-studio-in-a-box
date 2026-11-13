import { areaLabel, handoffById } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { firstName } from '@/record/commands';
import { isId } from '@/record/ids';
import { approverChoices, decidersLine } from '@/record/review';
import { workFor, type WorkPage } from '@/record/work';
import { ConfirmDialog } from '@/ui/dialog';
import { FeedbackThread } from '@/ui/feedback-thread';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { RefreshOnChange } from '@/ui/refresh-on-change';
import { ReviewPreview } from '@/ui/review-preview';
import { entryTime, timeOf, viewerZone } from '@/ui/time';
import { andList, decisionCell, deciderNames, ownerText, stateText } from '@/ui/work-view';
import { changeOwnerAction, removeWorkAction, withdrawVersionAction } from '../actions';
import { FeedbackForm } from '../feedback-form';
import { RestoreDialog } from '../restore-dialog';

type Props = { params: Promise<{ id: string; workId: string }>; searchParams: Promise<{ notice?: string; item?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, workId } = await params;
  const found = isId(id) && isId(workId) ? await workFor(id, workId) : null;
  return { title: found ? `${found.title} - Board` : 'Board' };
}

const orList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`);

function noticeFor(w: WorkPage, notice: string | undefined, item: string | undefined, zone: string): { lead: string; text: string; alert?: boolean } | null {
  const latest = w.versions[0];
  const deciders = deciderNames(w.deciders);
  if (notice === 'added') return { lead: 'Added', text: `Added ${w.title} to ${handoffById(w.handoff)?.label ?? w.handoff}, owned by ${w.owner.display}. It shows under What needs you for ${firstName(w.owner.display)}.` };
  if (notice === 'owner') return { lead: 'Owner changed', text: `${w.owner.display} now owns ${w.title}. It shows under What needs you for ${firstName(w.owner.display)}.` };
  if (notice === 'feedback') return { lead: 'Feedback added', text: 'Feedback added.' };
  if (notice === 'sent') {
    const v = w.versions.find((x) => x.itemId === item);
    if (v) return { lead: 'Sent for review', text: `Sent for review: ${w.title}, version ${v.version}. It waits for ${orList(deciders)}.` };
  }
  if (notice === 'restored' && latest?.restoredFrom) {
    const kept = w.versions.slice(1).map((v) => v.version).reverse();
    return {
      lead: 'Restored',
      text: `Restored version ${latest.restoredFrom} as version ${latest.version}. It waits for ${orList(deciders)}. Versions ${andList(kept.map(String))} are kept, with their feedback.`,
    };
  }
  if (notice === 'withdrawn' && latest?.state === 'withdraw') {
    return { lead: 'Withdrawn', text: `Withdrawn: ${w.title}, version ${latest.version}. It has left the queue of ${andList(deciders)}.` };
  }
  const first = w.versions.at(-1);
  if (notice === 'not-removed' && first) {
    return { lead: 'Not removed', alert: true, text: `Not removed: ${first.sentBy.display} sent version ${first.version} at ${timeOf(first.sentAt, zone)}. Work with versions stays on the board.` };
  }
  return null;
}

// A piece of work's page (layer1-versions-board-first-view#AC-15, AC-16, AC-18 to AC-22, AC-30).
export default async function Work({ params, searchParams }: Props) {
  const { id, workId } = await params;
  const search = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}/board/${workId}`);
  if (view.state !== 'open') return null;
  const w = isId(workId) ? await workFor(id, workId) : null;
  if (!w) notFound();
  const zone = await viewerZone();
  const notice = noticeFor(w, search.notice, search.item, zone);
  const planner = view.can.has('plan-work');
  const handoff = handoffById(w.handoff);
  const latest = w.versions[0] ?? null;
  const waiting = latest?.state === 'waiting';
  const deciders = deciderNames(w.deciders);
  const path = `/projects/${id}/board/${w.id}`;
  const file = (itemId: string) => `/api/v1/projects/${id}/review-items/${itemId}/file`;
  const restore = (version: number) => (
    <RestoreDialog
      projectId={id}
      workId={w.id}
      title={w.title}
      version={version}
      next={(latest?.version ?? 0) + 1}
      stage={handoff?.label ?? w.handoff}
      deciders={orList(deciders)}
      seers={andList(deciders)}
      kept={(() => {
        const later = w.versions.filter((v) => v.version > version).map((v) => v.version).reverse();
        return later.length === 1 ? `Version ${later[0]} is kept, with its feedback.` : `Versions ${andList(later.map(String))} are kept, with their feedback.`;
      })()}
    />
  );
  return (
    <section aria-labelledby="work-title">
      <p>
        <Link href={`/projects/${id}/board`}>Board</Link>
      </p>
      <h2 id="work-title">{w.title}</h2>
      {notice ? notice.alert ? <div role="alert" className="notice">{notice.text}</div> : <Notice title={notice.lead}>{notice.text}</Notice> : null}
      <RefreshOnChange url={`/api/v1/projects/${id}/work/${w.id}`} stamp={w.stamp} />
      <dl className="meta">
        <dt>Stage</dt>
        <dd>
          {handoff?.label ?? w.handoff}
          {handoff?.area ? ` (${areaLabel(handoff.area)})` : ''}
        </dd>
        <dt>Owner</dt>
        <dd>
          {ownerText(w.owner)}
          {w.owner.id === me.person.id ? ' (you)' : ''}
        </dd>
        <dt>State</dt>
        <dd>{stateText(w, zone)}</dd>
        {waiting && latest?.waitingHandoff ? (
          <>
            <dt>Waiting on this</dt>
            <dd>
              <span className="tag">Blocking</span> {handoffById(latest.waitingHandoff)?.label} waits on this decision.
            </dd>
          </>
        ) : null}
        <dt>Decided by</dt>
        <dd>{decidersLine(w.deciders)}</dd>
        {w.addedBy ? (
          <>
            <dt>Added by</dt>
            <dd>
              {w.addedBy.display}, {entryTime(w.addedAt, zone)}
            </dd>
          </>
        ) : null}
      </dl>
      {planner ? (
        <form action={changeOwnerAction} className="owner-form">
          <input type="hidden" name="projectId" value={id} />
          <input type="hidden" name="workId" value={w.id} />
          <div className="field">
            <label htmlFor="owner">Owner</label>
            <select id="owner" name="ownerId" defaultValue={w.owner.id}>
              {(await approverChoices(id)).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="secondary">
            Change owner
          </button>
        </form>
      ) : null}
      {!latest ? (
        <>
          <h3>Next step</h3>
          <p>
            Make it, then send it for review. It does not move on until {orList(deciders)} accepts it.
          </p>
        </>
      ) : null}
      <div className="actions">
        {!latest ? (
          <Link href={`/projects/${id}/review/new?work=${w.id}`} className="button">
            Send for review
          </Link>
        ) : waiting ? (
          latest.sentBy.id === me.person.id ? (
            <form action={withdrawVersionAction}>
              <input type="hidden" name="projectId" value={id} />
              <input type="hidden" name="workId" value={w.id} />
              <input type="hidden" name="itemId" value={latest.itemId} />
              <button type="submit" className="secondary">
                Withdraw version {latest.version}
              </button>
            </form>
          ) : null
        ) : (
          <Link href={`/projects/${id}/review/new?work=${w.id}`} className="button">
            Send a revised version
          </Link>
        )}
        {latest ? <Link href={`${path}/compare`}>Compare versions</Link> : null}
        {planner && !latest ? (
          <ConfirmDialog
            trigger={`Remove ${w.title}`}
            triggerClass="secondary"
            heading={`Remove ${w.title} from the board?`}
            description={`It has no versions, so nothing else is lost. ${w.owner.display} no longer sees it under What needs you. The removal is recorded in Activity.`}
            safe="Go back"
            confirm={`Remove ${w.title}`}
            action={removeWorkAction}
            fields={{ projectId: id, workId: w.id }}
            danger
          />
        ) : null}
      </div>
      {latest ? (
        <div className="version-pair">
          <section aria-labelledby="latest-title">
            <h3 id="latest-title">Version {latest.version}, the latest</h3>
            {latest.file ? (
              <>
                <ReviewPreview src={file(latest.itemId)} file={latest.file} large />
                <p>
                  <a href={file(latest.itemId)}>Open the file</a>
                </p>
              </>
            ) : null}
            <dl className="meta">
              <dt>Sent by</dt>
              <dd>
                {latest.sentBy.display}, {entryTime(latest.sentAt, zone)}
              </dd>
              <dt>What changed</dt>
              <dd>{latest.whatChanged}</dd>
              {latest.restoredFrom ? (
                <>
                  <dt>Restored from</dt>
                  <dd>Version {latest.restoredFrom}</dd>
                </>
              ) : null}
              <dt>Decision</dt>
              <dd>{latest.decision ? decisionCell(latest, zone) : `Waiting for ${orList(deciders)}`}</dd>
            </dl>
          </section>
          <section aria-labelledby={`feedback-${latest.version}`}>
            <FeedbackThread version={latest.version} entries={latest.feedback} zone={zone} />
            <FeedbackForm projectId={id} itemId={latest.itemId} version={latest.version} back={path} />
          </section>
        </div>
      ) : null}
      <h3>Versions</h3>
      {!latest ? (
        <p>No versions yet. The first one is made when someone sends this work for review.</p>
      ) : (
        <>
          {waiting && w.versions.length > 1 ? (
            <p>
              Version {latest.version} is waiting for review. To restore an earlier version, withdraw version {latest.version} first.
            </p>
          ) : null}
          <table>
            <caption>Every version of this work, newest first</caption>
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">Sent</th>
                <th scope="col">What changed</th>
                <th scope="col">Decision</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {w.versions.map((v) => (
                <tr key={v.itemId}>
                  <th scope="row">
                    <Link href={`/projects/${id}/review/${v.itemId}`}>
                      Version {v.version}
                      {v === latest ? ' (latest)' : ''}
                    </Link>
                  </th>
                  <td data-label="Sent">
                    {v.sentBy.display}, {entryTime(v.sentAt, zone)}
                  </td>
                  <td data-label="What changed">{v.whatChanged}</td>
                  <td data-label="Decision">{decisionCell(v, zone)}</td>
                  <td data-label="Actions">{v !== latest && !waiting ? restore(v.version) : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
