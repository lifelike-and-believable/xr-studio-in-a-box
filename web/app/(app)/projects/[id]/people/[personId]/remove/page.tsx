import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { personOn } from '@/record/queries';
import { openProject } from '@/ui/project-access';
import { FocusHeading } from '@/ui/focus-heading';
import { removeAction } from '../../actions';

export const metadata: Metadata = { title: 'Remove from the project' };

// The removal confirmation; focus starts on its heading (layer1-organisations-projects-people#AC-32, AC-38).
export default async function Remove({ params }: { params: Promise<{ id: string; personId: string }> }) {
  const { id, personId } = await params;
  const { view } = await openProject(id, `/projects/${id}/people/${personId}/remove`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-people')) notFound();
  const { target } = await personOn(id, personId);
  if (!target) notFound();
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
