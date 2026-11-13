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
          <Link href="/projects">Go to your projects</Link>
        </p>
      </main>
    );
  }
  // Grouped by organisation id, so two organisations with the same name stay apart; labelled by name.
  const groups = new Map<string, { organisation: string; projects: { id: string; name: string }[] }>();
  for (const p of await projectsFor(me.person.id)) {
    const group = groups.get(p.organisationId) ?? { organisation: p.organisation, projects: [] };
    group.projects.push(p);
    groups.set(p.organisationId, group);
  }
  return (
    <main id="main">
      <div className="actions">
        <ProjectSwitcher
          current={view.project.name}
          groups={[...groups.values()]}
        />
      </div>
      <p>
        Organisation: <Link href={`/organisations/${view.project.organisationId}`}>{view.organisation}</Link>
      </p>
      <h1>{view.project.name}</h1>
      <ProjectTabs id={id} activity={view.can.has('read-activity')} />
      {children}
    </main>
  );
}
