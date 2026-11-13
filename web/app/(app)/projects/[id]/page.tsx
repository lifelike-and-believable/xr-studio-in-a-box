import type { Metadata } from 'next';
import Link from 'next/link';
import { managers, orList, peopleOn } from '@/record/queries';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> };

const OUTCOMES: Record<string, string> = { started: 'Project started', saved: 'Name and brief saved' };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { notice } = await searchParams;
  const { view } = await openProject(id, `/projects/${id}`);
  const name = view.state === 'open' ? view.project.name : 'Project';
  const outcome = notice ? OUTCOMES[notice] : undefined;
  return { title: outcome ? { absolute: `${outcome} - ${name} - XR Studio` } : name };
}

// A project's Overview (layer1-organisations-projects-people#AC-6, AC-19, AC-20, AC-22).
export default async function Overview({ params, searchParams }: Props) {
  const { id } = await params;
  const { notice } = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}`);
  if (view.state !== 'open') return null;
  const people = await peopleOn(id);
  let message: string | undefined;
  if (notice === 'started') {
    const owner = people.find((p) => p.id === view.project.ownerId);
    message =
      view.project.ownerId === me.person.id
        ? 'Project started. You own it and have the Director and Producer roles.'
        : `Project started. ${owner?.display ?? ''} owns it and has the Director and Producer roles. You have the Producer role.`;
  }
  if (notice === 'saved') message = 'Name and brief saved.';
  const who = orList(managers(people).map((p) => p.display));
  return (
    <section aria-labelledby="overview-title">
      {message ? <Notice title={OUTCOMES[notice ?? '']}>{message}</Notice> : null}
      <h2 id="overview-title">Overview</h2>
      <h3>Brief</h3>
      <p>{view.project.brief || 'No brief yet.'}</p>
      {view.can.has('edit-project') ? (
        <p>
          <Link href={`/projects/${id}/edit`}>Edit name and brief</Link>
        </p>
      ) : (
        <p>{who} can change the name and brief.</p>
      )}
    </section>
  );
}
