import type { Metadata } from 'next';
import { ProjectsList } from '@/ui/projects-list';
import { requirePerson } from '@/ui/session';

export const metadata: Metadata = { title: 'Projects' };

// **Projects** (decision-navigation-and-urls, layer1-versions-board-first-view#AC-32).
export default async function Projects() {
  const me = await requirePerson('/projects');
  return <ProjectsList personId={me.person.id} />;
}
