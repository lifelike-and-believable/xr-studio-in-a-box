import type { Metadata } from 'next';
import Link from 'next/link';
import { itemFor, sentBy } from '@/record/review';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { ReviewLinks } from '@/ui/review-links';
import { dayOf, entryTime, timeOf, viewerZone } from '@/ui/time';
import { withdrawAction } from '../actions';

type Search = { notice?: string; item?: string };
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Search> };

export const metadata: Metadata = { title: 'Sent by you - Review' };

const orList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`);
const andList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);
const STATUS: Record<string, string> = { accept: 'Accepted by', revise: 'Revision requested by', reject: 'Rejected by' };
const WORD: Record<string, string> = { accept: 'accepted', revise: 'asked for a revision of', reject: 'rejected' };

// **Sent by you** (layer1-gates-and-queue#AC-15, AC-33 to AC-35).
export default async function Sent({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}/review/sent`);
  if (view.state !== 'open') return null;
  const zone = await viewerZone();
  const rows = await sentBy(me.person.id, id);
  const subject = search.item ? rows.find((r) => r.id === search.item) : undefined;
  let notice: { lead: string; text: string; alert?: boolean } | null = null;
  if (subject && search.notice === 'sent') {
    notice = { lead: 'Sent for review', text: `Sent for review: ${subject.title}. It waits for ${orList(subject.deciders ? deciderList(subject.deciders) : [])}.` };
  }
  if (subject && search.notice === 'withdrawn') {
    notice = { lead: 'Withdrawn', text: `Withdrawn: ${subject.title}. It has left the queue of ${andList(deciderList(subject.deciders))}. To send it again, use Send it again.` };
  }
  if (search.notice === 'not-withdrawn' && search.item) {
    const item = await itemFor(id, search.item);
    if (item?.decision) {
      notice = {
        lead: 'Not withdrawn',
        text: `Not withdrawn: ${item.decision.by} ${WORD[item.state] ?? item.state} it at ${timeOf(item.decision.at, zone)} on ${dayOf(item.decision.at, zone)}.`,
        alert: true,
      };
    }
  }
  // The same form as on the work's page, so the new item is the work's next version
  // (layer1-versions-board-first-view#AC-27).
  const again = (r: (typeof rows)[number]) => `/projects/${id}/review/new?${new URLSearchParams({ work: r.workId })}`;
  return (
    <>
      {notice ? <Notice title={notice.lead}>{notice.text}</Notice> : null}
      <ReviewLinks id={id} current="sent" />
      <h2>Sent by you</h2>
      {rows.length === 0 ? (
        <p>You have not sent anything for review on this project.</p>
      ) : (
        <table>
          <caption className="visually-hidden">Work you sent for review, newest first</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Stage</th>
              <th scope="col">Sent</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <Link href={`/projects/${id}/review/${r.id}`}>{r.title}</Link>
                </th>
                <td data-label="Stage">{r.stage}</td>
                <td data-label="Sent">{entryTime(r.sentAt, zone)}</td>
                <td data-label="Status">
                  {r.state === 'waiting' ? (
                    <>
                      Waiting for {r.waitingFor}
                      <form action={withdrawAction}>
                        <input type="hidden" name="projectId" value={id} />
                        <input type="hidden" name="itemId" value={r.id} />
                        <button type="submit" className="link">
                          Withdraw<span className="visually-hidden"> {r.title}</span>
                        </button>
                      </form>
                    </>
                  ) : r.state === 'withdraw' && r.decision ? (
                    <>
                      Withdrawn by you, {entryTime(r.decision.at, zone)}
                      {r.isLatest ? (
                        <>
                          <br />
                          <Link href={again(r)}>
                            Send it again<span className="visually-hidden">: {r.title}</span>
                          </Link>
                        </>
                      ) : null}
                    </>
                  ) : r.decision ? (
                    <>
                      {STATUS[r.state]} {r.decision.by}, {entryTime(r.decision.at, zone)}
                      {r.decision.feedback ? <span className="quote">{r.decision.feedback}</span> : null}
                      {r.state === 'revise' && r.isLatest ? (
                        <Link href={again(r)}>
                          Send a revised version<span className="visually-hidden"> of {r.title}</span>
                        </Link>
                      ) : null}
                      {r.state === 'reject' && r.isLatest ? (
                        <Link href={again(r)}>
                          Send it again<span className="visually-hidden">: {r.title}</span>
                        </Link>
                      ) : null}
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function deciderList(d: (Awaited<ReturnType<typeof sentBy>>)[number]['deciders']): string[] {
  if (!d) return [];
  return d.kind === 'protected' ? [d.holder.display] : [d.approver.display, ...(d.delegate ? [d.delegate.display] : [])];
}
