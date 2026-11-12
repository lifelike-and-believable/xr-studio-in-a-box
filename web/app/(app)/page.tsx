import { ROLE_LABELS } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { hasOnlyNonDashboardRoles, projectsFor } from '@/record/queries';
import { requirePerson } from '@/ui/session';

export const metadata: Metadata = { title: 'Projects' };

// Every project the person is on (layer1-organisations-projects-people#AC-13).
export default async function Projects() {
  const me = await requirePerson('/');
  const projects = await projectsFor(me.person.id);
  if (projects.length === 0 && (await hasOnlyNonDashboardRoles(me.person.id))) {
    return (
      <main id="main">
        <h1>Nothing in the dashboard for you yet</h1>
        <p>Your roles do not use the dashboard. You will get an email with a link to your own page when there is something for you. If you need a different role, contact the person who added you.</p>
      </main>
    );
  }
  return (
    <main id="main">
      <h1>Projects</h1>
      <div className="actions">
        <Link href="/projects/new" className="button">
          Start a project
        </Link>
        <Link href="/organisations/new" className="button secondary">
          Create an organisation
        </Link>
      </div>
      {projects.length === 0 ? (
        <>
          <p>You are not on any projects.</p>
          <p>If you were invited to a project, open the link in your invitation email, or ask its producer or director to add you. If you are setting up your own production, start a project or create an organisation.</p>
        </>
      ) : (
        <ul className="cards">
          {projects.map((p) => (
            <li key={p.id}>
              <h2>
                <Link href={`/projects/${p.id}`}>{p.name}</Link>
                {p.owner ? <span className="tag">Owner</span> : null}
              </h2>
              <p>Organisation: {p.organisation}</p>
              <p>Your roles: {p.roles.map((r) => ROLE_LABELS[r]).join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
