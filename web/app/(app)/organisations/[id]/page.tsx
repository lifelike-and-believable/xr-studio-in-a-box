import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { organisationFor } from '@/record/queries';
import { factNotice } from '@/ui/fact-notice';
import { Notice } from '@/ui/notice';
import { OrganisationFacts } from '@/ui/organisation-facts';
import { requirePerson } from '@/ui/session';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string; fact?: string; from?: string; to?: string }> };

const NOTICES: Record<string, string> = { created: 'Organisation created.', saved: 'Organisation saved.' };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const search = await searchParams;
  const text = (search.notice ? NOTICES[search.notice] : undefined) ?? (await factNotice(search))?.split('. ')[0];
  return { title: text ? { absolute: `${text.replace(/\.$/, '')} - XR Studio` } : 'Organisation' };
}

// An organisation's page (layer1-organisations-projects-people#AC-24).
export default async function OrganisationPage({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { notice } = search;
  const me = await requirePerson(`/organisations/${id}`);
  const org = await organisationFor(me.person.id, id);
  if (!org) notFound();
  const message = (notice ? NOTICES[notice] : undefined) ?? (await factNotice(search, org.name));
  return (
    <main id="main">
      {message ? <Notice title={message.split('. ')[0]?.replace(/\.$/, '')}>{message}</Notice> : null}
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
      {org.looksAfter ? (
        <nav aria-label="Organisation">
          <ul>
            <li>
              <Link href={`/organisations/${org.id}/identifier-formats`}>Identifier formats</Link>
            </li>
            <li>
              <Link href={`/organisations/${org.id}/activity`}>Activity</Link>
            </li>
          </ul>
        </nav>
      ) : null}
      <OrganisationFacts organisationId={org.id} personId={me.person.id} zone={await viewerZone()} />
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
      <p className="hint">Merging two organisations comes in a later release.</p>
    </main>
  );
}
