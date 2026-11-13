import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LAST_MANAGER } from '@/record/commands';
import { managers, personOn } from '@/record/queries';
import { approvalsHeldOn } from '@/record/review';
import { firstName } from '@/record/commands';
import { openProject } from '@/ui/project-access';
import { FocusHeading } from '@/ui/focus-heading';
import { removeAction } from '../../actions';

type Props = { params: Promise<{ id: string; personId: string }>; searchParams: Promise<{ error?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { error } = await searchParams;
  return { title: error === 'last-manager' ? 'Error: Remove from the project' : 'Remove from the project' };
}

// The removal confirmation; focus starts on its heading (layer1-organisations-projects-people#AC-32, AC-38).
export default async function Remove({ params, searchParams }: Props) {
  const { id, personId } = await params;
  const { error } = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/people/${personId}/remove`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-people')) notFound();
  const { people, target } = await personOn(id, personId);
  if (!target) notFound();
  // The last person who can manage people stays for that reason first, as the command decides.
  const lastManager = managers(people).filter((p) => p.id !== target.id).length === 0 && managers([target]).length === 1;
  // Someone who approves, delegates or holds an approval stays until those go to someone else
  // (layer1-gates-and-queue#AC-11).
  const holds = lastManager ? null : await approvalsHeldOn(id, target.id);
  if (holds) {
    return (
      <section aria-labelledby="remove-title">
        <FocusHeading id="remove-title">{`${target.display} cannot be removed yet`}</FocusHeading>
        <p>{holds}</p>
        <div className="actions">
          <Link href={`/projects/${id}/people`} className="button secondary">
            Keep {firstName(target.display)}
          </Link>
          <Link href={`/projects/${id}/approvers`} className="button">
            Go to Approvers
          </Link>
        </div>
      </section>
    );
  }
  // Refused because they are the last person who can manage people (AC-33).
  if (error === 'last-manager') {
    return (
      <section aria-labelledby="remove-title">
        <FocusHeading id="remove-title">{`${target.display} stays on ${view.project.name}`}</FocusHeading>
        <div role="alert" className="summary">
          <p>{LAST_MANAGER}</p>
        </div>
        <p>
          <Link href={`/projects/${id}/people`}>Back to People</Link>
        </p>
      </section>
    );
  }
  return (
    <section aria-labelledby="remove-title">
      <FocusHeading id="remove-title">{`Remove ${target.display} from ${view.project.name}?`}</FocusHeading>
      <p>They lose access the next time they do anything in XR Studio. Their past work and its history stay on the project.</p>
      <div className="actions">
        <Link href={`/projects/${id}/people`} className="button secondary">
          Keep {target.display}
        </Link>
        <form action={removeAction}>
          <input type="hidden" name="projectId" value={id} />
          <input type="hidden" name="personId" value={target.id} />
          <button type="submit" className="danger">
            Remove {target.display}
          </button>
        </form>
      </div>
    </section>
  );
}
