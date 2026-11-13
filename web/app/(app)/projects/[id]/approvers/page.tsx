import { areaLabel, handoffById, isAreaId, isProtectedId, protectedLabel } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { managers, peopleOn } from '@/record/queries';
import { approversOf } from '@/record/review';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';

type Search = { notice?: string; area?: string; approval?: string };
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Search> };

function outcome(search: Search): string | null {
  if (search.notice === 'area' && search.area && isAreaId(search.area)) return `${areaLabel(search.area)} saved`;
  if (search.notice === 'holder' && search.approval && isProtectedId(search.approval)) return `${protectedLabel(search.approval)} saved`;
  return null;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const done = outcome(await searchParams);
  return { title: done ? { absolute: `${done} - Approvers - XR Studio` } : 'Approvers' };
}

// "Look and concept art; character design; ..." with each label after the first in lower case,
// except where it starts with an abbreviation ("AI-use").
const lower = (label: string) => (/^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1));
function decides(handoffs: string[]): string {
  const own = handoffs.map((h) => handoffById(h)).filter((h) => h && !h.protectedApproval);
  const text = own.map((h, i) => (i === 0 ? (h?.label ?? '') : lower(h?.label ?? ''))).join('; ');
  const others = handoffs.length - own.length;
  if (others === 1) return `${text}. ${handoffById(handoffs.find((h) => handoffById(h)?.protectedApproval) ?? '')?.label} is a protected approval, below.`;
  if (others > 1) return `${text}. Its other hand-offs are protected approvals, below.`;
  return `${text}.`;
}

const joinAnd = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);

// **Approvers** (layer1-gates-and-queue#AC-4 to AC-7).
export default async function Approvers({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/approvers`);
  if (view.state !== 'open') return null;
  const a = await approversOf(id);
  const canChange = view.can.has('manage-gates');
  let message: string | null = null;
  const area = a.areas.find((x) => x.area === search.area);
  if (search.notice === 'area' && area) {
    message = `${area.label} saved: ${area.approver?.display} approves it, with ${area.delegate ? `${area.delegate.display} as delegate` : 'no delegate'}. Items already waiting in ${area.label} now wait for them.`;
  }
  const held = a.protected.find((x) => x.approval === search.approval);
  if (search.notice === 'holder' && held) message = `${held.label} saved: ${held.holder?.display} holds it.`;
  const who = managers(await peopleOn(id)).map((p) => p.display);
  return (
    <>
      {message ? <Notice title={outcome(search) ?? undefined}>{message}</Notice> : null}
      <h2 id="approvers-title">Approvers</h2>
      <p className="lead">Who decides the work that waits at each gate. Hand-offs not listed here, such as a build for rehearsal, move on without waiting for anyone.</p>
      {canChange ? null : <p>Directors and producers can change approvers. On this project: {joinAnd(who)}.</p>}
      <h3>Areas</h3>
      <p>The approver or the delegate can decide every item in their area, except items at a protected approval. The approver can hand an item to the delegate.</p>
      <table>
        <caption className="visually-hidden">Approver and delegate for each area</caption>
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Decides</th>
            <th scope="col">Approver</th>
            <th scope="col">Delegate</th>
            {canChange ? (
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {a.areas.map((x) => (
            <tr key={x.area}>
              <th scope="row">{x.label}</th>
              <td data-label="Decides">{decides(x.handoffs)}</td>
              <td data-label="Approver">{x.approver?.display}</td>
              <td data-label="Delegate">{x.delegate?.display ?? 'None'}</td>
              {canChange ? (
                <td>
                  <Link href={`/projects/${id}/approvers/${x.area}`}>
                    Change<span className="visually-hidden"> {x.label}</span>
                  </Link>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Protected approvals</h3>
      <p>These four never go to an AI. Each is held by one named person, who decides every item at that hand-off and cannot hand it on.</p>
      <table>
        <caption className="visually-hidden">Holder of each protected approval</caption>
        <thead>
          <tr>
            <th scope="col">Approval</th>
            <th scope="col">Holder</th>
            {canChange ? (
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {a.protected.map((x) => (
            <tr key={x.approval}>
              <th scope="row">{x.label}</th>
              <td data-label="Holder">{x.holder?.display}</td>
              {canChange ? (
                <td>
                  <Link href={`/projects/${id}/approvers/protected/${x.approval}`}>
                    Change<span className="visually-hidden"> {x.label}</span>
                  </Link>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      <p>One person can hold every approval. When a project starts, its owner holds them all.</p>
    </>
  );
}
