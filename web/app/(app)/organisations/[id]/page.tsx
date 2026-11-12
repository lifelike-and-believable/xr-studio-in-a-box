import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { organisationFor } from '@/record/queries';
import { Notice } from '@/ui/notice';
import { requirePerson } from '@/ui/session';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> };

const NOTICES: Record<string, string> = { created: 'Organisation created.', saved: 'Organisation saved.' };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { notice } = await searchParams;
  const text = notice ? NOTICES[notice] : undefined;
  return { title: text ? { absolute: `${text.replace(/\.$/, '')} - XR Studio` } : 'Organisation' };
}

// An organisation's page (layer1-organisations-projects-people#AC-24).
export default async function OrganisationPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { notice } = await searchParams;
  const me = await requirePerson(`/organisations/${id}`);
  const org = await organisationFor(me.person.id, id);
  if (!org) notFound();
  const message = notice ? NOTICES[notice] : undefined;
  return (
    <main id="main">
      {message ? <Notice>{message}</Notice> : null}
      <h1>{org.name}</h1>
      <div className="actions">
        <Link href={`/projects/new?organisation=${org.id}`} className="button">
          Start a project in this organisation
        </Link>
        {org.looksAfter ? (
          <Link href={`/organisations/${org.id}/edit`} className="button secondary">
            Edit organisation
          </Link>
        ) : null}
      </div>
      <h2>Looked after by</h2>
      <ul>
        {org.stewards.map((s) => (
          <li key={s.id}>{s.display}</li>
        ))}
      </ul>
      <h2>Projects</h2>
      {org.projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {org.projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <h2>Organisation facts</h2>
      <p>No organisation facts yet.</p>
      <p className="hint">Merging two organisations comes in a later release.</p>
    </main>
  );
}
