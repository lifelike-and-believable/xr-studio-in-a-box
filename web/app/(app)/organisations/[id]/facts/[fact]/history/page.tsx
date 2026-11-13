import { factNoun, type Fact } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { History, openFact } from '@/ui/fact-pages';
import { openOrganisation } from '@/ui/organisation-access';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string; fact?: string }>; searchParams: Promise<{ compare?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fact = 'standard-work-samples' } = await params;
  return { title: `Earlier versions of ${factNoun(fact as Fact)}` };
}

// One organisation fact's earlier versions, compare and restore (layer1-facts-identifiers-activity#AC-14).
export default async function OrganisationFactHistory({ params, searchParams }: Props) {
  const { id, fact = 'standard-work-samples' } = await params;
  const { me, owner, access } = await openOrganisation(id, `/organisations/${id}/facts/${fact}/history`);
  const open = await openFact(me.person.id, owner, fact, false);
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link> &gt; Organisation facts
      </p>
      <h1>{access.ownerName}</h1>
      <History owner={owner} fact={open.fact} canEdit={open.canEdit} zone={await viewerZone()} compare={(await searchParams).compare} />
    </main>
  );
}
