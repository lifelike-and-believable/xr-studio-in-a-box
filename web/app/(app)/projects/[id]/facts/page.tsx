import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { accessFor, currentFacts, projectFactList } from '@/record/facts';
import { managers, orList, peopleOn } from '@/record/queries';
import { editorsLine, FactBlock } from '@/ui/fact-pages';
import { factNotice } from '@/ui/fact-notice';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { viewerZone } from '@/ui/time';

type Search = { notice?: string; fact?: string; from?: string; to?: string };
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Search> };

// The page title leads with the outcome after a save or restore, as the notice does.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const message = await factNotice(await searchParams);
  const lead = message?.split('. ')[0]?.replace(/\.$/, '');
  return { title: lead ? `${lead} - Facts` : 'Facts' };
}

// A project's facts (layer1-facts-identifiers-activity#AC-1 to AC-5).
export default async function Facts({ params, searchParams }: Props) {
  const { id } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/facts`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  const access = await accessFor(me.person.id, owner);
  if (!access) notFound();
  const zone = await viewerZone();
  const facts = await currentFacts(owner, projectFactList, access.canSee);
  const org = { kind: 'organisation' as const, id: access.organisationId };
  const fromOrg = await currentFacts(org, ['legal-name', 'bio'], () => true);
  const editors = managers(await peopleOn(id)).map((p) => p.display);
  const message = await factNotice(await searchParams);
  const [legal, bio] = fromOrg.map((f) => f.current);
  return (
    <section aria-labelledby="facts-title">
      {message ? <Notice title={message.split('. ')[0]?.replace(/\.$/, '')}>{message}</Notice> : null}
      <h2 id="facts-title" className="visually-hidden">
        Project facts
      </h2>
      <p className="lead">
        {access.canEdit
          ? "The project's facts, recorded once. Funding documents, contracts and call sheets are drafted from them in later releases."
          : editorsLine(owner, orList(editors).replace(' or ', ' and '))}
      </p>
      <div className="fact-list">
        {facts.map((entry) => (
          <FactBlock key={entry.fact} owner={owner} entry={entry} canEdit={access.canEdit} zone={zone} />
        ))}
      </div>
      <h2>From {access.organisationName}</h2>
      {legal || bio ? (
        <>
          <p className="hint">These are the organisation&apos;s facts. Every project in the organisation reads them; change them on the organisation&apos;s page.</p>
          <dl className="facts">
            {legal ? (
              <>
                <dt>Legal name</dt>
                <dd>{'text' in legal.value ? legal.value.text : ''}</dd>
              </>
            ) : null}
            {bio ? (
              <>
                <dt>Bio</dt>
                <dd>{'text' in bio.value ? bio.value.text : ''}</dd>
              </>
            ) : null}
          </dl>
        </>
      ) : (
        <p>{access.organisationName} has no facts recorded yet. People who look after it add them on its page.</p>
      )}
      <p>
        <Link href={`/organisations/${access.organisationId}`}>Open {access.organisationName}&apos;s facts</Link>
      </p>
    </section>
  );
}
