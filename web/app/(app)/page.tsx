import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { projectsFor } from '@/record/queries';
import { ProjectsList } from '@/ui/projects-list';
import { requirePerson } from '@/ui/session';

export const metadata: Metadata = { title: 'Projects' };

// A person on at least one project lands on What needs you; anyone else sees Projects
// (layer1-versions-board-first-view#AC-32).
export default async function Home() {
  const me = await requirePerson('/');
  if ((await projectsFor(me.person.id)).length > 0) redirect('/what-needs-you');
  return <ProjectsList personId={me.person.id} />;
}
