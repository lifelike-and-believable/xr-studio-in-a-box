import type { Metadata } from 'next';
import Link from 'next/link';
import { waitingOn } from '@/record/review';
import { openProject } from '@/ui/project-access';
import { ReviewLinks } from '@/ui/review-links';
import { entryTime, viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Everything waiting - Review' };

// **Everything waiting** (layer1-gates-and-queue#AC-36).
export default async function Waiting({ params }: Props) {
  const { id } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/review/waiting`);
  if (view.state !== 'open') return null;
  const zone = await viewerZone();
  const rows = await waitingOn(id, me.person.id);
  return (
    <>
      <ReviewLinks id={id} current="waiting" />
      <h2>Everything waiting</h2>
      <p>All work held at a gate on this project, oldest first, and who it waits for. Only they can decide it.</p>
      {rows.length === 0 ? (
        <p>Nothing is waiting for a decision on this project.</p>
      ) : (
        <table>
          <caption className="visually-hidden">Work waiting for a decision, oldest first</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Stage</th>
              <th scope="col">Sent</th>
              <th scope="col">Waiting for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <Link href={`/projects/${id}/review/${r.id}`}>{r.title}</Link>
                  {r.version > 1 ? <span className="version"> Version {r.version}</span> : null}
                  {r.blocking ? <span className="tag">Blocking</span> : null}
                </th>
                <td data-label="Stage">{r.stage}</td>
                <td data-label="Sent">
                  {r.requester.display}, {entryTime(r.sentAt, zone)}
                </td>
                <td data-label="Waiting for">{r.waitingFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
