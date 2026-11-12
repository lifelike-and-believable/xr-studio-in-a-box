import type { Metadata } from 'next';
import Link from 'next/link';
import { ConfirmFact, openFact } from '@/ui/fact-pages';
import { openOrganisation } from '@/ui/organisation-access';

type Props = { params: Promise<{ id: string; fact: string }> };

export const metadata: Metadata = { title: 'Confirm it is not an identifier' };

// Confirm text in an organisation fact is not an identifier (layer1-facts-identifiers-activity#AC-23).
export default async function ConfirmOrganisationFact({ params }: Props) {
  const { id, fact } = await params;
  const { me, owner, access } = await openOrganisation(id, `/organisations/${id}/facts/${fact}/confirm`, 'steward');
  const open = await openFact(me.person.id, owner, fact, true);
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link> &gt; Organisation facts
      </p>
      <h1>Confirm it is not an identifier</h1>
      <ConfirmFact owner={owner} fact={open.fact} />
    </main>
  );
}
