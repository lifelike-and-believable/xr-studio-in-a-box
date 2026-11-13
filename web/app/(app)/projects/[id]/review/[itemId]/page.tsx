import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isId } from '@/record/ids';
import { decidersLine, deciderNames, itemFor } from '@/record/review';
import { workOfItem } from '@/record/work';
import { FeedbackThread } from '@/ui/feedback-thread';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { ReviewPreview } from '@/ui/review-preview';
import { entryTime, viewerZone } from '@/ui/time';
import { handAction, withdrawAction } from '../actions';
import { decisionCell } from '@/ui/work-view';
import { FeedbackForm } from '../../board/feedback-form';
import { DecisionForm } from './decision-form';

type Props = { params: Promise<{ id: string; itemId: string }>; searchParams: Promise<{ notice?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, itemId } = await params;
  const item = isId(id) && isId(itemId) ? await itemFor(id, itemId) : null;
  return { title: item ? `${item.title} - Review` : 'Review' };
}

const RESULT: Record<string, string> = { accept: 'Accept', revise: 'Request revision', reject: 'Reject' };
const DONE: Record<string, string> = { accept: 'Accepted by', revise: 'Revision requested by', reject: 'Rejected by', withdraw: 'Withdrawn by' };
const orList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`);

// One item (layer1-gates-and-queue#AC-25 to AC-28, AC-31). Everyone on the project can open it;
// only the people it waits for see **Your decision**.
export default async function Item({ params, searchParams }: Props) {
  const { id, itemId } = await params;
  const { notice } = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}/review/${itemId}`);
  if (view.state !== 'open') return null;
  if (!isId(itemId)) notFound();
  const item = await itemFor(id, itemId);
  if (!item) notFound();
  const zone = await viewerZone();
  const fileSrc = `/api/v1/projects/${id}/review-items/${item.id}/file`;
  const waiting = item.state === 'waiting';
  const canDecide = waiting && item.deciderIds.includes(me.person.id);
  const sender = item.requester.id === me.person.id;
  const d = item.deciders;
  const canHand = canDecide && d?.kind === 'area' && d.approver.id === me.person.id && !!d.delegate && !item.handedTo;
  // Its piece of work: which version this is, the one before, and this version's feedback
  // (layer1-versions-board-first-view#AC-25).
  const work = await workOfItem(id, item.id);
  const total = work?.versions.length ?? 1;
  const thisVersion = work?.versions.find((v) => v.itemId === item.id);
  const previous = work?.versions.find((v) => v.version === item.version - 1);
  return (
    <section aria-labelledby="item-title">
      <p>
        <Link href={`/projects/${id}/review`}>Review</Link>
      </p>
      <h2 id="item-title">{item.title}</h2>
      {notice === 'feedback' ? <Notice title="Feedback added">Feedback added.</Notice> : null}
      {total > 1 && work ? (
        <p>
          Version {item.version} of {total}. <Link href={`/projects/${id}/board/${work.id}`}>See every version and compare</Link>
        </p>
      ) : null}
      <div className="version-pair">
        <div>
          {item.file ? (
            <>
              <ReviewPreview src={fileSrc} file={item.file} large />
              <p>
                <a href={fileSrc}>Open the file</a>
              </p>
            </>
          ) : null}
        </div>
        {thisVersion ? (
          <section aria-labelledby={`feedback-${item.version}`}>
            <FeedbackThread version={item.version} entries={thisVersion.feedback} zone={zone} />
            <FeedbackForm projectId={id} itemId={item.id} version={item.version} back={`/projects/${id}/review/${item.id}`} />
          </section>
        ) : null}
      </div>
      <dl className="meta">
        <dt>Stage</dt>
        <dd>
          {item.stage} ({item.area}
          {item.protectedItem ? ', protected approval' : ''})
        </dd>
        <dt>Requested by</dt>
        <dd>
          {item.requester.display}, {entryTime(item.sentAt, zone)}
        </dd>
        <dt>What changed</dt>
        <dd>{item.whatChanged}</dd>
        {previous ? (
          <>
            <dt>Version {previous.version}</dt>
            <dd>
              {previous.decision ? decisionCell(previous, zone) : 'Waiting'}
              {previous.decision?.feedback ? `: "${previous.decision.feedback}"` : ''}
            </dd>
          </>
        ) : null}
        {waiting ? (
          <>
            <dt>Waiting for</dt>
            <dd>{decidersLine(d)}</dd>
          </>
        ) : item.decision ? (
          <>
            <dt>Decision</dt>
            <dd>
              {DONE[item.state]} {item.decision.by}, {entryTime(item.decision.at, zone)}
              {item.decision.feedback ? <span className="quote">{item.decision.feedback}</span> : null}
            </dd>
          </>
        ) : null}
        {item.blocking ? (
          <>
            <dt>Waiting on this</dt>
            <dd>
              <span className="tag">Blocking</span> {item.waitingStage} waits on this decision.
            </dd>
          </>
        ) : null}
        {item.handedTo && waiting ? (
          <>
            <dt>Handed to</dt>
            <dd>{item.handedTo.display}</dd>
          </>
        ) : null}
      </dl>
      {item.recommendation && waiting ? (
        <p className="ai">
          <strong>AI recommendation, not a decision:</strong> {RESULT[item.recommendation.result] ?? item.recommendation.result}. {item.recommendation.reason} Only a person can pass
          this gate.
        </p>
      ) : null}
      {sender && waiting ? (
        <>
          <p>You sent this. It waits until {orList(deciderNames(d))} decides.</p>
          <form action={withdrawAction}>
            <input type="hidden" name="projectId" value={id} />
            <input type="hidden" name="itemId" value={item.id} />
            <button type="submit" className="secondary">
              Withdraw
            </button>
          </form>
        </>
      ) : null}
      {canDecide ? <DecisionForm projectId={id} itemId={item.id} title={item.title} requester={item.requester.display} /> : null}
      {canHand && d?.kind === 'area' && d.delegate ? (
        <form action={handAction}>
          <input type="hidden" name="projectId" value={id} />
          <input type="hidden" name="itemId" value={item.id} />
          <button type="submit" className="link">
            Hand to {d.delegate.display}
          </button>
        </form>
      ) : null}
    </section>
  );
}
