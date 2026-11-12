import { factLabel, factNoun, isFunderFact, type Fact } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EditFact, openFact } from '@/ui/fact-pages';
import { openOrganisation } from '@/ui/organisation-access';

type Props = { params: Promise<{ id: string; fact: string }>; searchParams: Promise<{ restore?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fact } = await params;
  return { title: isFunderFact(fact) ? factLabel(fact as Fact) : `Edit ${factNoun(fact as Fact)}` };
}

// Edit one organisation fact or funder profile (layer1-facts-identifiers-activity#AC-14, AC-16).
export default async function EditOrganisationFact({ params, searchParams }: Props) {
  const { id, fact } = await params;
  const { me, owner, access } = await openOrganisation(id, `/organisations/${id}/facts/${fact}/edit`, 'steward');
  const open = await openFact(me.person.id, owner, fact, true);
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link> &gt; Organisation facts
      </p>
      <h1>{isFunderFact(open.fact) ? factLabel(open.fact) : `Edit ${factNoun(open.fact)}`}</h1>
      <EditFact owner={owner} fact={open.fact} restore={(await searchParams).restore} />
    </main>
  );
}
