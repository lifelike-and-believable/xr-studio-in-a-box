import { areaLabel, isAreaId } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { firstName } from '@/record/commands';
import { itemFor, itemsById, queueFor } from '@/record/review';
import { FocusLine } from '@/ui/focus-line';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { dayOf, entryTime, timeOf, viewerZone } from '@/ui/time';
import { ReviewLinks } from '@/ui/review-links';
import { QueueForm, type QueueGroup } from './queue-form';

type Search = { notice?: string; item?: string; decision?: string; n?: string; stage?: string; skipped?: string; area?: string; handedTo?: string };
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Search> };

// The filtered result line leads the page title, set on the server so a full page load keeps it
// (layer1-gates-and-queue#AC-23).
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const search = await searchParams;
  const filter = { area: search.area || undefined, handedTo: search.handedTo || undefined };
  if (!filter.area && !filter.handedTo) return { title: 'Review' };
  const { me, view } = await openProject(id, `/projects/${id}/review`);
  if (view.state !== 'open') return { title: 'Review' };
  return { title: { absolute: `${resultLine(await queueFor(me.person.id, id, filter), filter)} - Review - XR Studio` } };
}

type Queue = Awaited<ReturnType<typeof queueFor>>;

function resultLine(queue: Queue, filter: { area?: string; handedTo?: string }): string {
  const words = [
    filter.area && isAreaId(filter.area) ? areaLabel(filter.area) : null,
    filter.handedTo === 'none' ? 'not handed on' : null,
    filter.handedTo === 'you' ? 'handed to you' : null,
    filter.handedTo && !['none', 'you'].includes(filter.handedTo) ? `handed to ${queue.delegates.find((d) => d.id === filter.handedTo)?.display ?? ''}` : null,
  ].filter(Boolean);
  if (words.length > 0) return `${count(queue.total)} waiting for your decision: ${words.join(', ')}.`;
  return `${count(queue.total)} waiting for your decision, ${queue.blocking === 0 ? 'none blocking' : `${queue.blocking} blocking`}.`;
}

const count = (n: number) => `${n} item${n === 1 ? '' : 's'}`;
const joinAnd = (items: string[]) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

async function noticeFor(id: string, search: Search, zone: string): Promise<{ text: string; lead: string } | null> {
  if (search.notice === 'decided' && search.item) {
    const item = await itemFor(id, search.item);
    if (!item?.decision) return null;
    const lead = { accept: 'Accepted', revise: 'Revision requested', reject: 'Rejected' }[item.state as 'accept' | 'revise' | 'reject'];
    if (!lead) return null;
    const at = `${timeOf(item.decision.at, zone)} on ${dayOf(item.decision.at, zone)}`;
    return { lead, text: `${lead}: ${item.title}. Recorded as your decision at ${at}. ${item.requester.display} sees it under Sent by you.` };
  }
  if (search.notice === 'handed' && search.item) {
    const item = await itemFor(id, search.item);
    if (!item?.handedTo) return null;
    const to = item.handedTo.display;
    return { lead: 'Handed on', text: `Handed to ${to}: ${item.title}. It shows in ${firstName(to)}'s queue as handed to them. You can still decide it.` };
  }
  if (search.notice === 'batch' && search.decision) {
    const n = count(Number(search.n ?? 0));
    const where = search.stage ? ` in ${search.stage}` : '';
    const lead = { accept: `Accepted ${n}`, revise: `Revision requested for ${n}`, reject: `Rejected ${n}` }[search.decision as 'accept' | 'revise' | 'reject'];
    if (!lead) return null;
    const skipped = search.skipped ? await itemsById(id, search.skipped.split(',')) : [];
    const rest = skipped.length ? ` Not recorded for ${joinAnd(skipped.map((s) => s.title))}: decided by someone else first.` : '';
    return { lead, text: `${lead}${where}.${rest}` };
  }
  return null;
}

// **Review**: the queue (layer1-gates-and-queue#AC-20 to AC-24, AC-29).
export default async function Review({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}/review`);
  if (view.state !== 'open') return null;
  const zone = await viewerZone();
  const notice = await noticeFor(id, search, zone);
  const filter = { area: search.area || undefined, handedTo: search.handedTo || undefined };
  const queue = await queueFor(me.person.id, id, filter);
  const filtered = !!(filter.area || filter.handedTo);

  if (!queue.decidesAnything) {
    return (
      <>
        {notice ? <Notice title={notice.lead}>{notice.text}</Notice> : null}
        <ReviewLinks id={id} />
        <p>
          You do not approve any area on this project, so nothing waits for your decision here. <Link href={`/projects/${id}/approvers`}>Approvers</Link> lists
          who decides each area.
        </p>
        <p>To ask for a decision, use Send for review. What you have sent, and the decisions on it, are under Sent by you. Everything waiting lists all the work held at a gate on this project, and who it waits for.</p>
      </>
    );
  }

  const groups: QueueGroup[] = queue.groups.map((g) => ({
    handoff: g.handoff,
    stage: g.stage,
    area: g.area,
    blocking: g.items.filter((i) => i.blocking).length,
    items: g.items.map((i) => ({
      id: i.id,
      title: i.title,
      stage: i.stage,
      area: i.area,
      requester: i.requester.display,
      sent: entryTime(i.sentAt, zone),
      whatChanged: i.whatChanged,
      blocking: i.blocking,
      waitingStage: i.waitingStage,
      handedTo: i.handedTo?.display ?? null,
      recommendation: i.recommendation,
      file: i.file ? { name: i.file.name, mediaType: i.file.mediaType } : null,
      href: `/projects/${id}/review/${i.id}`,
      fileSrc: `/api/v1/projects/${id}/review-items/${i.id}/file`,
    })),
  }));

  const line = resultLine(queue, filter);

  return (
    <>
      {notice ? <Notice title={notice.lead}>{notice.text}</Notice> : null}
      <p className="lead">Work waiting for your decision, grouped by the gate it is held at. Groups with blocking items come first, oldest first.</p>
      <ReviewLinks id={id} />
      <form method="get" className="filters" aria-label="Filter the queue">
        <div className="filter-row">
          <div className="field">
            <label htmlFor="f-area">Area</label>
            <select id="f-area" name="area" defaultValue={filter.area ?? ''}>
              <option value="">All areas</option>
              {queue.areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-handed">Handed to</label>
            <select id="f-handed" name="handedTo" defaultValue={filter.handedTo ?? ''}>
              <option value="">Anyone</option>
              <option value="none">Not handed on</option>
              {queue.delegates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.display}
                </option>
              ))}
              {queue.isDelegate ? <option value="you">Handed to you</option> : null}
            </select>
          </div>
        </div>
        <div className="actions">
          <button type="submit">Apply filters</button>
          <Link href={`/projects/${id}/review`}>Clear filters</Link>
        </div>
      </form>
      {queue.total === 0 && !filtered ? (
        <>
          <h2>Nothing is waiting for your decision</h2>
          <p>When someone sends work at a hand-off you approve, it appears here.</p>
        </>
      ) : (
        <>
          {filtered ? <FocusLine>{line}</FocusLine> : <p>{line}</p>}
          <QueueForm projectId={id} groups={groups} />
        </>
      )}
    </>
  );
}
