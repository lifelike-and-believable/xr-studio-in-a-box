import Link from 'next/link';
import type { ReactNode } from 'react';
import { projectsFor } from '@/record/queries';
import { openProject } from '@/ui/project-access';
import { ProjectSwitcher } from '@/ui/project-switcher';
import { ProjectTabs } from '@/ui/project-tabs';

export default async function ProjectLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { me, view } = await openProject(id, `/projects/${id}`);
  if (view.state !== 'open') {
    return (
      <main id="main">
        <h1>You no longer have access to this project</h1>
        <p>Your roles on this project were changed or removed. Ask the project&apos;s producer or director if you think this is a mistake.</p>
        <p>
          <Link href="/">Go to your projects</Link>
        </p>
      </main>
    );
  }
  const groups = new Map<string, { id: string; name: string }[]>();
  for (const p of await projectsFor(me.person.id)) groups.set(p.organisation, [...(groups.get(p.organisation) ?? []), p]);
  return (
    <main id="main">
      <div className="actions">
        <ProjectSwitcher
          current={view.project.name}
          groups={[...groups].map(([organisation, projects]) => ({ organisation, projects }))}
        />
      </div>
      <h1>{view.project.name}</h1>
      <p>
        Organisation: <Link href={`/organisations/${view.project.organisationId}`}>{view.organisation}</Link>
      </p>
      <ProjectTabs id={id} />
      {children}
    </main>
  );
}
