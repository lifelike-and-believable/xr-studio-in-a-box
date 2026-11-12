import { ROLE_LABELS, joinLabels, usesDashboard } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { managers, orList, peopleOn } from '@/record/queries';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { resendAction } from './actions';

type Search = { notice?: string; person?: string; mail?: string; who?: string };
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Search> };

const OUTCOMES: Record<string, string> = {
  added: 'Person added',
  resent: 'Invitation sent again',
  wait: 'Not sent',
  'resend-failed': 'Invitation not sent',
  roles: 'Roles saved',
  removed: 'Person removed',
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { notice } = await searchParams;
  const outcome = notice ? OUTCOMES[notice] : undefined;
  return { title: outcome ? { absolute: `${outcome} - People - XR Studio` } : 'People' };
}

// **People** (layer1-organisations-projects-people#AC-28 to AC-36).
export default async function People({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/people`);
  if (view.state !== 'open') return null;
  const people = await peopleOn(id);
  const canManage = view.can.has('manage-people');
  const subject = people.find((p) => p.id === search.person);
  let message: string | undefined;
  if (subject && search.notice === 'added') {
    const added = `${subject.display} added as ${joinLabels(subject.roles)}.`;
    const nonDashboard = subject.roles.filter((r) => !usesDashboard([r]));
    message = {
      invitation: `${added} We have emailed ${subject.email} an invitation link that lasts 7 days.`,
      added: `${added} We have emailed ${subject.email} a link to the project.`,
      none: `${added} XR Studio has not emailed ${subject.display}: ${joinLabels(nonDashboard)} ${nonDashboard.length > 1 ? 'do' : 'does'} not use the dashboard. They will get a link to their own page when there is something for them, so let them know.`,
      failed: `${added} The email to ${subject.email} could not be sent. Check the address with them, then select Send the sign-in link again.`,
      // An email went to that address less than a minute ago, so none was sent now (AC-3).
      limited: `${added} We have not emailed ${subject.email} yet, because an email went to that address less than a minute ago. You can send another in a minute.`,
    }[search.mail ?? ''];
  }
  if (subject && search.notice === 'resent') {
    message = `We have sent ${subject.display} a new invitation link to ${subject.email}. It lasts 7 days. You can send another in a minute.`;
  }
  if (search.notice === 'wait') message = 'You can send another in a minute';
  if (subject && search.notice === 'resend-failed') message = `The email to ${subject.email} could not be sent.`;
  if (subject && search.notice === 'roles') {
    const saved = `${subject.display}'s roles saved: ${joinLabels(subject.roles)}.`;
    // Their first dashboard role brings an invitation (AC-30).
    message = {
      invitation: `${saved} We have emailed ${subject.email} an invitation link that lasts 7 days.`,
      failed: `${saved} The invitation email to ${subject.email} could not be sent. Select Send the sign-in link again.`,
      limited: `${saved} We have not emailed ${subject.email} an invitation yet. You can send another in a minute.`,
    }[search.mail ?? ''] ?? saved;
  }
  if (search.notice === 'removed' && search.who) {
    message = `${search.who} removed from ${view.project.name}. Their past work stays on the project.`;
  }
  const who = orList(managers(people).map((p) => p.display));
  return (
    <section aria-labelledby="people-title">
      {message ? <Notice title={OUTCOMES[search.notice ?? '']}>{message}</Notice> : null}
      <h2 id="people-title">People</h2>
      {canManage ? (
        <p>
          <Link href={`/projects/${id}/people/new`} className="button">
            Add a person
          </Link>
        </p>
      ) : (
        <p>Ask {who} to add people or change roles.</p>
      )}
      <table>
        <thead>
          <tr>
            <th scope="col">Person</th>
            <th scope="col">Roles</th>
            <th scope="col">Status</th>
            {canManage ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>
                {p.display}
                {p.owner ? <span className="tag">Owner</span> : null}
              </td>
              <td data-label="Roles">{p.roles.map((r) => ROLE_LABELS[r]).join(', ')}</td>
              <td data-label="Status">{p.status}</td>
              {canManage ? (
                <td>
                  <div className="actions">
                    <Link href={`/projects/${id}/people/${p.id}`}>
                      Change roles or remove<span className="visually-hidden"> {p.display}</span>
                    </Link>
                    {p.status === 'Invited, not signed in yet' ? (
                      <form action={resendAction}>
                        <input type="hidden" name="projectId" value={id} />
                        <input type="hidden" name="personId" value={p.id} />
                        <button type="submit" className="link">
                          Send the sign-in link again<span className="visually-hidden"> to {p.display}</span>
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
